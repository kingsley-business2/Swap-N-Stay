// src/components/Header.tsx (FINALIZED)

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { isAuthenticated, logout, profile, isAdmin } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    // Attempt to close the dropdown by blurring the focused element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    navigate(path);
  };

  const handleLogout = async () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    await logout();
  };

  return (
    <header className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div className="flex-1">
        <button 
          onClick={() => handleNavigation('/marketplace')}
          className="btn btn-ghost text-xl hover:bg-base-200 transition-colors"
        >
          Swap N Stay
        </button>
      </div>
      <div className="flex-none">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            
            {/* 🎯 Dropdown Toggle Element (Avatar) */}
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost btn-circle avatar"
              aria-label={`User Menu for ${profile?.name || 'User'}`} // Added accessibility label
            >
              <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
                {/* Display first initial of the user's name, or a generic icon */}
                <span className="text-lg font-bold text-base-content">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                </span>
              </div>
            </div>
            
            {/* 📋 Dropdown Content */}
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-52 p-2 shadow-lg border border-base-300"
            >
              <li>
                <button 
                  onClick={() => handleNavigation('/dashboard')}
                  className={`w-full text-left ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/explore')} // Added /explore link
                  className={`w-full text-left ${location.pathname === '/explore' ? 'active' : ''}`}
                >
                  Explore
                </button>
              </li>
              {/* Conditional link based on Admin status */}
              {isAdmin && ( 
                <li>
                  <button 
                    onClick={() => handleNavigation('/admin')}
                    className={`w-full text-left ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                  >
                    Admin Panel
                  </button>
                </li>
              )}
              <li><button onClick={handleLogout} className="w-full text-left">Logout</button></li>
            </ul>
          </div>
        ) : (
          <button 
            onClick={() => handleNavigation('/login')}
            className="btn btn-primary hover:btn-primary-focus transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
