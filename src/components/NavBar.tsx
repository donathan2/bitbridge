
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, Users, Bitcoin, DollarSign, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const NavBar = () => {
  const location = useLocation();
  
  // Mock user data - in real app this would come from context/store
  const user = {
    experience: {
      current: 7500,
      nextLevel: 10000,
      level: 8
    },
    currency: {
      bits: 3250,
      bytes: 47
    }
  };

  const experiencePercentage = (user.experience.current / user.experience.nextLevel) * 100;
  
  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg mr-2">
                B
              </div>
              <span className="text-cyan-400 text-xl font-bold">BitBridge</span>
            </Link>
          </div>

          {/* XP and Currency Display */}
          <div className="hidden lg:flex items-center space-x-4 bg-slate-700 px-4 py-2 rounded-lg">
            {/* Level Badge */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              {user.experience.level}
            </div>
            
            {/* XP Bar */}
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-cyan-400" />
              <div className="w-24">
                <Progress value={experiencePercentage} className="h-2 bg-slate-600" />
              </div>
              <span className="text-xs text-slate-300">{user.experience.current}/{user.experience.nextLevel}</span>
            </div>
            
            {/* Currency */}
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1">
                <Bitcoin className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium">{user.currency.bits.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-medium">{user.currency.bytes}</span>
              </div>
            </div>
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
              to="/friends" 
              className={`px-4 py-2 rounded-md flex items-center ${
                location.pathname === '/friends' 
                  ? 'bg-slate-700 text-cyan-400' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-400'
              }`}
            >
              <Users className="h-5 w-5 mr-1" />
              <span>Friends</span>
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
            <Link 
              to="/settings" 
              className={`px-4 py-2 rounded-md flex items-center ${
                location.pathname === '/settings' 
                  ? 'bg-slate-700 text-cyan-400' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-400'
              }`}
            >
              <Settings className="h-5 w-5 mr-1" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
