// ========================== src/components/Header.tsx ==========================
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { isAuthenticated, logout, profile } = useAuth();
  const navigate = useNavigate(); // Initialize the hook

  const handleNavigation = (path: string) => {
    navigate(path); // Programmatically navigate
  };

  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <button onClick={() => handleNavigation('/marketplace')} className="btn btn-ghost text-xl">
          Swap N Stay
        </button>
      </div>
      <div className="flex-none">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="User Avatar" src="https://ui-avatars.com/api/?name=User" />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              {/* Replace Links with buttons that use the navigation handler */}
              <li><button onClick={() => handleNavigation('/dashboard')}>Dashboard</button></li>
              <li><button onClick={() => handleNavigation('/marketplace')}>Marketplace</button></li>
              {profile?.is_admin && <li><button onClick={() => handleNavigation('/admin')}>Admin Panel</button></li>}
              <li><button onClick={logout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <button onClick={() => handleNavigation('/login')} className="btn btn-primary">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
