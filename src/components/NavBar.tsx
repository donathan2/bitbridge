
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, Users, Bitcoin, DollarSign, Vault, Compass } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getProgressToNextLevel } from '@/utils/xpUtils';
import { supabase } from '@/integrations/supabase/client';

const NavBar = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  
  // Set up real-time subscription for profile updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Trigger a re-fetch of profile data
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  // Use profile data or fallback to defaults
  const displayProfile = profile || {
    experience_level: 1,
    experience_points: 0,
    bits_currency: 100,
    bytes_currency: 5
  };
  
  // Calculate experience progress using the new scaling system
  const xpProgress = getProgressToNextLevel(displayProfile.experience_points);
  
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

          {/* XP and Currency Display - show for authenticated users with fallback values */}
          {user && (
            <div className="hidden lg:flex items-center space-x-4 bg-slate-700 px-4 py-2 rounded-lg">
              {/* Level Badge */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                {xpProgress.currentLevel}
              </div>
              
              {/* XP Bar */}
              <div className="flex items-center space-x-2">
                <div className="w-24">
                  <Progress value={xpProgress.progressPercentage} className="h-2 bg-slate-600" />
                </div>
                <span className="text-xs text-slate-300">
                  {displayProfile.experience_points}/{xpProgress.nextLevelXP}
                  {profileLoading && !profile && <span className="opacity-50"> (loading...)</span>}
                </span>
              </div>
              
              {/* Currency */}
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-1">
                  <Bitcoin className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">{displayProfile.bits_currency?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">{displayProfile.bytes_currency || 0}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation tabs */}
          <div className="flex items-center space-x-1">
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`px-3 py-2 rounded-md flex items-center text-sm ${
                    location.pathname === '/profile' 
                      ? 'bg-slate-700 text-cyan-400' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-400'
                  }`}
                >
                  <Home className="h-4 w-4 mr-1" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/find-project" 
                  className={`px-3 py-2 rounded-md flex items-center text-sm ${
                    location.pathname === '/find-project' 
                      ? 'bg-slate-700 text-cyan-400' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-400'
                  }`}
                >
                  <Compass className="h-4 w-4 mr-1" />
                  <span>Explore</span>
                </Link>
                <Link 
                  to="/bitvault" 
                  className={`px-3 py-2 rounded-md flex items-center text-sm ${
                    location.pathname === '/bitvault' 
                      ? 'bg-slate-700 text-cyan-400' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-400'
                  }`}
                >
                  <Vault className="h-4 w-4 mr-1" />
                  <span>BitVault</span>
                </Link>
                <Link 
                  to="/friends" 
                  className={`px-3 py-2 rounded-md flex items-center text-sm ${
                    location.pathname === '/friends' 
                      ? 'bg-slate-700 text-cyan-400' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-400'
                  }`}
                >
                  <Users className="h-4 w-4 mr-1" />
                  <span>Friends</span>
                </Link>
                <Link 
                  to="/settings" 
                  className={`px-3 py-2 rounded-md flex items-center text-sm ${
                    location.pathname === '/settings' 
                      ? 'bg-slate-700 text-cyan-400' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-400'
                  }`}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  <span>Settings</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="ghost" className="text-slate-300 hover:text-cyan-400">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
