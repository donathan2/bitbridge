
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Users, Trophy, Zap, Star, Bitcoin, DollarSign } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-pixel mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            BitBridge
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Let's build bridges through code. Connect with developers, collaborate on projects, and level up together.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardHeader>
              <Code className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <CardTitle className="text-white font-pixel text-sm">Collaborate</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Work together on real projects with developers from around the world
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-white font-pixel text-sm">Build Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Form teams with complementary skills and tackle ambitious projects together
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardHeader>
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-white font-pixel text-sm">Earn Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Gain XP, unlock achievements, and earn currency for completing projects
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardHeader>
              <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-white font-pixel text-sm">Level Up</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Improve your skills, build your portfolio, and advance your career
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Reward System Showcase */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-pixel mb-8 text-white">Gamified Development Experience</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="bg-slate-800 px-6 py-4 rounded-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-cyan-400" />
                <div className="text-left">
                  <p className="text-cyan-400 font-bold text-xl">Experience Points</p>
                  <p className="text-slate-300 text-sm">Level up and unlock new features</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 px-6 py-4 rounded-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <Bitcoin className="w-8 h-8 text-yellow-400" />
                <div className="text-left">
                  <p className="text-yellow-400 font-bold text-xl">Bits Currency</p>
                  <p className="text-slate-300 text-sm">Buy boosts and profile upgrades</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 px-6 py-4 rounded-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-purple-400" />
                <div className="text-left">
                  <p className="text-purple-400 font-bold text-xl">Bytes Premium</p>
                  <p className="text-slate-300 text-sm">Access premium features and titles</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-pixel mb-4 text-white">Ready to Start Your Journey?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of developers building the future together
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-4 text-xl"
          >
            Join BitBridge Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
