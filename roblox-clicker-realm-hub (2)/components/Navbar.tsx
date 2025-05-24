
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BASE_NAV_ITEMS, AdminIcon, LoginIcon, RegisterIcon, LogoutIcon } from '../constants';
import { NavItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navItemsToDisplay = [...BASE_NAV_ITEMS];
  if (currentUser?.roles.includes('admin')) {
    navItemsToDisplay.push({ name: 'Admin Panel', path: '/admin', icon: <AdminIcon className="w-5 h-5 mr-2" /> });
  }

  const renderNavLinks = (isMobile: boolean = false) => (
    <>
      {navItemsToDisplay.map((item: NavItem) => (
        <NavLink
          key={item.name}
          to={item.path}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
              isMobile ? 'text-base' : 'text-sm'
            } ${
              isActive
                ? 'bg-primary text-white'
                : 'text-textSecondary hover:bg-gray-700 hover:text-textPrimary'
            } ${isMobile ? 'block' : ''}`
          }
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}
    </>
  );

  const renderAuthControls = (isMobile: boolean = false) => {
    if (isLoading) return null; // Optionally show a small spinner

    if (currentUser) {
      return (
        <div className={`flex ${isMobile ? 'flex-col space-y-2 px-2 pt-2 pb-3' : 'items-center space-x-2'}`}>
          <span className={`text-textSecondary ${isMobile ? 'px-3 py-2' : ''} text-sm`}>
            Hi, {currentUser.username}!
          </span>
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            className={isMobile ? 'w-full' : ''}
          >
            <LogoutIcon className="w-5 h-5 mr-1" />
            Logout
          </Button>
        </div>
      );
    } else {
      return (
        <div className={`flex ${isMobile ? 'flex-col space-y-2 px-2 pt-2 pb-3' : 'items-center space-x-2'}`}>
          <NavLink to="/login" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
            <Button variant="ghost" size="sm" className={isMobile ? 'w-full' : ''}>
              <LoginIcon className="w-5 h-5 mr-1" />
              Login
            </Button>
          </NavLink>
          <NavLink to="/register" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
            <Button variant="primary" size="sm" className={isMobile ? 'w-full' : ''}>
              <RegisterIcon className="w-5 h-5 mr-1" />
              Register
            </Button>
          </NavLink>
        </div>
      );
    }
  };

  return (
    <nav className="bg-surface shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-light transition-colors">
            Clicker Realm Hub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {renderNavLinks()}
          </div>
          <div className="hidden md:flex">
            {renderAuthControls()}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-textSecondary hover:text-textPrimary focus:outline-none"
              aria-label="Open main menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderNavLinks(true)}
          </div>
          <div className="border-t border-gray-700">
             {renderAuthControls(true)}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
