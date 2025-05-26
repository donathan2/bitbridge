
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useAvatar } from '@/hooks/useAvatar';
import { 
  Search, 
  Code2, 
  Users, 
  Settings, 
  Vault,
  LogOut,
  User
} from 'lucide-react';

const NavBar = () => {
  const { user, signOut } = useAuth();
  const { avatarUrl, name } = useAvatar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/find-project', icon: Search, label: 'Find Projects' },
    { path: '/bitvault', icon: Vault, label: 'BitVault' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <Link 
          to="/" 
          className="flex items-center space-x-3 group"
        >
          <div className="relative">
            <Code2 className="w-10 h-10 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <span className="text-xl font-pixel text-cyan-400 group-hover:text-cyan-300 transition-colors">
            BitBridge
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link key={path} to={path}>
              <Button
                variant="ghost"
                className={`relative px-4 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-all duration-200 ${
                  isActive(path) 
                    ? 'text-cyan-400 bg-slate-800 border-b-2 border-cyan-400' 
                    : ''
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            </Link>
          ))}
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 hover:bg-slate-800 rounded-lg px-3 py-2 transition-colors"
              >
                <Avatar className="h-8 w-8 border-2 border-slate-700">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-slate-300 hover:text-cyan-400 transition-colors hidden sm:block">
                  {name}
                </span>
              </Link>
              
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
