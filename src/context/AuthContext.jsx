

import { createContext, useContext, useState, useEffect } from 'react';
import { store } from '../store';
import { useDispatch } from 'react-redux';
import { clearLocal, loadLocalCart } from '../features/cart/cartSlice';
import { clearServerCart } from '../features/cart/cartThunks';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch(); // Add this if not already imported/available; otherwise, import and use it here.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || 'Login failed');

    // Set the user, which will trigger the cart sync in `useCart` hook
    await dispatch(clearLocal())
    await checkAuth();
  };

  const register = async (data) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.msg || 'Registration failed');

    return responseData;
  };


// AuthContext.jsx
const logout = async () => {
  // 1. Save current cart for guest mode
  const serverCart = store.getState().cart.items;
  localStorage.setItem('guestCart', JSON.stringify(serverCart));

  // 2. **ONE** request to wipe the server cart
  try {
    // await dispatch(clearServerCart()).unwrap();
  } catch (e) {
    console.error('Failed to clear server cart on logout', e);
  }

  // 3. Logout request
  try {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (e) {
    console.error('Logout request failed', e);
  }

  setUser(null);
  dispatch(loadLocalCart());   // show the saved guest cart immediately
};




// ... (rest of the file unchanged)
  const resetPassword = async (token, password) => {
    const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || 'Failed to reset password.');
    
    await checkAuth();
    return data;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
    // forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
