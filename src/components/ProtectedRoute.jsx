import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import DarkModeToggle from './DarkmodeToggle';
import { useTheme } from '../context/ThemeContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { darkMode } = useTheme();

  if (loading) {
    const pageBg = darkMode
      ? 'bg-gray-900 text-white'
      : 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900';

    return (
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden ${pageBg}`}
      >
        <div className="absolute top-3 right-3">
          <DarkModeToggle />
        </div>

        <div
          className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin ${
            darkMode ? 'border-purple-500' : 'border-pink-500'
          }`}
        ></div>

        <p className={`mt-6 text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
