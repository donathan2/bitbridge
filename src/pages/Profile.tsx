import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Award, Star, Trophy, Target, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserTitles } from '@/hooks/useUserTitles';
import { getProgressToNextLevel } from '@/utils/xpUtils';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAvatar } from '@/hooks/useAvatar';
import ProjectMemberAvatar from '@/components/ProjectMemberAvatar';

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  creator_id: string;
  creator?: {
    name: string;
    username: string;
    avatar: string;
  };
  member_count?: number;
  xp_reward?: number;
  completed_at?: string;
}

interface UserTitle {
  id: string;
  title: string;
  xp_required: number;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-teal-500';
    case 'Intermediate': return 'bg-blue-500';
    case 'Advanced': return 'bg-indigo-600';
    case 'Expert': return 'bg-violet-700';
    default: return 'bg-teal-500';
  }
};

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { userProfile, loading: userProfileLoading } = useUserProfile();
  const { titles, loading: titlesLoading } = useUserTitles();
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch ongoing projects
      const { data: ongoingData, error: ongoingError } = await supabase
        .from('projects')
        .select('*, creator:creator_id(username, full_name, avatar_url)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (ongoingError) {
        console.error('Error fetching ongoing projects:', ongoingError);
        setError(ongoingError.message);
      } else {
        setOngoingProjects(ongoingData || []);
      }

      // Fetch completed projects
      const { data: completedData, error: completedError } = await supabase
        .from('projects')
        .select('*, creator:creator_id(username, full_name, avatar_url)')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (completedError) {
        console.error('Error fetching completed projects:', completedError);
        setError(completedError.message);
      } else {
        setCompletedProjects(completedData || []);
      }
    } catch (err) {
      console.error('Error in fetchProjects:', err);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading || userProfileLoading || titlesLoading || loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <p className="text-center text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !userProfile) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <p className="text-center text-red-500">Failed to load profile.</p>
        </div>
      </div>
    );
  }

  const { currentLevel, nextLevel, progress } = getProgressToNextLevel(userProfile.xp);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-cyan-400 mb-2">
            {profile.full_name || user.email}
          </h2>
          <p className="text-lg text-slate-300">@{profile.username}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Level {currentLevel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-300 text-sm">
                <p>
                  {progress}% to Level {nextLevel}
                </p>
                <progress className="w-full h-2 bg-slate-700 rounded" value={progress} max="100"></progress>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-400" />
                XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-200">{userProfile.xp}</p>
              <p className="text-slate-400 text-sm">Total Experience Points</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Current Title
              </CardTitle>
            </CardHeader>
            <CardContent>
              {titles && titles.length > 0 ? (
                <>
                  <p className="text-xl font-bold text-slate-200">{titles[0].title}</p>
                  <p className="text-slate-400 text-sm">Achieved Title</p>
                </>
              ) : (
                <p className="text-slate-400 text-sm">No title achieved yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ongoing Projects */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Ongoing Projects ({ongoingProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ongoingProjects.length === 0 ? (
                <p className="text-slate-400 text-sm">No ongoing projects</p>
              ) : (
                <div className="space-y-3">
                  {ongoingProjects.map((project) => (
                    <div key={project.id} className="bg-slate-700 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white text-sm">{project.title}</h4>
                        <Badge className={`${getDifficultyColor(project.difficulty)} text-white text-xs`}>
                          {project.difficulty}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-xs mb-2 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ProjectMemberAvatar 
                            userId={project.creator_id} 
                            userName={project.creator?.name}
                            className="h-5 w-5"
                          />
                          <span className="text-slate-400 text-xs">by @{project.creator?.username || 'unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Users className="h-3 w-3" />
                          <span className="text-xs">{project.member_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Projects */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Completed Projects ({completedProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedProjects.length === 0 ? (
                <p className="text-slate-400 text-sm">No completed projects</p>
              ) : (
                <div className="space-y-3">
                  {completedProjects.map((project) => (
                    <div key={project.id} className="bg-slate-700 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white text-sm">{project.title}</h4>
                        <Badge className={`${getDifficultyColor(project.difficulty)} text-white text-xs`}>
                          {project.difficulty}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-xs mb-2 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ProjectMemberAvatar 
                            userId={project.creator_id} 
                            userName={project.creator?.name}
                            className="h-5 w-5"
                          />
                          <span className="text-slate-400 text-xs">by @{project.creator?.username || 'unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-400">
                          <Award className="h-3 w-3" />
                          <span className="text-xs">+{project.xp_reward || 0} XP</span>
                        </div>
                      </div>
                      {project.completed_at && (
                        <div className="flex items-center gap-1 mt-2 text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs">
                            Completed {new Date(project.completed_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">Coming Soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
