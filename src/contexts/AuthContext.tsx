
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Cleanup function to remove all auth-related storage
const cleanupAuthState = () => {
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Function to ensure user has a profile entry
const ensureUserProfile = async (user: User) => {
  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // Profile doesn't exist, create one
      console.log('Creating profile for existing OAuth user:', user.email);
      
      // Extract name from user metadata with better fallbacks
      let displayName = user.user_metadata?.full_name || 
                       user.user_metadata?.name || 
                       user.user_metadata?.display_name;
      
      // If no name found, create a default based on email or provider
      if (!displayName) {
        const emailPrefix = user.email?.split('@')[0] || 'User';
        // Capitalize first letter and make it more readable
        displayName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      }
      
      // Generate username with fallbacks
      let username = user.user_metadata?.user_name || 
                    user.user_metadata?.preferred_username ||
                    user.email?.split('@')[0];
      
      // If still no username, generate one
      if (!username) {
        username = `user${Math.floor(Math.random() * 10000)}`;
      }
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: displayName,
          avatar_url: user.user_metadata?.avatar_url,
          username: username
        });
      
      if (insertError) {
        console.error('Error creating profile for OAuth user:', insertError);
      } else {
        console.log('Successfully created profile for OAuth user with name:', displayName);
      }
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Ensure profile exists for OAuth users
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            ensureUserProfile(session.user);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Ensure profile exists for existing OAuth users
      if (session?.user) {
        setTimeout(() => {
          ensureUserProfile(session.user);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out (don't throw if it fails due to invalid session)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.log('Sign out error (continuing anyway):', error);
        // Continue with cleanup even if sign out fails
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      // Safe navigation - check if we're already on auth page
      if (location.pathname !== '/auth') {
        navigate('/auth', { replace: true });
      }
    } catch (error) {
      console.error('Error during sign out process:', error);
      // Even if there's an error, navigate to auth page safely
      if (location.pathname !== '/auth') {
        navigate('/auth', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
