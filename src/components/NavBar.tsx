
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User } from 'lucide-react';

const NavBar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg mr-2">
                B
              </div>
              <span className="text-cyan-400 text-xl font-bold">BitBridge</span>
            </Link>
          </div>
          
          {/* Navigation tabs */}
          <div className="flex items-center space-x-2">
            <Link 
              to="/find-project" 
              className={`px-4 py-2 rounded-md flex items-center ${
                location.pathname === '/find-project' 
                  ? 'bg-slate-700 text-cyan-400' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-400'
              }`}
            >
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            <Link 
              to="/profile" 
              className={`px-4 py-2 rounded-md flex items-center ${
                location.pathname === '/profile' 
                  ? 'bg-slate-700 text-cyan-400' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-400'
              }`}
            >
              <User className="h-5 w-5 mr-1" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
