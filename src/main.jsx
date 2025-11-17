import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext.jsx';
import { Provider } from 'react-redux';
import { store } from './store.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  
  <Provider store={store}>
    <AuthProvider>
  <ThemeProvider>
    
    <App />
    
  </ThemeProvider>
  </AuthProvider>
  </Provider>
  
  // {/* </StrictMode>, */}
)
