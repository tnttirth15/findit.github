import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Menu, X, MapPin, LogOut, User, PlusCircle } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom mx-auto">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-900">FindIt</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? "text-primary-600 font-medium" 
                  : "text-gray-700 hover:text-primary-500 transition-colors"
              }
              end
            >
              Home
            </NavLink>
            {user ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-primary-600 font-medium" 
                      : "text-gray-700 hover:text-primary-500 transition-colors"
                  }
                >
                  Dashboard
                </NavLink>
                <Link 
                  to="/items/create" 
                  className="btn btn-primary flex items-center space-x-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Post Item</span>
                </Link>
                {user.is_admin && (
                  <NavLink 
                    to="/admin" 
                    className={({ isActive }) => 
                      isActive 
                        ? "text-secondary-600 font-medium" 
                        : "text-gray-700 hover:text-secondary-500 transition-colors"
                    }
                  >
                    Admin
                  </NavLink>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-500 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-primary-600 font-medium" 
                      : "text-gray-700 hover:text-primary-500 transition-colors"
                  }
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Register
                </NavLink>
              </>
            )}
            <button 
              onClick={toggleSearch}
              className="text-gray-700 hover:text-primary-500 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button 
              onClick={toggleSearch}
              className="text-gray-700"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={toggleMenu}
              className="text-gray-700"
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Search Panel */}
      {searchOpen && (
        <div className="absolute top-16 inset-x-0 bg-white shadow-md p-4 animate-fade-in">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for lost or found items..."
                className="form-input pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-1 px-3 text-sm"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md animate-slide-up">
          <div className="container-custom mx-auto py-4 flex flex-col space-y-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? "text-primary-600 font-medium p-2" 
                  : "text-gray-700 p-2"
              }
              onClick={() => setMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            {user ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-primary-600 font-medium p-2" 
                      : "text-gray-700 p-2"
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <Link 
                  to="/items/create" 
                  className="btn btn-primary justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Post Item
                </Link>
                {user.is_admin && (
                  <NavLink 
                    to="/admin" 
                    className={({ isActive }) => 
                      isActive 
                        ? "text-secondary-600 font-medium p-2" 
                        : "text-gray-700 p-2"
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </NavLink>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 p-2 text-left flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-primary-600 font-medium p-2" 
                      : "text-gray-700 p-2"
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </div>
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="btn btn-primary justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;