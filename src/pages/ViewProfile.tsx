
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, FolderOpen, Clock } from 'lucide-react';
import { useViewProfile } from '@/hooks/useViewProfile';
import { useAvatar } from '@/hooks/useAvatar';
import { getLevelFromExperience } from '@/utils/xpUtils';

const ViewProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { profile, loading, error } = useViewProfile(userId);
  const { avatarUrl, name } = useAvatar(userId);

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-slate-700 rounded mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Profile Not Found</h1>
          <p className="text-slate-300 mb-6">The user profile you're looking for doesn't exist or is not accessible.</p>
          <Link to="/friends">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Friends
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentLevel = getLevelFromExperience(profile.experience_points || 0);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/friends">
            <Button variant="ghost" className="text-slate-300 hover:text-cyan-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Friends
            </Button>
          </Link>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24 border-4 border-slate-600">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-2xl">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
                  <p className="text-lg text-slate-300">@{profile.username || 'unknown'}</p>
                  {profile.active_title && (
                    <Badge className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      {profile.active_title}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Level Display */}
              <div className="flex-1 ml-auto">
                <div className="bg-slate-700 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">{currentLevel}</div>
                  <div className="text-sm text-slate-300">Level</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        {profile.bio && (
          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-cyan-400">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Skill Level */}
        {profile.skill_level && (
          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-cyan-400">Skill Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base px-4 py-2">
                {profile.skill_level}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Completed Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.projects?.completed && profile.projects.completed.length > 0 ? (
                <div className="space-y-3">
                  {profile.projects.completed.map((project: any) => (
                    <div key={project.id} className="bg-slate-700 rounded-lg p-3">
                      <h4 className="font-medium text-white mb-1">{project.title}</h4>
                      <p className="text-sm text-slate-300 mb-2">{project.description}</p>
                      <Badge className="bg-green-600 text-white text-xs">
                        {project.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">
                  No completed projects yet
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Ongoing Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.projects?.ongoing && profile.projects.ongoing.length > 0 ? (
                <div className="space-y-3">
                  {profile.projects.ongoing.map((project: any) => (
                    <div key={project.id} className="bg-slate-700 rounded-lg p-3">
                      <h4 className="font-medium text-white mb-1">{project.title}</h4>
                      <p className="text-sm text-slate-300 mb-2">{project.description}</p>
                      <Badge className="bg-blue-600 text-white text-xs">
                        {project.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">
                  No ongoing projects
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
