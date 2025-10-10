// src/components/Header.tsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  // NOTE: 'profile' is now directly available from useAuth()
  const { isAuthenticated, logout, profile, isAdmin } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    // Close dropdown by blurring the active element
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
  
  // Handler to ensure the dropdown button gets focus and opens the menu
  const handleAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target) {
      target.focus();
    }
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
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost btn-circle avatar"
              onClick={handleAvatarClick} // ADDED CLICK HANDLER 
            >
              <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
            </div>
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
                  onClick={() => handleNavigation('/marketplace')}
                  className={`w-full text-left ${location.pathname === '/marketplace' ? 'active' : ''}`}
                >
                  Marketplace
                </button>
              </li>
              {/* Check against the isAdmin prop */}
              {isAdmin && ( 
                <li>
                  <button 
                    onClick={() => handleNavigation('/admin')}
                    className={`w-full text-left ${location.pathname === '/admin' ? 'active' : ''}`}
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
