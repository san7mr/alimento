import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MapPin } from 'lucide-react';
import { Restaurant } from '../types';
import Input from '../components/ui/Input';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Button from '../components/ui/Button';
import { useLocationStore } from '../store/locationStore';

// Mock data for restaurants
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Punjab Grill',
    description: 'Authentic North Indian cuisine with a modern twist',
    cuisine_type: ['North Indian', 'Punjabi'],
    rating: 4.6,
    delivery_time: 30,
    delivery_fee: 40,
    min_order: 200,
    image_url: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '123 Food Street, Delhi',
    is_veg: false,
    is_open: true,
  },
  {
    id: '2',
    name: 'South Spice',
    description: 'Traditional South Indian dishes with authentic flavors',
    cuisine_type: ['South Indian', 'Kerala'],
    rating: 4.4,
    delivery_time: 35,
    delivery_fee: 30,
    min_order: 150,
    image_url: 'https://images.pexels.com/photos/941869/pexels-photo-941869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '456 Spice Road, Chennai',
    is_veg: true,
    is_open: true,
  },
  {
    id: '3',
    name: 'Mumbai Tiffins',
    description: 'Street food and homestyle dishes from Mumbai',
    cuisine_type: ['Street Food', 'Maharashtrian'],
    rating: 4.2,
    delivery_time: 25,
    delivery_fee: 0,
    min_order: 100,
    image_url: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '789 Vada Pav Lane, Mumbai',
    is_veg: false,
    is_open: true,
  },
  {
    id: '4',
    name: 'Bengali Bites',
    description: 'Authentic Bengali cuisine with a focus on seafood',
    cuisine_type: ['Bengali', 'Seafood'],
    rating: 4.5,
    delivery_time: 40,
    delivery_fee: 50,
    min_order: 250,
    image_url: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '101 Fish Market Road, Kolkata',
    is_veg: false,
    is_open: true,
  },
  {
    id: '5',
    name: 'Biryani House',
    description: 'Specializing in various regional biryanis from across India',
    cuisine_type: ['Biryani', 'Hyderabadi'],
    rating: 4.7,
    delivery_time: 45,
    delivery_fee: 30,
    min_order: 200,
    image_url: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '202 Rice Road, Hyderabad',
    is_veg: false,
    is_open: true,
  },
  {
    id: '6',
    name: 'Pure Veg Thali',
    description: 'Traditional vegetarian thalis from different regions of India',
    cuisine_type: ['Gujarati', 'Rajasthani', 'Vegetarian'],
    rating: 4.3,
    delivery_time: 30,
    delivery_fee: 0,
    min_order: 150,
    image_url: 'https://images.pexels.com/photos/2679501/pexels-photo-2679501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '303 Thali Street, Ahmedabad',
    is_veg: true,
    is_open: false,
  },
];

// Filter types
type SortOption = 'recommended' | 'rating' | 'deliveryTime' | 'minOrder';
type FilterOptions = {
  isVeg: boolean;
  isOpen: boolean;
  maxDeliveryTime: number;
  cuisines: string[];
};

const RestaurantsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    isVeg: false,
    isOpen: true,
    maxDeliveryTime: 60,
    cuisines: [],
  });
  const { cityId, zoneId } = useLocationStore();
  const [deliveryZone, setDeliveryZone] = useState<any>(null);

  // Get all unique cuisines from restaurants
  const allCuisines = Array.from(
    new Set(
      mockRestaurants.flatMap(restaurant => restaurant.cuisine_type)
    )
  );

  // Add this effect to fetch delivery zone details
  useEffect(() => {
    if (zoneId) {
      fetchDeliveryZone();
    }
  }, [zoneId]);

  const fetchDeliveryZone = async () => {
    const { data } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('id', zoneId)
      .single();
    
    if (data) {
      setDeliveryZone(data);
    }
  };

  // Update the fetchRestaurants function to filter by location
  const fetchRestaurants = async () => {
    if (!cityId) return;

    const { data } = await supabase
      .from('restaurant_service_areas')
      .select(`
        restaurant_id,
        additional_delivery_fee,
        estimated_delivery_time,
        restaurants (*)
      `)
      .eq('delivery_zone_id', zoneId);

    if (data) {
      const restaurantsWithDelivery = data.map(item => ({
        ...item.restaurants,
        delivery_fee: (deliveryZone?.base_delivery_fee || 0) + (item.additional_delivery_fee || 0),
        delivery_time: item.estimated_delivery_time
      }));
      setRestaurants(restaurantsWithDelivery);
    }
  };
  
  // Handle initial search params
  useEffect(() => {
    const cuisine = searchParams.get('cuisine');
    if (cuisine) {
      setFilterOptions(prev => ({
        ...prev,
        cuisines: [cuisine],
      }));
    }
  }, [searchParams]);
  
  // Apply filters and search
  useEffect(() => {
    let results = [...mockRestaurants];
    
    // Apply search
    if (searchTerm) {
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine_type.some(cuisine => 
          cuisine.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply filters
    if (filterOptions.isVeg) {
      results = results.filter(restaurant => restaurant.is_veg);
    }
    
    if (filterOptions.isOpen) {
      results = results.filter(restaurant => restaurant.is_open);
    }
    
    if (filterOptions.maxDeliveryTime < 60) {
      results = results.filter(restaurant => 
        restaurant.delivery_time <= filterOptions.maxDeliveryTime
      );
    }
    
    if (filterOptions.cuisines.length > 0) {
      results = results.filter(restaurant => 
        restaurant.cuisine_type.some(cuisine => 
          filterOptions.cuisines.includes(cuisine)
        )
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'deliveryTime':
        results.sort((a, b) => a.delivery_time - b.delivery_time);
        break;
      case 'minOrder':
        results.sort((a, b) => a.min_order - b.min_order);
        break;
      default:
        // 'recommended' - no specific sorting, using default order
        break;
    }
    
    setFilteredRestaurants(results);
  }, [searchTerm, filterOptions, sortBy]);
  
  const toggleCuisine = (cuisine: string) => {
    setFilterOptions(prev => {
      const cuisines = prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine];
      
      return { ...prev, cuisines };
    });
  };
  
  const clearFilters = () => {
    setFilterOptions({
      isVeg: false,
      isOpen: true,
      maxDeliveryTime: 60,
      cuisines: [],
    });
    setSearchTerm('');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Restaurants</h1>
        <p className="text-gray-600">
          Discover the best food from around India delivered to your doorstep
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search restaurants or cuisines"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
                fullWidth
              />
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-lg mb-3">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: 'recommended', label: 'Recommended' },
                  { value: 'rating', label: 'Rating (High to Low)' },
                  { value: 'deliveryTime', label: 'Delivery Time' },
                  { value: 'minOrder', label: 'Minimum Order' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={option.value}
                      name="sortBy"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={() => setSortBy(option.value as SortOption)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor={option.value}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <h3 className="font-semibold text-lg mb-3">Filters</h3>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="isVeg"
                    checked={filterOptions.isVeg}
                    onChange={() => setFilterOptions(prev => ({ ...prev, isVeg: !prev.isVeg }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isVeg"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Pure Vegetarian
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isOpen"
                    checked={filterOptions.isOpen}
                    onChange={() => setFilterOptions(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isOpen"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Open Now
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label
                  htmlFor="maxDeliveryTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Max Delivery Time: {filterOptions.maxDeliveryTime} mins
                </label>
                <input
                  type="range"
                  id="maxDeliveryTime"
                  min="15"
                  max="60"
                  step="5"
                  value={filterOptions.maxDeliveryTime}
                  onChange={(e) => setFilterOptions(prev => ({ 
                    ...prev, 
                    maxDeliveryTime: parseInt(e.target.value) 
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Cuisines</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allCuisines.map((cuisine) => (
                    <div key={cuisine} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cuisine-${cuisine}`}
                        checked={filterOptions.cuisines.includes(cuisine)}
                        onChange={() => toggleCuisine(cuisine)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`cuisine-${cuisine}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {cuisine}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  fullWidth
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Mobile Filters */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              leftIcon={<Filter className="h-5 w-5" />}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full"
            >
              Filters & Sort
            </Button>
            
            {isFilterOpen && (
              <div className="mt-2 bg-white rounded-lg shadow-md p-4">
                {/* Mobile filters content - simplified version of the sidebar */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-3">Sort By</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'recommended', label: 'Recommended' },
                      { value: 'rating', label: 'Rating' },
                      { value: 'deliveryTime', label: 'Delivery Time' },
                      { value: 'minOrder', label: 'Minimum Order' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          id={`mobile-${option.value}`}
                          name="mobileSortBy"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={() => setSortBy(option.value as SortOption)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <label
                          htmlFor={`mobile-${option.value}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-3">Quick Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterOptions.isVeg ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setFilterOptions(prev => ({ ...prev, isVeg: !prev.isVeg }))}
                    >
                      Vegetarian
                    </Button>
                    <Button
                      variant={filterOptions.isOpen ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setFilterOptions(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                    >
                      Open Now
                    </Button>
                    <Button
                      variant={filterOptions.maxDeliveryTime <= 30 ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setFilterOptions(prev => ({ 
                        ...prev, 
                        maxDeliveryTime: prev.maxDeliveryTime <= 30 ? 60 : 30
                      }))}
                    >
                      Under 30 mins
                    </Button>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  fullWidth
                  onClick={() => {
                    clearFilters();
                    setIsFilterOpen(false);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Location Selector */}
          <div className="mb-6 bg-white p-3 rounded-lg shadow-sm flex items-center">
            <MapPin className="h-5 w-5 text-primary-500 mr-2" />
            <div>
              <div className="text-sm text-gray-500">Delivery to</div>
              <div className="font-medium">
                {deliveryZone?.name || 'Select location'}
                <Link to="/" className="ml-2 text-primary-500 text-sm">Change</Link>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'Restaurant' : 'Restaurants'} Found
              </h2>
            </div>
            
            {filteredRestaurants.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Restaurants Found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any restaurants matching your search criteria. 
                  Try adjusting your filters or search term.
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsPage;