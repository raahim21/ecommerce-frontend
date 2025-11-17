// src/hooks/useWishlist.js
import { useDispatch, useSelector } from 'react-redux';
import {
  addItem,
  removeItem,
  selectWishlist,
  selectWishlistCount,
} from '../features/wishlist/wishlistSlice';
import toast from 'react-hot-toast';

export const useWishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlist);
  const count = useSelector(selectWishlistCount);

  const add = (product, variant) => {
    const payload = {
      productId: product._id,
      variantId: variant._id,
      product,
      variant,
    };
    const already = items.some(i => i.variantId === variant._id);
    if (already) {
      toast.error('Already in wishlist');
      return;
    }
    dispatch(addItem(payload));
    toast.success('Added to wishlist');
  };

  const remove = variantId => {
    dispatch(removeItem(variantId));
    toast.success('Removed from wishlist');
  };

  const toggle = (product, variant) => {
    const exists = items.some(i => i.variantId === variant._id);
    if (exists) remove(variant._id);
    else add(product, variant);
  };

  const isInWishlist = variantId => items.some(i => i.variantId === variantId);

  return { items, count, add, remove, toggle, isInWishlist };
};