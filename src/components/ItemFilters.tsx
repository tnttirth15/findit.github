import { useEffect, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
}

interface ItemFiltersProps {
  onFilterChange: (filters: {
    search: string;
    itemType: string;
    categoryId: string;
  }) => void;
  initialValues?: {
    search?: string;
    itemType?: string;
    categoryId?: string;
  };
}

function ItemFilters({ onFilterChange, initialValues = {} }: ItemFiltersProps) {
  const [search, setSearch] = useState(initialValues.search || '');
  const [itemType, setItemType] = useState(initialValues.itemType || '');
  const [categoryId, setCategoryId] = useState(initialValues.categoryId || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/items/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Apply filters
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search, itemType, categoryId });
  };

  // Reset filters
  const handleReset = () => {
    setSearch('');
    setItemType('');
    setCategoryId('');
    onFilterChange({ search: '', itemType: '', categoryId: '' });
  };

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          {/* Search input - visible on all screen sizes */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for items..."
              className="form-input pl-10 pr-12 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              <button
                type="button"
                onClick={toggleFilters}
                className="md:hidden text-gray-500 p-1 ml-1"
                aria-label="Toggle filters"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters - always visible on desktop, toggleable on mobile */}
          <div className={`${filtersVisible ? 'block' : 'hidden'} md:flex md:space-x-4 space-y-4 md:space-y-0 md:items-center animate-fade-in`}>
            {/* Item Type Filter */}
            <div className="md:w-1/3">
              <label htmlFor="itemType" className="form-label">Item Type</label>
              <select
                id="itemType"
                className="form-input"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="md:w-1/3">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                className="form-input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex md:items-end md:self-end space-x-2 pb-0.5">
              <button
                type="submit"
                className="btn btn-primary flex-1 md:flex-none"
              >
                Apply
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline flex-1 md:flex-none"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ItemFilters;