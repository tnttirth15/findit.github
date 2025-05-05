import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Search, ChevronRight } from 'lucide-react';
import ItemList from '../components/ItemList';

function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [initialFilters, setInitialFilters] = useState({
    search: searchQuery,
    itemType: '',
    categoryId: '',
  });

  // Update filters when search params change
  useEffect(() => {
    setInitialFilters(prev => ({
      ...prev,
      search: searchQuery,
    }));
  }, [searchQuery]);

  return (
    <div>
      {/* Hero Section */}
      {!searchQuery && (
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
          <div className="container-custom mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  Find What's Lost, <br className="hidden sm:block" />
                  Return What's Found
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md">
                  Connect with your lost belongings or help others find theirs.
                  Our platform makes lost and found simple and effective.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/register" className="btn bg-white text-primary-600 hover:bg-white/90">
                    Get Started
                  </Link>
                  <Link to="/items/create" className="btn bg-white/20 text-white hover:bg-white/30">
                    Post an Item
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center lg:justify-end">
                <div className="relative w-72 h-72 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse-slow" />
                  <div className="absolute inset-4 bg-white/20 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-28 h-28 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom mx-auto">
          {searchQuery ? (
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-3">Search Results</h1>
              <p className="text-gray-600">
                Showing results for "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Recently Posted Items</h2>
              <Link to="/" className="text-primary-600 hover:text-primary-700 flex items-center">
                <span>View all</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          )}

          <ItemList 
            initialFilters={initialFilters}
            showFilters={true}
            maxItems={searchQuery ? undefined : 6}
          />
          
          {/* How it Works Section */}
          {!searchQuery && (
            <section className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">How FindIt Works</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our platform connects people who've lost items with those who've found them.
                  Here's how to get started.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Search</h3>
                  <p className="text-gray-600">
                    Browse through lost and found items or search for something specific.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Post</h3>
                  <p className="text-gray-600">
                    Report a lost item or something you've found to help others.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600">
                      <path d="M22 16.92v3a1.998 1.998 0 0 1-2.18 2 19.791 19.791 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Connect</h3>
                  <p className="text-gray-600">
                    Get in touch with the owner or finder to arrange a return.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;