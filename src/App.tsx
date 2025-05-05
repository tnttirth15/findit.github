import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ItemDetails from './pages/ItemDetails';
import CreateItem from './pages/CreateItem';
import EditItem from './pages/EditItem';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './contexts/AuthContext';  // Import AuthProvider
import { ToasterProvider } from './components/ui/Toaster';  // Import ToasterProvider

function App() {
  return (
    <ToasterProvider>  {/* Wrap everything in ToasterProvider */}
      <AuthProvider>  {/* Wrap everything in AuthProvider */}
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="items/:id" element={<ItemDetails />} />
            
            {/* Protected routes */}
            <Route path="dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="items/create" element={
              <PrivateRoute>
                <CreateItem />
              </PrivateRoute>
            } />
            <Route path="items/edit/:id" element={
              <PrivateRoute>
                <EditItem />
              </PrivateRoute>
            } />
            
            {/* Admin routes */}
            <Route path="admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
            
            {/* Error routes */}
            <Route path="error" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ToasterProvider>
  );
}

export default App;
