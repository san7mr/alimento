import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem, Restaurant, SelectedCustomization } from '../types';

interface CartState {
  items: CartItem[];
  restaurant: Restaurant | null;
  addItem: (menuItem: MenuItem, quantity: number, customizations?: SelectedCustomization[], specialInstructions?: string) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemsCount: () => number;
  canAddToCart: (restaurantId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurant: null,
      
      addItem: (menuItem, quantity, customizations = [], specialInstructions = '') => {
        const { items, restaurant } = get();
        
        // If cart is empty, set the restaurant
        if (items.length === 0 && !restaurant) {
          // We'd need to fetch the restaurant data here in a real app
          // For this MVP, we'll just set the restaurant ID
          set({ 
            restaurant: {
              id: menuItem.restaurant_id,
              name: '', // This would be filled with actual data
              description: '',
              cuisine_type: [],
              rating: 0,
              delivery_time: 0,
              delivery_fee: 0,
              min_order: 0,
              image_url: '',
              address: '',
              is_veg: false,
              is_open: true,
            }
          });
        }
        
        // Check if the same item with the same customizations already exists
        const existingItemIndex = items.findIndex(item => {
          if (item.menuItem.id !== menuItem.id) return false;
          
          // Check if customizations match
          if (!customizations.length && !item.customizations?.length) return true;
          if (customizations.length !== (item.customizations?.length || 0)) return false;
          
          // Deep comparison of customizations would go here
          // For simplicity, we'll treat all items with customizations as unique
          if (customizations.length > 0) return false;
          
          return true;
        });
        
        if (existingItemIndex > -1) {
          // Update existing item quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: Math.random().toString(36).substr(2, 9), // Generate a unique ID
            menuItem,
            quantity,
            customizations,
            specialInstructions,
          };
          set({ items: [...items, newItem] });
        }
      },
      
      removeItem: (id) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id !== id);
        
        // If cart becomes empty, clear restaurant too
        if (updatedItems.length === 0) {
          set({ items: [], restaurant: null });
        } else {
          set({ items: updatedItems });
        }
      },
      
      updateItemQuantity: (id, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        const updatedItems = items.map(item => 
          item.id === id ? { ...item, quantity } : item
        );
        
        set({ items: updatedItems });
      },
      
      clearCart: () => {
        set({ items: [], restaurant: null });
      },
      
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          let itemPrice = item.menuItem.price * item.quantity;
          
          // Add customization prices
          if (item.customizations && item.customizations.length > 0) {
            item.customizations.forEach(customization => {
              // In a real app, you'd look up the option prices
              // For this MVP, we'll assume customizations don't affect price
            });
          }
          
          return total + itemPrice;
        }, 0);
      },
      
      getItemsCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
      
      canAddToCart: (restaurantId) => {
        const { restaurant, items } = get();
        return items.length === 0 || (restaurant && restaurant.id === restaurantId);
      },
    }),
    {
      name: 'alimento-cart',
    }
  )
);