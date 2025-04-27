export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine_type: string[];
  rating: number;
  delivery_time: number;
  delivery_fee: number;
  min_order: number;
  image_url: string;
  address: string;
  is_veg: boolean;
  is_open: boolean;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_veg: boolean;
  is_bestseller: boolean;
  is_spicy?: boolean;
  customizations?: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
  required: boolean;
  multiple: boolean;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  customizations?: SelectedCustomization[];
}

export interface SelectedCustomization {
  customizationId: string;
  optionIds: string[];
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name: string;
  items: OrderItem[];
  total_amount: number;
  delivery_fee: number;
  delivery_address: Address;
  payment_method: string;
  status: OrderStatus;
  created_at: string;
  estimated_delivery_time: string;
}

export interface OrderItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: SelectedCustomization[];
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';