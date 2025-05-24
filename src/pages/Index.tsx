
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Trophy, Code, Star, Search, Zap, BarChart, Users, Rocket } from 'lucide-react';

const Index = () => {
  return (
    <div className="p-6">
      <div className="container mx-auto px-6 py-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-cyan-400 mb-6 font-sans">
            Explore BitBridge
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Discover amazing projects, find your next challenge, and connect with developers worldwide
          </p>
          <div className="max-w-xl mx-auto">
            <p className="text-lg text-cyan-300 font-medium">Your coding adventure awaits</p>
            <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="bg-cyan-500/20 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-cyan-400" />
                </div>
                <span>Discover new projects</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="bg-cyan-500/20 p-2 rounded-full">
                  <Users className="h-5 w-5 text-cyan-400" />
                </div>
                <span>Join amazing teams</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <Card className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Search className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-cyan-400">Find Projects</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-300">
                Browse through hundreds of exciting projects across different technologies and skill levels
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-cyan-400">Join Teams</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-300">
                Connect with like-minded developers and collaborate on projects that match your interests
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-cyan-400">Earn Rewards</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-300">
                Complete projects to earn XP, bits, bytes, and unlock new opportunities and perks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-cyan-400 text-center mb-10">Community Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <BarChart className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-white mb-2">125+</h3>
                <p className="text-slate-400">Active Projects</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-white mb-2">500+</h3>
                <p className="text-slate-400">Active Developers</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Code className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-white mb-2">25K+</h3>
                <p className="text-slate-400">Lines of Code</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Rocket className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-white mb-2">80+</h3>
                <p className="text-slate-400">Technologies Used</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-cyan-400 text-center mb-10">How BitBridge Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Find Projects</h3>
              <p className="text-slate-300">
                Browse available projects or create your own to practice new skills and technologies
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Collaborate</h3>
              <p className="text-slate-300">
                Work with other developers, receive feedback, and improve your teamwork skills
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Level Up</h3>
              <p className="text-slate-300">
                Earn XP, unlock achievements, and build a portfolio that showcases your growth
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4 font-sans">Ready to start exploring?</h2>
            <p className="text-slate-300 mb-8">
              Find your next project and start building something amazing today
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/find-project">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border-0">
                  <Search className="w-5 h-5 mr-2" />
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
