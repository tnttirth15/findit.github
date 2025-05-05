import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useToast } from '../components/ui/Toaster'; // Make sure this path is correct

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/check-auth', { 
          withCredentials: true,
          timeout: 5000 // 5 second timeout
        });
        
        if (response.data.authenticated) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
          toast('Unable to connect to server. Please try again later.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/auth/login', 
        { username, password }, 
        { withCredentials: true }
      );
      setUser(response.data.user);
      toast('Successfully logged in!', 'success');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Login failed');
        toast(err.response.data.error || 'Login failed', 'error');
      } else {
        setError('An unexpected error occurred');
        toast('An unexpected error occurred', 'error');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/auth/register', 
        { username, email, password }, 
        { withCredentials: true }
      );
      setUser(response.data.user);
      toast('Account created successfully!', 'success');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Registration failed');
        toast(err.response.data.error || 'Registration failed', 'error');
      } else {
        setError('An unexpected error occurred');
        toast('An unexpected error occurred', 'error');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      toast('Successfully logged out', 'success');
    } catch (err) {
      console.error('Logout failed:', err);
      toast('Failed to logout. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
