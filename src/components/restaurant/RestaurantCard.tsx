import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={restaurant.image_url} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 right-0 bg-white m-2 px-2 py-1 rounded text-sm font-medium flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span>{restaurant.rating.toFixed(1)}</span>
        </div>
        
        {restaurant.is_veg && (
          <div className="absolute top-0 left-0 bg-green-500 m-2 px-2 py-1 rounded text-xs font-medium text-white">
            Pure Veg
          </div>
        )}
        
        {!restaurant.is_open && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Closed</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine_type.join(', ')}</p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {restaurant.delivery_time} mins
          </span>
          <span className="text-gray-500">
            ₹{restaurant.min_order} min order
          </span>
        </div>
        
        <div className="mt-2 text-sm">
          <span className="text-gray-500">
            {restaurant.delivery_fee === 0 
              ? 'Free Delivery' 
              : `Delivery fee: ₹${restaurant.delivery_fee}`}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;