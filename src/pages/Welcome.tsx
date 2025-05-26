
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Bitcoin, DollarSign, Star, Trophy, Users, Code, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10"></div>
        <div className="relative px-6 py-24 mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <div className="h-24 w-24">
                <img src="/lovable-uploads/d809f725-76cd-4f33-bc68-0c1316f64d94.png" alt="BitBridge" className="h-full w-full object-contain" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-pixel">
              BitBridge
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Connect. Collaborate. Code. Join the ultimate developer community where your skills unlock rewards and friendships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 text-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/find-project">
                <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 text-lg">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-20 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why BitBridge?</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience a new way to grow as a developer through meaningful collaboration and gamified learning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project Collaboration */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Real Projects</CardTitle>
              <CardDescription className="text-slate-400">
                Work on actual projects with developers from around the world. Build your portfolio while making meaningful contributions.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Rewards System */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Earn Rewards</CardTitle>
              <CardDescription className="text-slate-400">
                Complete projects and earn <span className="text-yellow-400 font-medium">Bits</span> (in-game currency) and <span className="text-purple-400 font-medium">Bytes</span> (premium currency) to unlock exclusive titles and features.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Level System */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Level Up</CardTitle>
              <CardDescription className="text-slate-400">
                Gain <span className="text-cyan-400 font-medium">experience points (XP)</span> as you complete projects and level up your developer profile to showcase your growth.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Community */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Build Network</CardTitle>
              <CardDescription className="text-slate-400">
                Connect with like-minded developers, make friends, and build lasting professional relationships.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Achievements */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Unlock Titles</CardTitle>
              <CardDescription className="text-slate-400">
                Earn unique titles and badges to display your expertise and stand out in the developer community.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Skill Growth */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Skill Development</CardTitle>
              <CardDescription className="text-slate-400">
                Learn from experienced developers and grow your skills through hands-on collaboration and mentorship.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-6 py-20 mx-auto max-w-7xl bg-slate-800/30">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-lg text-slate-400">Get started in just a few simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Join or Create</h3>
            <p className="text-slate-400">
              Browse exciting projects or create your own. Find the perfect match for your skills and interests.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Collaborate</h3>
            <p className="text-slate-400">
              Work with talented developers, share knowledge, and build amazing things together.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Earn Rewards</h3>
            <p className="text-slate-400">
              Complete projects to earn XP, Bits, and Bytes. Level up and unlock exclusive titles.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Progress */}
      <div className="px-6 py-20 mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Track Your Progress</h2>
          <p className="text-lg text-slate-400">See how your developer journey unfolds</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-cyan-400" />
              Your Developer Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Level Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 font-medium">Level 3 Developer</span>
                <span className="text-slate-400 text-sm">2,450 / 3,200 XP</span>
              </div>
              <Progress value={76} className="h-3" />
              <p className="text-xs text-slate-400 mt-1">750 XP to next level</p>
            </div>

            {/* Currency Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Bitcoin className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-lg">1,250</span>
                </div>
                <p className="text-slate-400 text-sm">Bits - Earned from completed projects</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-bold text-lg">15</span>
                </div>
                <p className="text-slate-400 text-sm">Bytes - Premium currency for titles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="px-6 py-20 mx-auto max-w-4xl text-center">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-lg p-12 border border-cyan-500/20">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are building their careers, one project at a time.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-4 text-lg">
              Join BitBridge Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
