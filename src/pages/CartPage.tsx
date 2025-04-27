import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Plus, Minus, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCartStore } from '../store/cartStore';

const CartPage: React.FC = () => {
  const { items, restaurant, removeItem, updateItemQuantity, clearCart, getCartTotal } = useCartStore();
  
  const deliveryFee = restaurant?.delivery_fee || 0;
  const subtotal = getCartTotal();
  const taxes = Math.round(subtotal * 0.05); // Assuming 5% tax
  const total = subtotal + deliveryFee + taxes;
  
  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
            <ShoppingCart className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/restaurants">
            <Button>Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Restaurant Info */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{restaurant?.name}</h2>
              <p className="text-gray-600 text-sm">{restaurant?.address}</p>
            </div>
            
            {/* Cart Items */}
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-start">
                  <div className="flex-shrink-0 w-20 h-20 mr-4">
                    <img
                      src={item.menuItem.image_url}
                      alt={item.menuItem.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {item.menuItem.name}
                          {item.menuItem.is_veg && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-green-100 text-green-800">
                              Veg
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ₹{item.menuItem.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mr-2">
                          <button
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Customizations */}
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">
                          {/* In a real app, you'd look up the customization details */}
                          {/* For this demo, just showing a placeholder */}
                          Customizations: <span className="text-gray-700">Added</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Special Instructions */}
                    {item.specialInstructions && (
                      <div className="mt-1">
                        <div className="text-xs text-gray-500">
                          Instructions: <span className="text-gray-700">{item.specialInstructions}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2 text-sm font-medium">
                      ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Extra items, special instructions for entire order */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-base font-medium mb-2">Any special instructions?</h3>
              <textarea
                placeholder="E.g., please deliver to the reception, don't ring the bell, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                rows={2}
              ></textarea>
              
              <div className="mt-4">
                <Link to={`/restaurants/${restaurant?.id}`}>
                  <Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    Add More Items
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <Link to="/checkout">
              <Button fullWidth size="lg" rightIcon={<ChevronRight className="h-5 w-5" />}>
                Proceed to Checkout
              </Button>
            </Link>
            
            <button
              onClick={clearCart}
              className="mt-4 w-full text-center text-red-500 text-sm font-medium hover:text-red-600"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;