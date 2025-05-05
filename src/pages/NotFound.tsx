import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Search className="mx-auto h-16 w-16 text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;