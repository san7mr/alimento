import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

type PaymentMethod = 'card' | 'upi' | 'cod';
type DeliveryAddress = {
  id: string;
  name: string;
  address: string;
  isDefault: boolean;
};

const mockAddresses: DeliveryAddress[] = [
  {
    id: '1',
    name: 'Home',
    address: '123 Main Street, Apartment 4B, New Delhi, 110001',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Work',
    address: '456 Office Park, Building 7, Floor 3, New Delhi, 110002',
    isDefault: false,
  },
];

const CheckoutPage: React.FC = () => {
  const { items, restaurant, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [selectedAddress, setSelectedAddress] = useState<string>(mockAddresses[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'cart' | 'address' | 'payment' | null>(null);
  
  const deliveryFee = restaurant?.delivery_fee || 0;
  const subtotal = getCartTotal();
  const taxes = Math.round(subtotal * 0.05); // Assuming 5% tax
  const total = subtotal + deliveryFee + taxes;
  
  const toggleSection = (section: 'cart' | 'address' | 'payment') => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
      setIsProcessing(false);
    }, 2000);
  };
  
  // If cart is empty, redirect to cart page
  if (items.length === 0) {
    return navigate('/cart');
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Checkout Form */}
        <div className="lg:w-2/3 space-y-6">
          {/* Order Details / Cart Summary */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('cart')}  
            >
              <h2 className="text-xl font-semibold">Order Summary</h2>
              {expandedSection === 'cart' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
            
            {expandedSection === 'cart' && (
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-4">
                  From <span className="font-medium text-gray-900">{restaurant?.name}</span>
                </div>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start">
                      <div className="flex-shrink-0 w-16 h-16 mr-4">
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
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.quantity} × ₹{item.menuItem.price.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="text-sm font-medium">
                            ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link to="/cart" className="text-primary-600 font-medium text-sm">
                    Edit Order
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('address')}  
            >
              <h2 className="text-xl font-semibold">Delivery Address</h2>
              {expandedSection === 'address' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
            
            {expandedSection === 'address' || expandedSection === null ? (
              <div className="p-4">
                {!isAddingAddress ? (
                  <div>
                    <div className="space-y-4 mb-6">
                      {mockAddresses.map((address) => (
                        <div
                          key={address.id}
                          className={`flex items-start p-3 rounded-md border ${
                            selectedAddress === address.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            <div
                              className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                selectedAddress === address.id
                                  ? 'border-primary-500 bg-primary-500'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedAddress === address.id && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                          
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{address.name}</p>
                                {address.isDefault && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Default
                                  </span>
                                )}
                              </div>
                              <button className="text-sm text-primary-600 font-medium">
                                Edit
                              </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{address.address}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      leftIcon={<MapPin className="h-5 w-5" />}
                      onClick={() => setIsAddingAddress(true)}
                    >
                      Add New Address
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium mb-4">New Delivery Address</h3>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Input
                          label="Address Name"
                          placeholder="E.g., Home, Work, etc."
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          fullWidth
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <Input
                          label="Address Line 1"
                          placeholder="House/Flat number, Building name, Street"
                          value={newAddress.line1}
                          onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                          fullWidth
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <Input
                          label="Address Line 2 (Optional)"
                          placeholder="Landmark, Area"
                          value={newAddress.line2}
                          onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                          fullWidth
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="City"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          fullWidth
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="State"
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          fullWidth
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <Input
                          label="Postal Code"
                          placeholder="Postal Code"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          fullWidth
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingAddress(false)}
                      >
                        Cancel
                      </Button>
                      <Button>
                        Save Address
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('payment')}  
            >
              <h2 className="text-xl font-semibold">Payment Method</h2>
              {expandedSection === 'payment' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
            
            {expandedSection === 'payment' || expandedSection === null ? (
              <div className="p-4">
                <div className="space-y-4">
                  <div
                    className={`flex items-start p-3 rounded-md border ${
                      paymentMethod === 'card'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'card'
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {paymentMethod === 'card' && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">Credit/Debit Card</p>
                      <p className="mt-1 text-sm text-gray-500">Pay securely with your card</p>
                      
                      {paymentMethod === 'card' && (
                        <div className="mt-4 grid grid-cols-1 gap-4">
                          <div>
                            <Input
                              label="Card Number"
                              placeholder="1234 5678 9012 3456"
                              fullWidth
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Input
                                label="Expiry Date"
                                placeholder="MM/YY"
                                fullWidth
                              />
                            </div>
                            
                            <div>
                              <Input
                                label="CVV"
                                placeholder="123"
                                fullWidth
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Input
                              label="Name on Card"
                              placeholder="John Doe"
                              fullWidth
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div
                    className={`flex items-start p-3 rounded-md border ${
                      paymentMethod === 'upi'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'upi'
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {paymentMethod === 'upi' && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">UPI</p>
                      <p className="mt-1 text-sm text-gray-500">Pay using Google Pay, PhonePe, etc.</p>
                      
                      {paymentMethod === 'upi' && (
                        <div className="mt-4">
                          <Input
                            label="UPI ID"
                            placeholder="name@upi"
                            fullWidth
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div
                    className={`flex items-start p-3 rounded-md border ${
                      paymentMethod === 'cod'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'cod'
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {paymentMethod === 'cod' && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                      <p className="mt-1 text-sm text-gray-500">Pay with cash upon delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        
        {/* Right Column - Order Summary */}
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
            
            <Button 
              fullWidth 
              size="lg" 
              onClick={handlePlaceOrder}
              isLoading={isProcessing}
              disabled={isProcessing}
            >
              Place Order
            </Button>
            
            <p className="mt-4 text-xs text-gray-500 text-center">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;