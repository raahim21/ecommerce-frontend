// src/store/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';

// shape of one item
// { productId, variantId, product: {...}, variant: {...} }

const loadInitial = () => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: loadInitial() },
  reducers: {
    addItem(state, action) {
      const payload = action.payload; // {productId, variantId, product, variant}
      const exists = state.items.some(i => i.variantId === payload.variantId);
      if (!exists) state.items.push(payload);
    },
    removeItem(state, action) {
      const variantId = action.payload;
      state.items = state.items.filter(i => i.variantId !== variantId);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

/* ---- persist on every change ---- */
const originalReducer = wishlistSlice.reducer;
wishlistSlice.reducer = (state, action) => {
  const newState = originalReducer(state, action);
  if (typeof window !== 'undefined') {
    localStorage.setItem('wishlist', JSON.stringify(newState.items));
  }
  return newState;
};

export const { addItem, removeItem, clearWishlist } = wishlistSlice.actions;

export const selectWishlist = state => state.wishlist.items;
export const selectWishlistCount = state => state.wishlist.items.length;

export default wishlistSlice.reducer;