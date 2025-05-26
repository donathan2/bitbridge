
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useProjectMembers } from '@/hooks/useProjectMembers';
import { useAvatar } from '@/hooks/useAvatar';
import ProjectRewards from './ProjectRewards';

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

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-teal-500';
    case 'Intermediate': return 'bg-blue-500';
    case 'Advanced': return 'bg-indigo-600';
    case 'Expert': return 'bg-violet-700';
    default: return 'bg-teal-500';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isUserMember,
  onJoinProject,
  onProjectClick,
  joinLoading
}) => {
  const { members } = useProjectMembers(project.id);
  const { avatarUrl: creatorAvatarUrl } = useAvatar(project.creatorId);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showAllRoles, setShowAllRoles] = useState(false);

  const getMembersForRole = (role: string) => {
    return members.filter(member => member.role === role);
  };

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🎯 ProjectCard handleJoinClick:', { selectedRole, projectId: project.id });
    
    if (selectedRole) {
      try {
        await onJoinProject(project.id, selectedRole);
      } catch (error) {
        console.error('❌ Error in handleJoinClick:', error);
      }
    } else {
      console.log('⚠️ No role selected');
    }
  };

  const visibleRoles = showAllRoles ? project.rolesNeeded : project.rolesNeeded.slice(0, 2);
  const hiddenRolesCount = project.rolesNeeded.length - 2;

  return (
    <Card className="bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-cyan-900/20 transition-all cursor-pointer group">
      <CardHeader className="pb-4" onClick={() => onProjectClick(project)}>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
            {project.title}
          </CardTitle>
          <Badge className={`${getDifficultyColor(project.difficulty)} text-white text-xs flex-shrink-0 ml-2`}>
            {project.difficulty}
          </Badge>
        </div>
        <p className="text-slate-300 text-sm line-clamp-3 mb-4">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {project.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="outline" className="text-xs text-slate-300 border-slate-600">
                {category}
              </Badge>
            ))}
            {project.categories.length > 3 && (
              <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                +{project.categories.length - 3}
              </Badge>
            )}
          </div>

          {/* Rewards */}
          <div>
            <ProjectRewards 
              difficulty={project.difficulty}
              xpReward={project.xpReward}
              bitsReward={project.bitsReward}
              bytesReward={project.bytesReward}
            />
          </div>

          {/* Compact Team Members */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-300">Team:</h4>
              {project.rolesNeeded.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllRoles(!showAllRoles);
                  }}
                  className="h-6 px-2 text-slate-400 hover:text-slate-300"
                >
                  {showAllRoles ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {showAllRoles ? 'Less' : `+${hiddenRolesCount} more`}
                </Button>
              )}
            </div>
            
            {visibleRoles.map((role) => {
              const roleMembers = getMembersForRole(role);
              return (
                <div key={role} className="text-xs bg-slate-700/50 rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-cyan-400 font-medium truncate">{role}</span>
                    <span className="text-slate-400 text-xs">({roleMembers.length})</span>
                  </div>
                  
                  {roleMembers.length > 0 ? (
                    <div className="flex items-center gap-1 overflow-hidden">
                      {roleMembers.slice(0, 2).map((member) => {
                        const { avatarUrl: memberAvatarUrl } = useAvatar(member.user_id);
                        return (
                          <div key={member.id} className="flex items-center gap-1 bg-slate-600 rounded px-1.5 py-0.5 min-w-0">
                            <Avatar className="h-3 w-3 flex-shrink-0">
                              <AvatarImage src={memberAvatarUrl} />
                              <AvatarFallback className="bg-cyan-600 text-white text-[8px]">
                                {(member.user.full_name || member.user.username || 'U').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-slate-300 text-xs truncate">
                              {member.user.username || member.user.full_name || 'Unknown'}
                            </span>
                          </div>
                        );
                      })}
                      {roleMembers.length > 2 && (
                        <span className="text-slate-400 text-xs">+{roleMembers.length - 2}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500 italic text-xs">Open</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={creatorAvatarUrl} />
              <AvatarFallback className="bg-cyan-600 text-white text-xs">
                {project.creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-slate-400">by @{project.creator.username}</span>
          </div>

          {/* Created Date */}
          <div className="flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(project.createdAt!).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Join Section */}
          <div className="pt-2 space-y-2">
            {isUserMember ? (
              <Button disabled className="w-full bg-green-600 text-white">
                <Users className="mr-2 h-4 w-4" />
                Already Joined
              </Button>
            ) : (
              <>
                <Select onValueChange={setSelectedRole} value={selectedRole}>
                  <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                    {project.rolesNeeded.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleJoinClick}
                  disabled={joinLoading || !selectedRole}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white disabled:opacity-50"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {joinLoading ? 'Joining...' : `Join as ${selectedRole || 'Select Role'}`}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
