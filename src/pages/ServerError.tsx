import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

function ServerError() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-error-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Server Error</h1>
        <p className="text-gray-600 mb-8">
          Something went wrong on our end. Please try again later or contact support if the problem persists.
        </p>
        <div className="space-x-4">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-outline"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServerError;