import { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';
import ItemFilters from './ItemFilters';
import ItemsEmptyState from './ItemsEmptyState';
import { Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  uuid: string;
  title: string;
  description: string;
  item_type: 'lost' | 'found';
  date_posted: string;
  date_occurred: string;
  location: string;
  image_url: string | null;
  is_resolved: boolean;
  category: Category;
  user_id: number;
}

interface ItemListProps {
  initialFilters?: {
    search?: string;
    itemType?: string;
    categoryId?: string;
  };
  showFilters?: boolean;
  maxItems?: number;
  userId?: number;
  requiresAuth?: boolean;
}

function ItemList({ initialFilters = {}, showFilters = true, maxItems, userId, requiresAuth = false }: ItemListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    itemType: initialFilters.itemType || '',
    categoryId: initialFilters.categoryId || '',
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If authentication is required and user is not logged in, don't fetch
        if (requiresAuth && !user) {
          setItems([]);
          return;
        }
        
        let url = userId 
          ? '/api/items/mine' 
          : '/api/items';
          
        // Add query params if any filters are set
        const params = new URLSearchParams();
        
        if (filters.search) {
          params.append('search', filters.search);
        }
        
        if (filters.itemType) {
          params.append('type', filters.itemType);
        }
        
        if (filters.categoryId) {
          params.append('category', filters.categoryId);
        }
        
        const queryString = params.toString();
        if (queryString) {
          url = `${url}?${queryString}`;
        }
        
        const response = await axios.get(url);
        
        let itemsList = response.data.items;
        
        // Apply maxItems limit if specified
        if (maxItems && itemsList.length > maxItems) {
          itemsList = itemsList.slice(0, maxItems);
        }
        
        setItems(itemsList);
      } catch (err) {
        console.error('Failed to fetch items:', err);
        setError('Failed to load items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [filters, userId, maxItems, requiresAuth, user]);

  const handleFilterChange = (newFilters: {
    search: string;
    itemType: string;
    categoryId: string;
  }) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="h-10 w-10 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => setFilters({ search: '', itemType: '', categoryId: '' })}
          className="btn btn-outline mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        {showFilters && (
          <ItemFilters 
            onFilterChange={handleFilterChange}
            initialValues={initialFilters}
          />
        )}
        <ItemsEmptyState 
          filtered={!!(filters.search || filters.itemType || filters.categoryId)}
          onReset={() => setFilters({ search: '', itemType: '', categoryId: '' })}
          requiresAuth={requiresAuth}
        />
      </div>
    );
  }

  return (
    <div>
      {showFilters && (
        <ItemFilters 
          onFilterChange={handleFilterChange}
          initialValues={initialFilters}
        />
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            uuid={item.uuid}
            title={item.title}
            description={item.description}
            itemType={item.item_type}
            datePosted={item.date_posted}
            dateOccurred={item.date_occurred}
            location={item.location}
            imageUrl={item.image_url}
            isResolved={item.is_resolved}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
}

export default ItemList;