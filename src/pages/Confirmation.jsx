// src/pages/Confirmed.jsx
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkmodeToggle';
import { useTheme } from '../context/ThemeContext';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function Confirmed() {
  const { darkMode } = useTheme();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  // ✅ Use plain JS without TypeScript type annotation
  const [status, setStatus] = useState('loading'); // 'loading', 'success', or 'error'
  const [msg, setMsg] = useState('Verifying your email…');

  // ────── Conditional class helpers ──────
  const pageBg = darkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900';

  const cardBg = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const msgSuccess = darkMode
    ? 'bg-green-900/30 border-green-800 text-green-300'
    : 'bg-green-50 border-green-200 text-green-700';

  const msgError = darkMode
    ? 'bg-red-900/30 border-red-800 text-red-300'
    : 'bg-red-50 border-red-200 text-red-700';

  // ────── Verify token ──────
  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMsg('No verification token found.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/auth/verify/${token}`,
          { credentials: 'include' }
        );
        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMsg(data.msg || 'Email verified! You can now log in.');
        } else {
          setStatus('error');
          setMsg(data.msg || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMsg('Network error. Please try again.');
      }
    };

    verify();
  }, [token]);

  // ────── UI ──────
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${pageBg}`}>
      {/* Dark-mode toggle */}
      <div className="absolute top-3 right-3">
        <DarkModeToggle />
      </div>

      {/* Card */}
      <div
        className={`rounded-2xl shadow-xl w-full max-w-md p-8 border relative ${cardBg}`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mx-auto mb-4 shadow-lg"></div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Email Verification
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {status === 'loading' ? 'Please wait…' : 'Verification complete'}
          </p>
        </div>

        {/* Status message */}
        <div
          className={`mt-5 p-4 rounded-xl text-center font-medium border ${
            status === 'success' ? msgSuccess : msgError
          }`}
        >
          {msg}
        </div>

        {/* Action button */}
        {status !== 'loading' && (
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className={`inline-block px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] ${
                darkMode
                  ? 'bg-purple-700 hover:bg-purple-600 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
              }`}
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
