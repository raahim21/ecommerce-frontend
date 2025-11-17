






























// cartThunks.js
// ===============================================
// ASYNC THUNKS FOR CART OPERATIONS
// Communicates with backend API, returns updated cart
// Used with cartSlice extraReducers
// ===============================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

// Base API URL from .env (e.g. http://localhost:5000)
const API = import.meta.env.VITE_API_BASE_URL;

// ===============================================
// 1. FETCH USER'S CART FROM SERVER
// ===============================================
export const fetchServerCart = createAsyncThunk(
  'cart/fetch', // Action prefix: cart/fetch/pending|fulfilled|rejected
  async (_, { rejectWithValue }) => {
    // '_' = no argument passed
    try {
      // GET /api/cart → requires session cookie
      const res = await fetch(`${API}/api/cart`, {
        credentials: 'include', // Send cookies (auth)
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();
      // Backend returns: { cart: [...] }
      return data.cart; // This goes to fulfilled(payload)
    } catch (error) {
      // Return error message to rejected(payload)
      return rejectWithValue('Failed');
    }
  }
);

// Data Flow:
// UI (on login) → dispatch(fetchServerCart())
// → API GET /api/cart
// → Server returns cart
// → fulfilled → cartSlice sets state.items

// ===============================================
// 2. ADD ITEM TO SERVER CART
// ===============================================
export const addToServerCart = createAsyncThunk(
  'cart/add',
  async (item, { rejectWithValue }) => {
    // `item` = { variantId, quantity, price, ... }
    try {
      // Step 1: Send add request
      await fetch(`${API}/api/cart`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      // Step 2: Refetch full cart to ensure sync
      const res = await fetch(`${API}/api/cart`, { credentials: 'include' });
      const { cart } = await res.json();

      return cart; // → fulfilled → updates entire cart in Redux
    } catch {
      return rejectWithValue('Failed');
    }
  }
);

// Why refetch full cart?
// → Ensures UI has latest server truth (avoids race conditions)
// → Backend may apply business logic (promotions, stock check)

// ===============================================
// 3. UPDATE ITEM QUANTITY ON SERVER
// ===============================================
export const updateServerQuantity = createAsyncThunk(
  'cart/update',
  async ({ variantId, quantity }, { rejectWithValue }) => {
    try {
      // PATCH /api/cart/:variantId → update quantity
      let req= await fetch(`${API}/api/cart/${variantId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      
      if(req.status==400){
        toast.error('not enough stock')
      }

      // Refetch full cart
      const res = await fetch(`${API}/api/cart`, { credentials: 'include' });
      let data = await res.json();
      
      const { cart } = data
      
    

      return cart;
    } catch {
      return rejectWithValue('Failed');
    }
  }
);

// Data Flow:
// UI → dispatch(updateServerQuantity({ variantId, quantity }))
// → PATCH /api/cart/:id
// → GET /api/cart
// → fulfilled → cartSlice replaces state.items

// ===============================================
// 4. REMOVE ITEM FROM SERVER CART
// ===============================================
export const removeFromServerCart = createAsyncThunk(
  'cart/remove',
  async (variantId, { rejectWithValue }) => {
    try {
      // DELETE /api/cart/:variantId
      await fetch(`${API}/api/cart/${variantId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      // Refetch full cart
      const res = await fetch(`${API}/api/cart`, { credentials: 'include' });
      const { cart } = await res.json();

      return cart;
    } catch {
      return rejectWithValue('Failed');
    }
  }
);

// ===============================================
// 5. SWAP VARIANT (e.g. change size/color)
// ===============================================
export const swapVariant = createAsyncThunk(
  'cart/swapVariant',
  async ({ oldVariantId, newVariant, quantity, productId }, { rejectWithValue, getState }) => {
    // Payload shape: { oldVariantId, newVariant: { _id, size, ... }, quantity, productId }
    try {
      const res = await fetch(`${API}/api/cart/swap`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldVariantId,
          newVariantId: newVariant._id,
          quantity: quantity || 1,
          productId: productId || newVariant.productId, // fallback
        }),
      });

      if (!res.ok) {
        // Try to parse error message from server
        const error = await res.json().catch(() => ({ message: 'Failed to swap variant' }));
        throw new Error(error.message);
      }

      const data = await res.json();
      return data.cart; // → fulfilled → update cart
    } catch (err) {
      return rejectWithValue(err.message); // → rejected → show toast
    }
  },
  {
    // ===========================================
    // CONDITION: Prevent duplicate requests
    // ===========================================
    condition: ({ oldVariantId }, { getState }) => {
      const { cart } = getState(); // Access current Redux state
      // If already loading this variant → skip dispatch
      return !cart.itemLoading[oldVariantId];
    },
  }
);

// Why `condition`?
// → Prevents race condition if user clicks "Change Size" twice
// → Works with `itemLoading[oldVariantId] = true` in slice

// ===============================================
// 6. MERGE LOCAL (GUEST) CART → SERVER (after login)
// ===============================================
export const mergeLocalToServer = createAsyncThunk(
  'cart/merge',
  async (_, { getState }) => {
    // Read guest cart from localStorage
    const local = JSON.parse(localStorage.getItem('guestCart') || '[]');

    // If nothing to merge → skip
    if (!local.length) return;

    // Send each local item to server in parallel
    await Promise.all(
      local.map(item =>
        fetch(`${API}/api/cart`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        })
      )
    );

    // Clean up: remove guest cart
    localStorage.removeItem('guestCart');

    // Refetch final cart state
    const res = await fetch(`${API}/api/cart`, { credentials: 'include' });
    const data = await res.json();
    return data.cart;
  }
);

// Data Flow (Login Flow):
// 1. User logs in
// 2. dispatch(mergeLocalToServer())
// 3. localStorage → POST each item → server
// 4. localStorage cleared
// 5. GET /api/cart → return full cart
// 6. cartSlice → state.items = server cart

// ===============================================
// 7. CLEAR ENTIRE SERVER CART
// ===============================================
export const clearServerCart = createAsyncThunk(
  'cart/clearServer',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/cart/clear`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to clear cart');

      const { cart } = await res.json();
      return cart; // Usually [] → empty
    } catch {
      return rejectWithValue('Failed');
    }
  }
);