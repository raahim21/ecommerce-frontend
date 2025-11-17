import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import DarkModeToggle from '../components/DarkmodeToggle';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError('');
    setMsg('');
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success('Password reset successfully!');
      navigate('/');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };
  
  const pageBg = darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900';
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
  const msgSuccess = darkMode ? 'bg-green-900/30 border-green-800 text-green-300' : 'bg-green-50 border-green-200 text-green-700';
  const msgError = darkMode ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700';
  const buttonBg = darkMode ? 'bg-purple-700 hover:bg-purple-600 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${pageBg}`}>
      <div className="absolute top-3 right-3">
        <DarkModeToggle />
      </div>
      <div className={`rounded-2xl shadow-xl w-full max-w-md p-8 border ${cardBg}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition ${inputBg}`}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition ${inputBg}`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed ${buttonBg}`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        
        {(msg || error) && (
          <div className={`mt-5 p-4 rounded-xl text-center font-medium border ${msg ? msgSuccess : msgError}`}>
            {msg || error}
          </div>
        )}
      </div>
    </div>
  );
}
