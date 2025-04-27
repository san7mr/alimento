import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { supabase } from '../lib/supabase';

interface City {
  id: string;
  name: string;
  state_id: string;
}

interface Address {
  id: string;
  name: string;
  street_address: string;
  landmark: string | null;
  city_id: string;
  pincode: string;
  is_default: boolean;
  phone: string;
  city: City;
}

const AddressesPage = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    street_address: '',
    landmark: '',
    city_id: '',
    pincode: '',
    phone: '',
  });

  useEffect(() => {
    fetchAddresses();
    fetchCities();
  }, []);

  const fetchCities = async () => {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Failed to load cities');
    } else {
      setCities(data);
    }
  };

  const fetchAddresses = async () => {
    const { data, error } = await supabase
      .from('addresses')
      .select(`
        *,
        city:cities(*)
      `)
      .order('is_default', { ascending: false });
    
    if (error) {
      toast.error('Failed to load addresses');
    } else {
      setAddresses(data);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data, error } = await supabase
      .from('addresses')
      .insert([formData])
      .select(`
        *,
        city:cities(*)
      `)
      .single();

    if (error) {
      toast.error('Failed to add address');
    } else {
      setAddresses([...addresses, data]);
      setShowForm(false);
      setFormData({
        name: '',
        street_address: '',
        landmark: '',
        city_id: '',
        pincode: '',
        phone: '',
      });
      toast.success('Address added successfully');
    }
    setIsSubmitting(false);
  };

  const handleSetDefault = async (addressId: string) => {
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: false })
      .neq('id', addressId);

    if (!error) {
      const { error: error2 } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (!error2) {
        fetchAddresses();
        toast.success('Default address updated');
      }
    }
  };

  const handleDelete = async (addressId: string) => {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (error) {
      toast.error('Failed to delete address');
    } else {
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      toast.success('Address deleted successfully');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Addresses</h1>
        
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-6"
            leftIcon={<Plus className="h-5 w-5" />}
          >
            Add New Address
          </Button>
        )}
        
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Address</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label="Address Label"
                placeholder="e.g., Home, Work, etc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              
              <Input
                type="text"
                label="Street Address"
                placeholder="Enter your street address"
                value={formData.street_address}
                onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                required
              />
              
              <Input
                type="text"
                label="Landmark (Optional)"
                placeholder="Enter a nearby landmark"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={formData.city_id}
                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                    required
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Input
                  type="text"
                  label="PIN Code"
                  placeholder="Enter PIN code"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit PIN code"
                />
              </div>
              
              <Input
                type="tel"
                label="Phone Number"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
              
              <div className="flex gap-4">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Save Address
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Addresses</h2>
          
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No addresses saved yet.</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="border rounded-lg p-4 relative hover:border-primary-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{address.name}</h3>
                        {address.is_default && (
                          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{address.street_address}</p>
                      {address.landmark && (
                        <p className="text-gray-600">Landmark: {address.landmark}</p>
                      )}
                      <p className="text-gray-600">
                        {address.city.name} - {address.pincode}
                      </p>
                      <p className="text-gray-600">Phone: {address.phone}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {!address.is_default && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-primary-600 hover:text-primary-700"
                          title="Set as default"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete address"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
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

export default AddressesPage;