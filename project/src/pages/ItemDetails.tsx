import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Calendar, Tag, Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { formatDateTime, timeAgo } from '../utils/formatters';

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

function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/items/${id}`);
        setItem(response.data.item);
      } catch (err) {
        console.error('Failed to fetch item:', err);
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axios.delete(`/api/items/${id}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete item:', err);
      setError('Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="container-custom mx-auto py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="aspect-video bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container-custom mx-auto py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Item</h2>
          <p className="text-red-600 mb-4">{error || 'Item not found'}</p>
          <Link to="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === item.user_id;

  return (
    <div className="container-custom mx-auto py-12">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Posted {timeAgo(item.date_posted)}
                </span>
                <span className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {item.category.name}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.item_type === 'lost' 
                    ? 'bg-error-100 text-error-800'
                    : 'bg-success-100 text-success-800'
                }`}>
                  {item.item_type.toUpperCase()}
                </span>
                {item.is_resolved && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolved
                  </span>
                )}
              </div>
            </div>
            
            {isOwner && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/items/edit/${item.id}`}
                  className="btn btn-outline flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="btn btn-outline text-error-600 hover:bg-error-50 hover:border-error-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image */}
          <div className="space-y-6">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
            
            {/* Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                <p className="flex items-center text-gray-900">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {item.location}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Date Occurred</h3>
                <p className="flex items-center text-gray-900">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {formatDateTime(item.date_occurred)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">What to do next?</h3>
              {item.item_type === 'lost' ? (
                <p className="text-gray-700">
                  If you've found this item, please contact the owner through the platform.
                  They will be notified and can arrange the return of their item.
                </p>
              ) : (
                <p className="text-gray-700">
                  If this is your item, please contact the finder through the platform.
                  They will help arrange the return of your belongings.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;