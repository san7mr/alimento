import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MapPin, Star, Phone, Search, ChevronDown } from 'lucide-react';
import { Restaurant, MenuItem } from '../types';
import MenuItemCard from '../components/restaurant/MenuItem';
import Input from '../components/ui/Input';

// Mock data for a restaurant
const mockRestaurant: Restaurant = {
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
};

// Mock data for menu items
const mockMenuItems: MenuItem[] = [
  {
    id: '101',
    restaurant_id: '1',
    name: 'Butter Chicken',
    description: 'Tender chicken cooked in a rich and creamy tomato-based sauce with butter and spices',
    price: 350,
    image_url: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    is_veg: false,
    is_bestseller: true,
    is_spicy: false,
    customizations: [
      {
        id: 'c1',
        name: 'Spice Level',
        options: [
          { id: 'o1', name: 'Mild', price: 0 },
          { id: 'o2', name: 'Medium', price: 0 },
          { id: 'o3', name: 'Spicy', price: 0 },
        ],
        required: true,
        multiple: false,
      },
      {
        id: 'c2',
        name: 'Add-ons',
        options: [
          { id: 'o4', name: 'Extra Butter', price: 30 },
          { id: 'o5', name: 'Extra Gravy', price: 40 },
        ],
        required: false,
        multiple: true,
      },
    ],
  },
  {
    id: '102',
    restaurant_id: '1',
    name: 'Dal Makhani',
    description: 'Black lentils slow-cooked with butter, cream, and mild spices',
    price: 250,
    image_url: 'https://images.pexels.com/photos/6260921/pexels-photo-6260921.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    is_veg: true,
    is_bestseller: true,
    is_spicy: false,
  },
  {
    id: '103',
    restaurant_id: '1',
    name: 'Tandoori Roti',
    description: 'Whole wheat flatbread baked in a tandoor',
    price: 40,
    image_url: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Bread',
    is_veg: true,
    is_bestseller: false,
    is_spicy: false,
  },
  {
    id: '104',
    restaurant_id: '1',
    name: 'Paneer Tikka',
    description: 'Chunks of paneer marinated in spices and grilled in a tandoor',
    price: 280,
    image_url: 'https://images.pexels.com/photos/5410401/pexels-photo-5410401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Starters',
    is_veg: true,
    is_bestseller: false,
    is_spicy: true,
  },
  {
    id: '105',
    restaurant_id: '1',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with chicken, herbs, and spices',
    price: 320,
    image_url: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Rice',
    is_veg: false,
    is_bestseller: true,
    is_spicy: true,
  },
  {
    id: '106',
    restaurant_id: '1',
    name: 'Gulab Jamun',
    description: 'Deep-fried milk solids soaked in sugar syrup',
    price: 150,
    image_url: 'https://images.pexels.com/photos/7449105/pexels-photo-7449105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Desserts',
    is_veg: true,
    is_bestseller: false,
    is_spicy: false,
  },
];

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [isVegOnly, setIsVegOnly] = useState(false);
  
  // Fetch restaurant data
  useEffect(() => {
    // In a real app, this would be an API call
    // For this demo, using mock data
    setRestaurant(mockRestaurant);
    setMenuItems(mockMenuItems);
  }, [id]);
  
  // Group menu items by category
  const menuByCategory = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  
  // Set the first category as active by default
  useEffect(() => {
    if (Object.keys(menuByCategory).length > 0 && !activeCategory) {
      setActiveCategory(Object.keys(menuByCategory)[0]);
    }
  }, [menuByCategory, activeCategory]);
  
  // Filter menu items
  useEffect(() => {
    let filtered = [...menuItems];
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (isVegOnly) {
      filtered = filtered.filter(item => item.is_veg);
    }
    
    setFilteredItems(filtered);
  }, [menuItems, searchTerm, isVegOnly]);
  
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Restaurant Header */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurant.image_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-sm opacity-90 mb-1">{restaurant.cuisine_type.join(', ')}</p>
          <p className="text-sm opacity-90 mb-2">{restaurant.address}</p>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>{restaurant.delivery_time} mins</span>
            </div>
            <div className="flex items-center">
              <span>
                {restaurant.delivery_fee === 0 
                  ? 'Free Delivery' 
                  : `₹${restaurant.delivery_fee} delivery fee`}
              </span>
            </div>
            <div className="flex items-center">
              <span>₹{restaurant.min_order} min order</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Categories Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search menu items"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="h-5 w-5" />}
                  fullWidth
                />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="vegOnly"
                    checked={isVegOnly}
                    onChange={() => setIsVegOnly(!isVegOnly)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="vegOnly" className="ml-2 block text-sm text-gray-700">
                    Vegetarian Only
                  </label>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-lg mb-3">Menu</h3>
                <nav className="space-y-1">
                  {Object.keys(menuByCategory).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        activeCategory === category
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                      <span className="float-right text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {menuByCategory[category].length}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="lg:w-3/4">
            {searchTerm || isVegOnly ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  {filteredItems.length === 0 
                    ? 'No items found' 
                    : `Search Results (${filteredItems.length})`}
                </h2>
                
                <div className="space-y-6">
                  {filteredItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ) : (
              Object.keys(menuByCategory).map((category) => (
                <div 
                  key={category} 
                  id={category} 
                  className="mb-8 scroll-mt-20"
                >
                  <h2 className="text-2xl font-bold mb-4">{category}</h2>
                  
                  <div className="space-y-6">
                    {menuByCategory[category].map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;