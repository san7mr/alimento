import React, { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Input from '../ui/Input';

interface City {
  id: string;
  name: string;
  state_id: string;
}

interface DeliveryZone {
  id: string;
  name: string;
  base_delivery_fee: number;
  min_order_amount: number;
}

interface LocationSelectorProps {
  onLocationSelect: (location: { cityId: string, zoneId: string }) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchDeliveryZones(selectedCity);
    }
  }, [selectedCity]);

  const fetchCities = async () => {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setCities(data);
    }
    setIsLoading(false);
  };

  const fetchDeliveryZones = async (cityId: string) => {
    const { data, error } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('city_id', cityId)
      .order('name');
    
    if (!error && data) {
      setZones(data);
    }
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
    setSelectedZone('');
  };

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    onLocationSelect({ cityId: selectedCity, zoneId });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search for your city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="h-5 w-5" />}
          fullWidth
        />
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">Select City</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCity === city.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {city.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedCity && zones.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Select Area</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneSelect(zone.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedZone === zone.id
                        ? 'bg-primary-50 text-primary-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{zone.name}</span>
                      <span className="text-sm text-gray-500">
                        ₹{zone.base_delivery_fee} delivery fee
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;