import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface Category {
  id: number;
  name: string;
}

interface ItemCardProps {
  id: number;
  uuid: string;
  title: string;
  description: string;
  itemType: 'lost' | 'found';
  datePosted: string;
  dateOccurred: string;
  location: string;
  imageUrl: string | null;
  isResolved: boolean;
  category: Category;
}

function ItemCard({
  id,
  title,
  description,
  itemType,
  datePosted,
  dateOccurred,
  location,
  imageUrl,
  isResolved,
  category
}: ItemCardProps) {
  // Create a shorter version of the description for the card
  const shortDescription = description.length > 120 
    ? `${description.substring(0, 120)}...` 
    : description;
    
  const statusBadgeClass = itemType === 'lost'
    ? 'bg-error-500'
    : 'bg-success-500';
    
  const resolvedOverlayClass = isResolved 
    ? 'before:absolute before:inset-0 before:bg-gray-900/50 before:z-10' 
    : '';

  return (
    <div 
      className={`card group relative ${resolvedOverlayClass} transition-all duration-300 hover:translate-y-[-4px]`}
    >
      {isResolved && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-gray-900/80 text-white px-4 py-2 rounded-md font-semibold transform rotate-[-10deg]">
            {itemType === 'lost' ? 'Found' : 'Returned'}
          </div>
        </div>
      )}
        
      <div className="relative h-48 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        
        {/* Type Badge */}
        <div className={`absolute top-3 left-3 ${statusBadgeClass} text-white text-sm font-medium px-2 py-1 rounded uppercase`}>
          {itemType}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-gray-900/70 text-white text-sm px-2 py-1 rounded flex items-center">
          <Tag className="w-3 h-3 mr-1" />
          {category.name}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{shortDescription}</p>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(dateOccurred)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        <Link 
          to={`/items/${id}`} 
          className="btn btn-outline w-full text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ItemCard;