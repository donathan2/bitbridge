import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, Users, Bitcoin, DollarSign, Vault, Compass } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useProfile } from '@/hooks/useProfile';
import { useAvatar } from '@/hooks/useAvatar';
import { useFriendNotifications } from '@/hooks/useFriendNotifications';
import { getProgressToNextLevel } from '@/utils/xpUtils';
import { supabase } from '@/integrations/supabase/client';

const NavBar = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { profile: publicProfile } = useProfile();
  const { avatarUrl, name } = useAvatar();
  const { notificationCount } = useFriendNotifications();
  
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
          // Let React Query handle the re-fetching instead of forcing a reload
          console.log('Profile updated, React Query will handle the refresh');
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
              <div className="h-12 w-12 mr-3">
                <img src="/lovable-uploads/d809f725-76cd-4f33-bc68-0c1316f64d94.png" alt="BitBridge" className="h-full w-full object-contain" />
              </div>
              <span className="text-cyan-400 text-xl font-pixel">BitBridge</span>
            </Link>
          </div>

          {/* XP and Currency Display - show for authenticated users with fallback values */}
          {user && (
            <div className="hidden lg:flex items-center space-x-4 bg-slate-700 px-4 py-2 rounded-lg">
              {/* User Avatar */}
              <Avatar className="w-8 h-8">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-slate-600 text-sm">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
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
                  className={`px-3 py-2 rounded-md flex items-center text-sm relative ${
                    location.pathname === '/friends' 
                      ? 'bg-slate-700 text-cyan-400' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-400'
                  }`}
                >
                  <Users className="h-4 w-4 mr-1" />
                  <span>Friends</span>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
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
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Sign In
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
