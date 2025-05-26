
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, MapPin, Github, Linkedin, Twitter, Globe, Users, Trophy, Star } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useFriendsCount } from '@/hooks/useFriendsCount';
import { getProgressToNextLevel } from '@/utils/xpUtils';

const ViewProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  // We'll need to create a hook that fetches any user's profile data
  // For now, let's use the existing hooks and modify them to accept a userId parameter
  
  if (!userId) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">User Not Found</h1>
          <Button onClick={() => navigate('/friends')} className="bg-cyan-600 hover:bg-cyan-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Friends
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={() => navigate('/friends')} 
            variant="outline" 
            className="border-slate-600 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Friends
          </Button>
          <h1 className="text-2xl font-bold text-cyan-400">User Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and basic info */}
              <div className="flex flex-col items-center md:items-start space-y-4">
                <Avatar className="w-32 h-32 border-4 border-slate-700">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-3xl">
                    U
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-1">Loading...</h2>
                  <p className="text-slate-400 mb-2">@loading</p>
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                    Loading...
                  </Badge>
                </div>
              </div>

              {/* Stats and info */}
              <div className="flex-1 space-y-6">
                {/* Level and XP */}
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-300">Level Progress</span>
                        <span className="text-sm text-slate-400">0 / 1000 XP</span>
                      </div>
                      <Progress value={0} className="h-3 bg-slate-700" />
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-xl font-bold text-white">0</div>
                    <div className="text-sm text-slate-400">XP Points</div>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-xl font-bold text-white">0</div>
                    <div className="text-sm text-slate-400">Projects</div>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-xl font-bold text-white">0</div>
                    <div className="text-sm text-slate-400">Friends</div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Loading user bio...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-slate-400 py-8">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent projects to display</p>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-slate-400 py-8">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No achievements to display</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewProfile;
