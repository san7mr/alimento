import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut, Home, List, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { getItemsCount } = useCartStore();
  const location = useLocation();
  
  const itemsCount = getItemsCount();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
              <div className="h-8 w-8 bg-primary-500 rounded-md flex items-center justify-center">
                <div className="text-white font-bold">A</div>
              </div>
              <span className="ml-2 text-xl font-bold text-primary-600">Alimento</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/restaurants" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/restaurants') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Restaurants
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/orders" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/orders') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  My Orders
                </Link>
                <div className="relative ml-2">
                  <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100">
                    <ShoppingBag className="h-6 w-6 text-gray-700" />
                    {itemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {itemsCount}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="relative ml-2 group">
                  <button className="flex items-center p-2 rounded-full hover:bg-gray-100">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || 'User'}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/addresses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Addresses
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {isAuthenticated && (
              <div className="relative mr-2">
                <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100">
                  <ShoppingBag className="h-6 w-6 text-gray-700" />
                  {itemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemsCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Home className="mr-3 h-5 w-5" />
                Home
              </div>
            </Link>
            <Link
              to="/restaurants"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/restaurants') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <List className="mr-3 h-5 w-5" />
                Restaurants
              </div>
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/orders') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={closeMenu}
                >
                  <div className="flex items-center">
                    <ShoppingBag className="mr-3 h-5 w-5" />
                    My Orders
                  </div>
                </Link>
                <Link
                  to="/profile"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/profile') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={closeMenu}
                >
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </div>
                </Link>
                <Link
                  to="/addresses"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/addresses') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={closeMenu}
                >
                  <div className="flex items-center">
                    <MapPin className="mr-3 h-5 w-5" />
                    Addresses
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </div>
                </button>
              </>
            ) : (
              <div className="pt-4 flex flex-col space-y-3">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" fullWidth>
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" onClick={closeMenu}>
                  <Button fullWidth>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;