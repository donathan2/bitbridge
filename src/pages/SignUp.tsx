
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github, Mail } from 'lucide-react';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-lg">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-3xl font-bold text-cyan-400">Join BitBridge</CardTitle>
          <p className="text-slate-400 mt-2">Create your account and start your coding journey</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Full Name</Label>
              <Input id="name" placeholder="John Doe" className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <Input id="username" placeholder="johndoe123" className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400" />
            </div>
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/20 transition-all">
              Create Account
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
              <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200">
                <Mail className="mr-2 h-5 w-5" />
                Google
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center pt-0">
          <p className="text-slate-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
