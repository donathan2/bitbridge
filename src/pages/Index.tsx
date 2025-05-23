
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Trophy, Code, Star, Search } from 'lucide-react';

const Index = () => {
  return (
    <div className="p-6">
      <div className="container mx-auto px-6 py-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-cyan-400 mb-6 font-sans">
            BitBridge
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Track your coding journey, showcase your projects, and level up your development skills
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/profile">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border-0">
                <User className="w-5 h-5 mr-2" />
                View Profile
              </Button>
            </Link>
            <Link to="/find-project">
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 border-0">
                <Search className="w-5 h-5 mr-2" />
                Find Project
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 text-lg transition-all duration-300">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <Card className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-cyan-400">Track Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-300">
                Monitor your coding journey with XP tracking, skill levels, and achievement badges
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Code className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-cyan-400">Manage Projects</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-300">
                Keep track of your completed and ongoing projects with detailed progress tracking
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-cyan-400">Showcase Skills</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-300">
                Display your technical expertise and project portfolio in a beautiful, professional format
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4 font-sans">Ready to showcase your journey?</h2>
            <p className="text-slate-300 mb-8">
              Create your developer profile and start tracking your progress today
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border-0">
                  Get Started
                </Button>
              </Link>
              <Link to="/find-project">
                <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 text-lg transition-all duration-300">
                  Browse Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
