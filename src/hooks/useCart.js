import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import {
  fetchServerCart,
  mergeLocalToServer,
  addToServerCart,
  updateServerQuantity,
  removeFromServerCart,
  swapVariant,
  clearServerCart,
} from '../features/cart/cartThunks';

import {
  addLocal,
  updateLocal,
  removeLocal,
  swapLocalVariant,
  loadLocalCart,
} from '../features/cart/cartSlice';

const globalSyncRef = { current: false };


export const useCart = () => {
  const hasSynced = globalSyncRef;
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(null);

  const { user, isAuthenticated } = useAuth();
  let { items, loading, itemLoading = {} } = useSelector(s => s.cart);

  items = useMemo(() => items.map(i => ({
    ...i,
    price: Number(i.price) || 0,
    quantity: Number(i.quantity) || 1,
  })), [items]);

  
  useEffect(() => {
  if (isAuthenticated && !hasSynced.current) {
    hasSynced.current = true;
    dispatch(fetchServerCart());
    dispatch(mergeLocalToServer());
  } else if (!isAuthenticated) {
    dispatch(loadLocalCart());
  }
}, [isAuthenticated, dispatch]);



  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2);

  const [adding, setAdding] = useState(null);

  const add = async (item) => {
    setAdding(item.variantId);
    try {
      if (isAuthenticated) {
        
        await dispatch(addToServerCart(item)).unwrap();
      } else {
        dispatch(addLocal(item));
      }
      toast.success(`Added ${item.size} to cart!`);
    } catch {
      toast.error('Failed to add');
    } finally {
      setAdding(null);
    }
  };

  const update = async ({ variantId, quantity }) => {
  if (quantity <= 0) return remove(variantId);

  setUpdating(variantId);
  try {
    if (isAuthenticated) {
      await dispatch(updateServerQuantity({ variantId, quantity })).unwrap();
    } else {
      dispatch(updateLocal({ variantId, quantity }));
    }
  } catch (err) {
    toast.error('Failed to update');
  } finally {
    setUpdating(null);
  }
};

const remove = async (variantId) => {
  setUpdating(variantId);
  try {
    if (isAuthenticated) {
      await dispatch(removeFromServerCart(variantId)).unwrap();
    } else {
      dispatch(removeLocal(variantId));
    }
    toast.success('Removed');
  } finally {
    setUpdating(null);
  }
};

  const cartItems = useSelector(state => state.cart.items);
  
  const swap = useCallback((oldVariantId, newVariant) => {
    const item = cartItems.find(i => i.variantId === oldVariantId);
    if (!item) {
      // This case would be hit on subsequent swaps due to the stale closure.
      // Returning a rejected promise makes the error explicit and ensures the UI catch block is triggered.
      console.error("Attempted to swap a variant that was not found in the cart.", oldVariantId);
      return Promise.reject(new Error('Item not found in cart'));
    }

    if (!user) {
      dispatch(swapLocalVariant({ oldVariantId, newVariant }));
      return Promise.resolve();
    }

    return dispatch(swapVariant({
      oldVariantId,
      newVariant,
      quantity: item.quantity,
      productId: item.productId,
    })).unwrap();
  }, [dispatch, user, cartItems]); // FIX: Added `cartItems` to dependency array


  return {
    items,
    totalItems,
    clearServerCart,
    totalPrice,
    loading,
    itemLoading,
    adding,
    updating, 
    add,
    update,
    remove,
    swap,
  };
};



