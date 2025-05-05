import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ToasterProvider } from './components/ui/Toaster';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToasterProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToasterProvider>
    </BrowserRouter>
  </StrictMode>
);