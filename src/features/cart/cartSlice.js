// import { createSlice } from '@reduxjs/toolkit';
// import {
//   fetchServerCart,
//   addToServerCart,
//   updateServerQuantity,
//   removeFromServerCart,
//   mergeLocalToServer,
//   swapVariant,
//   clearServerCart,
// } from './cartThunks';



// const loadLocal = () => {
//   try {
//     const data = JSON.parse(localStorage.getItem('guestCart') || '[]');
//     return data.map(i => ({
//       ...i,
//       price: Number(i.price) || 0,
//       quantity: Number(i.quantity) || 1,
//     }));
//   } catch {
//     return [];
//   }
// };

// const saveLocal = (items) => {
//   localStorage.setItem('guestCart', JSON.stringify(items));
// };

// const initialState = {
//   items: [],
//   loading: false,
//   itemLoading: {},
//   error: null,
// };

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     loadLocalCart: (state) => {
//       state.items = loadLocal();
//     },

//     addLocal: (state, action) => {
//       const payload = action.payload;
//       const item = {
//         ...payload,
//         price: Number(payload.price) || 0,
//         quantity: Number(payload.quantity) || 1,
//       };
//       const existing = state.items.find(i => i.variantId === item.variantId);
//       if (existing) {
//         existing.quantity += item.quantity;
//       } else {
//         state.items.push(item);
//       }
//       saveLocal(state.items);
//     },

// swapLocalVariant: (state, action) => {
//   const { oldVariantId, newVariant } = action.payload;
//   const existingIndex = state.items.findIndex(i => i.variantId === oldVariantId);

//   if (existingIndex === -1) return;

//   const oldItem = state.items[existingIndex];

//   // Use all relevant data from newVariant
//   const updatedItem = {
//     ...oldItem,
//     variantId: newVariant._id,
//     size: newVariant.size,
//     price: Number(newVariant.price) || 0,
//     image: newVariant.image || oldItem.image,
//     name: newVariant.name || oldItem.name,
//     // Add any other fields you want to preserve
//   };

//   state.items[existingIndex] = updatedItem;

//   // Save full normalized item to localStorage
//   saveLocal(state.items.map(i => ({
//     variantId: i.variantId,
//     productId: i.productId,
//     name: i.name,
//     image: i.image,
//     price: Number(i.price),
//     quantity: Number(i.quantity),
//     size: i.size,
//     subCategory: i.subCategory,
//   })));
// },




//     updateLocal: (state, action) => {
//       const { variantId, quantity } = action.payload;
//       const item = state.items.find(i => i.variantId === variantId);
//       if (item) {
//         if (quantity <= 0) {
//           state.items = state.items.filter(i => i.variantId !== variantId);
//         } else {
//           item.quantity = quantity;
//         }
//         saveLocal(state.items);
//       }
//     },
//     removeLocal: (state, action) => {
//       const variantId = action.payload;
//       state.items = state.items.filter(i => i.variantId !== variantId);
//       saveLocal(state.items);
//     },
//     clearLocal: () => {
//       localStorage.removeItem('guestCart');
//     },
//   },
//   extraReducers: (builder) => {
//     // FETCH
//     builder
//       .addCase(fetchServerCart.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchServerCart.fulfilled, (state, action) => {
//         state.loading = false;
        
//         state.items = (action.payload || []).map(i => ({
//           ...i,
//           price: Number(i.price) || 0,
//           quantity: Number(i.quantity) || 1,
//         }));
//       })
//       .addCase(fetchServerCart.rejected, (state) => {
//         state.loading = false;
//       });

//     // ADD (server)
//     builder.addCase(addToServerCart.fulfilled, (state, action) => {
//       state.items = (action.payload || []).map(i => ({
//         ...i,
//         price: Number(i.price) || 0,
//         quantity: Number(i.quantity) || 1,
//       }));
//     });

//     // UPDATE QUANTITY
//     builder
//       .addCase(updateServerQuantity.pending, (state, action) => {
//         state.itemLoading[action.meta.arg.variantId] = true;
//       })
//       .addCase(updateServerQuantity.fulfilled, (state, action) => {
//         state.items = (action.payload || []).map(i => ({
//           ...i,
//           price: Number(i.price) || 0,
//           quantity: Number(i.quantity) || 1,
//         }));
//         state.itemLoading = {};
//       })
//       .addCase(updateServerQuantity.rejected, (state, action) => {
//         delete state.itemLoading[action.meta.arg.variantId];
//       });

//     // REMOVE
//     builder
//       .addCase(removeFromServerCart.pending, (state, action) => {
//         state.itemLoading[action.meta.arg] = true;
//       })
//       .addCase(removeFromServerCart.fulfilled, (state, action) => {
//         state.items = (action.payload || []).map(i => ({
//           ...i,
//           price: Number(i.price) || 0,
//           quantity: Number(i.quantity) || 1,
//         }));
//         state.itemLoading = {};
//       });

//     // MERGE LOCAL TO SERVER (after login)
//     builder.addCase(mergeLocalToServer.fulfilled, (state, action) => {
//       state.items = (action.payload || []).map(i => ({
//         ...i,
//         price: Number(i.price) || 0,
//         quantity: Number(i.quantity) || 1,
//       }));
//       localStorage.removeItem('guestCart');
//     })



//     builder.// cartSlice.js  (extraReducers)
//     addCase(clearServerCart.fulfilled, (state, action) => {
//   state.items = (action.payload || []).map(i => ({
//     ...i,
//     price: Number(i.price) || 0,
//     quantity: Number(i.quantity) || 1,
//   }));
// })

//     builder
//   .addCase(swapVariant.pending, (state, action) => {
//     const { oldVariantId } = action.meta.arg;
//     state.itemLoading[oldVariantId] = true;
//   })
//   .addCase(swapVariant.fulfilled, (state, action) => {
//     state.itemLoading = {};
//     state.items = (action.payload || []).map(i => ({
//       ...i,
//       price: Number(i.price) || 0,
//       quantity: Number(i.quantity) || 1,
//     }));
//   })
//   .addCase(swapVariant.rejected, (state, action) => {
//     delete state.itemLoading[action.meta.arg.oldVariantId];
//   });
    

//   },
// });

// export const { addLocal, updateLocal, removeLocal, clearLocal, swapLocalVariant, loadLocalCart } = cartSlice.actions;
// export default cartSlice.reducer;




















// cartSlice.js
// ===============================================
// CART REDUX SLICE WITH LOCAL & SERVER SYNC
// Focus: Data flow, immutability, async thunks
// ===============================================

import { createSlice } from '@reduxjs/toolkit';

// Async thunks (defined in cartThunks.js) handle server communication
import {
  fetchServerCart,        // GET /cart → fetch user's cart from backend
  addToServerCart,        // POST /cart/add → add item to server cart
  updateServerQuantity,   // PATCH /cart/update → change qty on server
  removeFromServerCart,   // DELETE /cart/remove → remove item from server
  mergeLocalToServer,     // POST /cart/merge → send guest cart to server after login
  swapVariant,            // PATCH /cart/swap → replace variant (e.g. size change)
  clearServerCart,        // DELETE /cart/clear → empty server cart
} from './cartThunks';



// ===============================================
// LOCAL STORAGE HELPERS
// ===============================================

/**
 * Load cart from localStorage (for guest users)
 * Data Flow: localStorage → Redux state (on app load)
 */
const loadLocal = () => {
  try {
    // Read raw string from localStorage under key 'guestCart'
    const raw = localStorage.getItem('guestCart') || '[]';
    const data = JSON.parse(raw); // Parse into JS array

    // Normalize data: ensure price/quantity are numbers
    return data.map(i => ({
      ...i,
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
    }));
  } catch (error) {
    console.error('Failed to load guest cart:', error);
    return []; // Return empty on parse error
  }
};

/**
 * Save current cart items to localStorage
 * Data Flow: Redux state → localStorage (after every local mutation)
 */
const saveLocal = (items) => {
  // Only store necessary fields to keep storage light
  const normalized = items.map(i => ({
    variantId: i.variantId,
    productId: i.productId,
    name: i.name,
    image: i.image,
    price: Number(i.price),
    quantity: Number(i.quantity),
    size: i.size,
    subCategory: i.subCategory,
  }));
  localStorage.setItem('guestCart', JSON.stringify(normalized));
};



// ===============================================
// INITIAL STATE
// ===============================================

const initialState = {
  items: [],                    // Array of cart items (both guest & logged-in)
  loading: false,               // Global loading for fetch operations
  itemLoading: {},              // Per-item loading { variantId: true }
  error: null,                  // Global error (not used much here)
};



// ===============================================
// CREATE SLICE (Redux Toolkit)
// ===============================================

const cartSlice = createSlice({
  name: 'cart',                 // Slice name → action types: cart/addLocal
  initialState,                 // Starting state
  reducers: {                   // === SYNC ACTIONS (mostly for guest cart) ===

    // -------------------------------------------------
    // 1. LOAD LOCAL CART INTO REDUX (on app init)
    // -------------------------------------------------
    loadLocalCart: (state) => {
      // Data Flow: localStorage → Redux state
      state.items = loadLocal(); // Replace items with persisted guest cart
    },

    // -------------------------------------------------
    // 2. ADD ITEM TO GUEST CART (no server)
    // -------------------------------------------------
    addLocal: (state, action) => {
      const payload = action.payload; // { variantId, price, quantity, ... }

      // Normalize incoming item
      const item = {
        ...payload,
        price: Number(payload.price) || 0,
        quantity: Number(payload.quantity) || 1,
      };

      // Find if this variant already exists
      const existing = state.items.find(i => i.variantId === item.variantId);

      if (existing) {
        // Merge quantity if same variant
        existing.quantity += item.quantity;
      } else {
        // Add new item
        state.items.push(item);
      }

      // Persist to localStorage
      saveLocal(state.items);
      // Data Flow: UI → action → Redux → localStorage
    },

    // -------------------------------------------------
    // 3. SWAP VARIANT (e.g. change size/color)
    // -------------------------------------------------
    swapLocalVariant: (state, action) => {
      const { oldVariantId, newVariant } = action.payload;
      // Find index of item to replace
      const existingIndex = state.items.findIndex(i => i.variantId === oldVariantId);

      if (existingIndex === -1) return; // Nothing to swap

      const oldItem = state.items[existingIndex];

      // Build updated item: preserve quantity, merge new variant data
      const updatedItem = {
        ...oldItem,                    // Keep productId, quantity, etc.
        variantId: newVariant._id,     // New variant ID
        size: newVariant.size,
        price: Number(newVariant.price) || 0,
        image: newVariant.image || oldItem.image,
        name: newVariant.name || oldItem.name,
        // Add more fields if needed (e.g. color, sku)
      };

      // Immutably update array
      state.items[existingIndex] = updatedItem;

      // Save normalized version to localStorage
      saveLocal(state.items.map(i => ({
        variantId: i.variantId,
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: Number(i.price),
        quantity: Number(i.quantity),
        size: i.size,
        subCategory: i.subCategory,
      })));
      // Data Flow: UI → swap action → Redux → localStorage
    },

    // -------------------------------------------------
    // 4. UPDATE QUANTITY (guest cart)
    // -------------------------------------------------
    updateLocal: (state, action) => {
      const { variantId, quantity } = action.payload;

      const item = state.items.find(i => i.variantId === variantId);
      if (!item) return;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        state.items = state.items.filter(i => i.variantId !== variantId);
      } else {
        item.quantity = quantity;
      }

      saveLocal(state.items);
      // Data Flow: UI → update → Redux → localStorage
    },

    // -------------------------------------------------
    // 5. REMOVE ITEM (guest cart)
    // -------------------------------------------------
    removeLocal: (state, action) => {
      const variantId = action.payload;
      state.items = state.items.filter(i => i.variantId !== variantId);
      saveLocal(state.items);
      // Data Flow: UI → remove → Redux → localStorage
    },

    // -------------------------------------------------
    // 6. CLEAR GUEST CART (e.g. after login merge)
    // -------------------------------------------------
    clearLocal: () => {
      localStorage.removeItem('guestCart');
      // Note: This does NOT reset Redux state — caller must dispatch reset if needed
    },
  },

  // ===============================================
  // ASYNC THUNKS → extraReducers
  // Handles pending/fulfilled/rejected states
  // ===============================================
  extraReducers: (builder) => {

    // -------------------------------------------------
    // FETCH SERVER CART (after login)
    // -------------------------------------------------
    builder
      .addCase(fetchServerCart.pending, (state) => {
        state.loading = true;           // Show spinner
        state.error = null;
      })
      .addCase(fetchServerCart.fulfilled, (state, action) => {
        state.loading = false;
        // Replace entire cart with server data
        state.items = (action.payload || []).map(i => ({
          ...i,
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
        }));
        // Data Flow: Server → Thunk → Redux
      })
      .addCase(fetchServerCart.rejected, (state) => {
        state.loading = false;
        // Optional: state.error = action.error.message;
      });

    // -------------------------------------------------
    // ADD TO SERVER CART
    // -------------------------------------------------
    builder.addCase(addToServerCart.fulfilled, (state, action) => {
      // Server returns full updated cart
      state.items = (action.payload || []).map(i => ({
        ...i,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
      }));
      // Data Flow: UI → Thunk → Server → Redux
    });

    // -------------------------------------------------
    // UPDATE QUANTITY ON SERVER
    // -------------------------------------------------
    builder
      .addCase(updateServerQuantity.pending, (state, action) => {
        // action.meta.arg contains { variantId, quantity }
        const variantId = action.meta.arg.variantId;
        state.itemLoading[variantId] = true; // Per-item spinner
      })
      .addCase(updateServerQuantity.fulfilled, (state, action) => {
        state.items = (action.payload || []).map(i => ({
          ...i,
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
        }));
        state.itemLoading = {}; // Clear all item loadings
      })
      .addCase(updateServerQuantity.rejected, (state, action) => {
        const variantId = action.meta.arg.variantId;
        delete state.itemLoading[variantId]; // Remove loading flag
      });

    // -------------------------------------------------
    // REMOVE FROM SERVER CART
    // -------------------------------------------------
    builder
      .addCase(removeFromServerCart.pending, (state, action) => {
        // action.meta.arg is variantId
        state.itemLoading[action.meta.arg] = true;
      })
      .addCase(removeFromServerCart.fulfilled, (state, action) => {
        state.items = (action.payload || []).map(i => ({
          ...i,
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
        }));
        state.itemLoading = {};
      });

    // -------------------------------------------------
    // MERGE LOCAL → SERVER (after login)
    // -------------------------------------------------
    builder.addCase(mergeLocalToServer.fulfilled, (state, action) => {
      // Server returns merged cart
      state.items = (action.payload || []).map(i => ({
        ...i,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
      }));
      localStorage.removeItem('guestCart'); // Clear guest cart
      // Data Flow: localStorage → Thunk → Server → Redux → localStorage cleared
    });

    // -------------------------------------------------
    // CLEAR SERVER CART
    // -------------------------------------------------
    builder.addCase(clearServerCart.fulfilled, (state, action) => {
      state.items = (action.payload || []).map(i => ({
        ...i,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
      }));
      // Usually payload is [] → empty cart
    });

    // -------------------------------------------------
    // SWAP VARIANT ON SERVER
    // -------------------------------------------------
    builder
      .addCase(swapVariant.pending, (state, action) => {
        const { oldVariantId } = action.meta.arg;
        state.itemLoading[oldVariantId] = true;
      })
      .addCase(swapVariant.fulfilled, (state, action) => {
        state.itemLoading = {};
        state.items = (action.payload || []).map(i => ({
          ...i,
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
        }));
      })
      .addCase(swapVariant.rejected, (state, action) => {
        const { oldVariantId } = action.meta.arg;
        delete state.itemLoading[oldVariantId];
      });

  }, // end extraReducers
});



// ===============================================
// EXPORT ACTIONS & REDUCER
// ===============================================

// Sync actions (guest cart)
export const {
  addLocal,
  updateLocal,
  removeLocal,
  clearLocal,
  swapLocalVariant,
  loadLocalCart,
} = cartSlice.actions;

// Default export: use in store configuration
export default cartSlice.reducer;