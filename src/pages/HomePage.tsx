import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LocationSelector from '../components/location/LocationSelector';
import { useLocationStore } from '../store/locationStore';

const HomePage: React.FC = () => {
  const { setLocation } = useLocationStore();
  
  const handleLocationSelect = ({ cityId, zoneId }: { cityId: string, zoneId: string }) => {
    setLocation(cityId, zoneId);
  };

  const popularCuisines = [
    { id: 1, name: 'North Indian', image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 2, name: 'South Indian', image: 'https://images.pexels.com/photos/941869/pexels-photo-941869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 3, name: 'Punjabi', image: 'https://images.pexels.com/photos/2679501/pexels-photo-2679501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 4, name: 'Bengali', image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 5, name: 'Biryani', image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 6, name: 'Street Food', image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  ];
  
  const howItWorks = [
    {
      id: 1,
      title: 'Choose your location',
      description: 'Enter your address to find restaurants that deliver to you',
      icon: <MapPin className="h-8 w-8 text-primary-500" />,
    },
    {
      id: 2,
      title: 'Browse restaurants',
      description: 'Explore restaurants and their menus to find your favorites',
      icon: <Search className="h-8 w-8 text-primary-500" />,
    },
    {
      id: 3,
      title: 'Place your order',
      description: 'Add items to your cart, customize as needed, and check out',
      icon: <Star className="h-8 w-8 text-primary-500" />,
    },
    {
      id: 4,
      title: 'Wait for delivery',
      description: 'Track your order in real-time as it makes its way to you',
      icon: <Clock className="h-8 w-8 text-primary-500" />,
    },
  ];
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Authentic Indian Cuisine Delivered To Your Doorstep
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              From spicy curries to fragrant biryanis, discover the rich flavors of India with just a few clicks.
            </p>
            
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg">
              <LocationSelector onLocationSelect={handleLocationSelect} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Cuisines */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Indian Cuisines</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the diverse culinary traditions from across India, each with its unique flavors and specialties.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCuisines.map((cuisine) => (
              <Link 
                key={cuisine.id}
                to={`/restaurants?cuisine=${cuisine.name}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg aspect-square shadow-md transition transform group-hover:scale-105">
                  <img 
                    src={cuisine.image} 
                    alt={cuisine.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-center">{cuisine.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Alimento Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Getting your favorite Indian food delivered is quick and easy with our simple four-step process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step) => (
              <div 
                key={step.id}
                className="bg-white p-6 rounded-lg shadow-card hover:shadow-card-hover transition-shadow text-center"
              >
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Download App */}
      <section className="py-12 md:py-16 bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Download the Alimento App</h2>
              <p className="text-lg mb-6 text-white/90">
                Get exclusive deals, track your orders in real-time, and enjoy a seamless food ordering experience with our mobile app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" size="lg">
                  Download for iOS
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Download for Android
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.pexels.com/photos/6205509/pexels-photo-6205509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Mobile app" 
                className="w-64 rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Restaurants */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Restaurants</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our top-rated restaurants serving authentic Indian cuisine across the country.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Restaurant Cards */}
            {[1, 2, 3].map((id) => (
              <Link
                key={id}
                to={`/restaurants/${id}`}
                className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={`https://images.pexels.com/photos/${1000000 + id}/pexels-photo-${1000000 + id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                    alt="Restaurant" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-0 right-0 bg-white m-2 px-2 py-1 rounded text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>4.{id + 5}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {['Punjab Grill', 'Spice Route', 'Mumbai Masala'][id - 1]}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {['North Indian, Punjabi', 'South Indian, Kerala', 'Mumbai Street Food'][id - 1]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {20 + id * 5} mins
                    </span>
                    <span className="text-sm text-gray-500">
                      ₹{id}00 for two
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/restaurants">
              <Button size="lg">View All Restaurants</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;