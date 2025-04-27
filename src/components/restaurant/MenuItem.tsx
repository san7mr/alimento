import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Button from '../ui/Button';
import { MenuItem, SelectedCustomization } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const [quantity, setQuantity] = useState(0);
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomization[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  const { addItem, canAddToCart } = useCartStore();
  
  const handleAddToCart = () => {
    if (item.customizations && item.customizations.length > 0 && !isCustomizing) {
      setIsCustomizing(true);
      setQuantity(1);
      return;
    }
    
    if (canAddToCart(item.restaurant_id)) {
      addItem(item, quantity, selectedCustomizations, specialInstructions);
      resetState();
    } else {
      // Show error or confirmation to clear cart
      alert('You can only order from one restaurant at a time. Clear your cart to add items from this restaurant.');
    }
  };
  
  const resetState = () => {
    setQuantity(0);
    setSelectedCustomizations([]);
    setSpecialInstructions('');
    setIsCustomizing(false);
  };
  
  const handleCustomizationChange = (
    customizationId: string,
    optionId: string,
    isMultiple: boolean,
    isChecked: boolean
  ) => {
    setSelectedCustomizations((prev) => {
      // Find if this customization already exists
      const existingCustomizationIndex = prev.findIndex(
        (c) => c.customizationId === customizationId
      );
      
      if (existingCustomizationIndex === -1) {
        // If it doesn't exist, add it with the selected option
        return [...prev, { customizationId, optionIds: [optionId] }];
      }
      
      const existing = prev[existingCustomizationIndex];
      
      if (isMultiple) {
        // For checkboxes (multiple selection)
        let updatedOptionIds = isChecked
          ? [...existing.optionIds, optionId]
          : existing.optionIds.filter((id) => id !== optionId);
        
        if (updatedOptionIds.length === 0) {
          // Remove the customization entirely if no options selected
          return prev.filter((_, index) => index !== existingCustomizationIndex);
        }
        
        return [
          ...prev.slice(0, existingCustomizationIndex),
          { ...existing, optionIds: updatedOptionIds },
          ...prev.slice(existingCustomizationIndex + 1),
        ];
      } else {
        // For radio buttons (single selection)
        return [
          ...prev.slice(0, existingCustomizationIndex),
          { ...existing, optionIds: [optionId] },
          ...prev.slice(existingCustomizationIndex + 1),
        ];
      }
    });
  };
  
  const isCustomizationSelected = (customizationId: string, optionId: string) => {
    const customization = selectedCustomizations.find(
      (c) => c.customizationId === customizationId
    );
    return customization ? customization.optionIds.includes(optionId) : false;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-card border border-gray-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-40 md:h-full object-cover"
          />
        </div>
        
        <div className="p-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                {item.is_veg && (
                  <div className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-sm font-medium">
                    Veg
                  </div>
                )}
                {item.is_bestseller && (
                  <div className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-sm font-medium">
                    Bestseller
                  </div>
                )}
                {item.is_spicy && (
                  <div className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-sm font-medium">
                    Spicy
                  </div>
                )}
              </div>
              <p className="text-gray-700 font-medium mt-1">₹{item.price.toFixed(2)}</p>
            </div>
            
            {!isCustomizing && (
              <div className="flex items-center">
                {quantity > 0 ? (
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                      onClick={() => setQuantity(Math.max(0, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setQuantity(1)}
                  >
                    Add
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mt-2">{item.description}</p>
          
          {isCustomizing && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium mb-2">Customize Your Order</h4>
              
              {item.customizations?.map((customization) => (
                <div key={customization.id} className="mb-4">
                  <div className="flex items-center mb-2">
                    <h5 className="font-medium text-sm">{customization.name}</h5>
                    {customization.required && (
                      <span className="text-red-500 text-xs ml-1">*</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {customization.options.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type={customization.multiple ? "checkbox" : "radio"}
                          id={`${customization.id}-${option.id}`}
                          name={customization.id}
                          checked={isCustomizationSelected(customization.id, option.id)}
                          onChange={(e) =>
                            handleCustomizationChange(
                              customization.id,
                              option.id,
                              customization.multiple,
                              e.target.checked
                            )
                          }
                          className={
                            customization.multiple
                              ? "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              : "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          }
                        />
                        <label
                          htmlFor={`${customization.id}-${option.id}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {option.name}
                          {option.price > 0 && ` (+₹${option.price.toFixed(2)})`}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mb-4">
                <label
                  htmlFor="special-instructions"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Special Instructions (Optional)
                </label>
                <textarea
                  id="special-instructions"
                  rows={2}
                  placeholder="E.g., less spicy, no onions, etc."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddToCart} fullWidth>
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={resetState}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {!isCustomizing && quantity > 0 && (
            <div className="mt-4 text-right">
              <Button size="sm" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;