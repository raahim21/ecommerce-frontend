import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkmodeToggle';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLocalLoading(true);

    try {
      const data = await register(form);
      setMsg(data.msg);
      setTimeout(() => navigate('/login'), 2000); // Auto-redirect after success
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  // Same conditional classes as Login
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

      <div className={`rounded-2xl shadow-xl w-full max-w-md p-8 border relative ${cardBg}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mx-auto mb-4 shadow-lg"></div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Join ShopHub today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition ${inputBg}`}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition ${inputBg}`}
          />
          <input
            type="password"
            placeholder="Password (6+ characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition ${inputBg}`}
          />
          <button
            type="submit"
            disabled={localLoading}
            className={`w-full py-3 rounded-xl font-semibold transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed ${buttonBg}`}
          >
            {localLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {msg && (
          <div
            className={`mt-5 p-4 rounded-xl text-center font-medium border ${
              msg.includes('sent') || msg.includes('Check') ? msgSuccess : msgError
            }`}
          >
            {msg}
          </div>
        )}

        <p className={`text-center mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link to="/login" className={`font-semibold hover:underline ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}