
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, Star, Crown } from 'lucide-react';
import { useAvatar } from '@/hooks/useAvatar';

interface Project {
  id: string;
  title: string;
  description: string;
  categories: string[];
  rolesNeeded: string[];
  githubUrl: string | null;
  endDate: string | null;
  difficulty: string;
  xpReward: number;
  bitsReward: number;
  bytesReward: number;
  creatorId: string;
  createdAt: string | null;
  creator: {
    name: string;
    username: string;
    avatar: string;
  };
}

interface ProjectCardProps {
  project: Project;
  isUserMember: boolean;
  onJoinProject: (projectId: string, role: string) => Promise<void>;
  onProjectClick: (project: Project) => void;
  joinLoading: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isUserMember,
  onJoinProject,
  onProjectClick,
  joinLoading
}) => {
  const { avatarUrl, name, username } = useAvatar(project.creatorId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500';
      case 'Intermediate':
        return 'bg-yellow-500';
      case 'Advanced':
        return 'bg-orange-500';
      case 'Expert':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.rolesNeeded.length > 0) {
      onJoinProject(project.id, project.rolesNeeded[0]);
    }
  };

  return (
    <Card 
      className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-all duration-300 cursor-pointer group"
      onClick={() => onProjectClick(project)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
            {project.title}
          </CardTitle>
          <Badge 
            className={`${getDifficultyColor(project.difficulty)} text-white text-xs px-2 py-1 ml-2 flex-shrink-0`}
          >
            {project.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {project.categories.slice(0, 3).map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-300">
              {category}
            </Badge>
          ))}
          {project.categories.length > 3 && (
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
              +{project.categories.length - 3}
            </Badge>
          )}
        </div>

        {/* Creator Info */}
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>by @{username}</span>
        </div>

        {/* Roles needed */}
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 text-sm">
            {project.rolesNeeded.length > 0 
              ? project.rolesNeeded.slice(0, 2).join(', ')
              : 'No specific roles'}
            {project.rolesNeeded.length > 2 && ` +${project.rolesNeeded.length - 2}`}
          </span>
        </div>

        {/* Rewards */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300">{project.xpReward} XP</span>
            </div>
            <div className="flex items-center space-x-1">
              <Crown className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">{project.bitsReward}</span>
            </div>
          </div>
        </div>

        {/* End date */}
        {project.endDate && (
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* Action button */}
        <div className="pt-2">
          {isUserMember ? (
            <Button 
              disabled 
              className="w-full bg-green-600 text-white"
            >
              ✓ Joined
            </Button>
          ) : (
            <Button
              onClick={handleJoinClick}
              disabled={joinLoading || project.rolesNeeded.length === 0}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white transition-all duration-300"
            >
              {joinLoading ? 'Joining...' : 'Join Project'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
