
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Trophy, Code, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-slate-800 mb-6 font-sans">
            BitBridge
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-light">
            Track your coding journey, showcase your projects, and level up your development skills
          </p>
          <Link to="/profile">
            <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <User className="w-5 h-5 mr-2" />
              View Profile
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">Track Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 font-light">
                Monitor your coding journey with XP tracking, skill levels, and achievement badges
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">Manage Projects</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 font-light">
                Keep track of your completed and ongoing projects with detailed progress tracking
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">Showcase Skills</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 font-light">
                Display your technical expertise and project portfolio in a beautiful, professional format
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 font-sans">Ready to showcase your journey?</h2>
            <p className="text-slate-600 mb-8 font-light">
              Create your developer profile and start tracking your progress today
            </p>
            <Link to="/profile">
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
