import { SearchX, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ItemsEmptyStateProps {
  filtered: boolean;
  onReset: () => void;
  requiresAuth?: boolean;
}

function ItemsEmptyState({ filtered, onReset, requiresAuth = false }: ItemsEmptyStateProps) {
  const { user } = useAuth();

  if (requiresAuth && !user) {
    return (
      <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center py-16 px-4 text-center">
        <LogIn className="h-16 w-16 text-primary-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Sign in to view items</h3>
        <p className="text-gray-500 max-w-md mb-6">
          Please sign in or create an account to view and interact with lost and found items.
        </p>
        <div className="flex gap-4">
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-outline">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center py-16 px-4 text-center">
      <SearchX className="h-16 w-16 text-gray-400 mb-4" />
      
      {filtered ? (
        <>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No matching items found</h3>
          <p className="text-gray-500 max-w-md mb-6">
            We couldn't find any items matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <button
            onClick={onReset}
            className="btn btn-primary"
          >
            Reset Filters
          </button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No items yet</h3>
          <p className="text-gray-500 max-w-md">
            There are currently no items to display. Check back later or be the first to post a lost or found item.
          </p>
        </>
      )}
    </div>
  );
}

export default ItemsEmptyState;