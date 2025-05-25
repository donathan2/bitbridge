import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Project } from '@/hooks/useProject';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Bitcoin, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getLevelFromExperience } from '@/utils/xpUtils';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<{
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    experience_points: number | null;
    bits_currency: number | null;
    bytes_currency: number | null;
  } | null>(null);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/auth');
      return;
    }

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/profile?userId=${user?.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProfile(data.profile);
        setCompletedProjects(data.completedProjects);
      } catch (error) {
        console.error("Could not fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user, navigate, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="container mx-auto p-4">No profile data available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="w-24 h-24">
          <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name || "Profile"} />
          <AvatarFallback>{profile.full_name?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile.full_name || 'No Name'}</h1>
          <p className="text-sm text-gray-500">@{profile.username || 'No Username'}</p>
          <p className="text-sm text-gray-500">Level: {getLevelFromExperience(profile.experience_points || 0)}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Completed Projects</h2>
        {completedProjects.length === 0 ? (
          <p>No completed projects yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {completedProjects.map((project) => (
                    <Card key={project.id} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">{project.title}</CardTitle>
                            <CardDescription className="text-slate-300">
                              {project.description}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="bg-green-600 text-white">
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="border-cyan-400 text-cyan-400 bg-cyan-400/10 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {project.xp_reward} XP
                          </Badge>
                          <Badge variant="outline" className="border-yellow-400 text-yellow-400 bg-yellow-400/10 flex items-center gap-1">
                            <span className="font-bold text-xs">₿</span>
                            {project.bits_reward} Bits
                          </Badge>
                          <Badge variant="outline" className="border-purple-400 text-purple-400 bg-purple-400/10 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {project.bytes_reward} Bytes
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Statistics</h2>
        <p>Experience Points: {profile.experience_points || 0}</p>
        <p>Bits Currency: {profile.bits_currency || 0}</p>
        <p>Bytes Currency: {profile.bytes_currency || 0}</p>
      </div>
    </div>
  );
};

export default Profile;
