import { Link } from 'react-router-dom';
import { MapPin, Mail, Github as GitHub } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-7 w-7 text-primary-500" />
              <span className="text-xl font-bold">FindIt</span>
            </Link>
            <p className="text-gray-400">
              Connecting lost belongings with their owners. Our platform makes it easy to report lost
              items and find things that others have found.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <a href="mailto:contact@findit.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                  contact@findit.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <GitHub className="h-5 w-5 text-gray-400" />
                <a href="https://github.com/findit" className="text-gray-400 hover:text-primary-400 transition-colors" target="_blank" rel="noopener noreferrer">
                  github.com/findit
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500">
            © {currentYear} FindIt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;