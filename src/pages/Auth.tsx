import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User is logged in, redirecting to home');
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          console.log('Login successful:', data.user);
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          // Let the auth context handle the redirect
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        
        if (error) throw error;
        
        if (data.user) {
          console.log('Signup successful:', data.user);
          toast({
            title: "Account created!",
            description: "Welcome to BitBridge! You can start exploring now.",
          });
          // Let the auth context handle the redirect
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      console.log(`Attempting ${provider} login...`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error(`${provider} OAuth error:`, error);
        throw error;
      }
      
      console.log(`${provider} OAuth initiated successfully`, data);
      
      toast({
        title: "Redirecting...",
        description: `Please complete the ${provider} authentication.`,
      });
      
    } catch (error: any) {
      console.error('Social login error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || `Failed to sign in with ${provider}. Please check your connection and try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-lg">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-3xl font-bold text-cyan-400">
            {isLogin ? 'Welcome Back' : 'Join BitBridge'}
          </CardTitle>
          <p className="text-slate-400 mt-2">
            {isLogin ? 'Sign in to your account' : 'Create your account and start your coding journey'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400" 
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400" 
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/20 transition-all"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200"
              onClick={() => handleSocialLogin('github')}
              type="button"
            >
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
            <Button 
              variant="outline" 
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200"
              onClick={() => handleSocialLogin('google')}
              type="button"
            >
              <Mail className="mr-2 h-5 w-5" />
              Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center pt-0">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
