import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, Loader } from 'lucide-react';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  item_type: 'lost' | 'found';
  category_id: string;
  date_occurred: string;
  location: string;
  image?: FileList;
}

function CreateItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  // Fetch categories when component mounts
  useState(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/items/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  });

  // Handle image preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('item_type', data.item_type);
      formData.append('category_id', data.category_id);
      formData.append('date_occurred', data.date_occurred);
      formData.append('location', data.location);
      
      if (data.image?.[0]) {
        formData.append('image', data.image[0]);
      }

      const response = await axios.post('/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/items/${response.data.item.id}`);
    } catch (error) {
      console.error('Failed to create item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom mx-auto py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Post an Item</h1>
            <p className="text-gray-600 mt-1">
              Fill out the form below to post a lost or found item
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Item Type */}
            <div>
              <label className="form-label">Item Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="lost"
                    {...register('item_type', { required: 'Please select an item type' })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <span className="block text-lg font-medium text-gray-900">Lost Item</span>
                    <span className="block text-sm text-gray-500">I lost something</span>
                  </div>
                  <div className={`absolute inset-0 border-2 rounded-lg pointer-events-none ${
                    watch('item_type') === 'lost' ? 'border-primary-500' : 'border-transparent'
                  }`} />
                </label>
                
                <label className="relative flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="found"
                    {...register('item_type', { required: 'Please select an item type' })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <span className="block text-lg font-medium text-gray-900">Found Item</span>
                    <span className="block text-sm text-gray-500">I found something</span>
                  </div>
                  <div className={`absolute inset-0 border-2 rounded-lg pointer-events-none ${
                    watch('item_type') === 'found' ? 'border-primary-500' : 'border-transparent'
                  }`} />
                </label>
              </div>
              {errors.item_type && (
                <p className="form-error">{errors.item_type.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                className="form-input"
                placeholder="Brief description of the item"
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters'
                  }
                })}
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                className="form-input"
                {...register('category_id', {
                  required: 'Please select a category'
                })}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="form-error">{errors.category_id.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                rows={4}
                className="form-input"
                placeholder="Detailed description of the item..."
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters'
                  }
                })}
              />
              {errors.description && (
                <p className="form-error">{errors.description.message}</p>
              )}
            </div>

            {/* Date Occurred */}
            <div>
              <label htmlFor="date_occurred" className="form-label">Date Occurred</label>
              <input
                type="datetime-local"
                id="date_occurred"
                className="form-input"
                {...register('date_occurred', {
                  required: 'Please specify when this occurred'
                })}
              />
              {errors.date_occurred && (
                <p className="form-error">{errors.date_occurred.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                id="location"
                className="form-input"
                placeholder="Where was it lost/found?"
                {...register('location', {
                  required: 'Location is required'
                })}
              />
              {errors.location && (
                <p className="form-error">{errors.location.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="form-label">Image (Optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-auto rounded"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        {...register('image')}
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post Item'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateItem;