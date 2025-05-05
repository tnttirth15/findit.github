import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, Loader, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  category_id: string;
  date_occurred: string;
  location: string;
  is_resolved: boolean;
  image?: FileList;
}

function EditItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  // Fetch item and categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        setError(null);
        
        const [itemResponse, categoriesResponse] = await Promise.all([
          axios.get(`/api/items/${id}`),
          axios.get('/api/items/categories')
        ]);

        const item = itemResponse.data.item;
        setCategories(categoriesResponse.data.categories);
        setImagePreview(item.image_url);

        // Format date for datetime-local input
        const dateOccurred = new Date(item.date_occurred);
        const formattedDate = dateOccurred.toISOString().slice(0, 16);

        reset({
          title: item.title,
          description: item.description,
          category_id: item.category.id.toString(),
          date_occurred: formattedDate,
          location: item.location,
          is_resolved: item.is_resolved
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load item data');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  // Handle image preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category_id', data.category_id);
      formData.append('date_occurred', data.date_occurred);
      formData.append('location', data.location);
      formData.append('is_resolved', String(data.is_resolved));
      
      if (data.image?.[0]) {
        formData.append('image', data.image[0]);
      }

      await axios.put(`/api/items/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/items/${id}`);
    } catch (err) {
      console.error('Failed to update item:', err);
      setError('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container-custom mx-auto py-12">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom mx-auto py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom mx-auto py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Edit Item</h1>
            <p className="text-gray-600 mt-1">
              Update the details of your posted item
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
              <label className="form-label">Image</label>
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
                      <span>Upload a new image</span>
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

            {/* Resolution Status */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary-600"
                  {...register('is_resolved')}
                />
                <span className="ml-2 text-gray-700">Mark as resolved</span>
              </label>
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
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditItem;