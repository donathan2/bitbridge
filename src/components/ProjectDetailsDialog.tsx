
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Github, ExternalLink, Users } from 'lucide-react';
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

interface ProjectDetailsDialogProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  isUserMember: boolean;
  onJoinProject: (projectId: string, role: string) => Promise<void>;
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

// Separate component for member display to avoid hooks in loops
const TeamMemberItem: React.FC<{ member: any }> = ({ member }) => {
  const { avatarUrl: memberAvatarUrl } = useAvatar(member.user_id);
  
  return (
    <div className="flex items-center gap-3 bg-slate-600 rounded-md p-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={memberAvatarUrl} />
        <AvatarFallback className="bg-cyan-600 text-white text-xs">
          {(member.user.full_name || member.user.username || 'U').charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-white font-medium">
          {member.user.full_name || member.user.username || 'Unknown User'}
        </p>
        {member.user.username && member.user.full_name && (
          <p className="text-slate-400 text-sm">@{member.user.username}</p>
        )}
      </div>
      <div className="ml-auto text-xs text-slate-400">
        Joined {new Date(member.joined_at).toLocaleDateString()}
      </div>
    </div>
  );
};

const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({
  project,
  isOpen,
  onClose,
  isUserMember,
  onJoinProject,
  joinLoading
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { members } = useProjectMembers(project?.id || '');
  
  // Use useAvatar hook for creator profile picture
  const { avatarUrl: creatorAvatarUrl } = useAvatar(project?.creatorId);

  if (!project) return null;

  const getMembersForRole = (role: string) => {
    return members.filter(member => member.role === role);
  };

  const handleJoinClick = async () => {
    if (selectedRole) {
      await onJoinProject(project.id, selectedRole);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-400 flex items-center gap-2">
            {project.title}
            <Badge className={`${getDifficultyColor(project.difficulty)} ml-2 text-white`}>
              {project.difficulty}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="text-slate-300">
            {project.description}
          </div>

          {/* Rewards Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Rewards</h3>
            <ProjectRewards 
              difficulty={project.difficulty}
              xpReward={project.xpReward}
              bitsReward={project.bitsReward}
              bytesReward={project.bytesReward}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-slate-300 font-semibold mb-1">Creator</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={creatorAvatarUrl} />
                  <AvatarFallback className="bg-cyan-600 text-white text-xs">
                    {project.creator.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-cyan-300">@{project.creator.username}</span>
              </div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-slate-300 font-semibold mb-1">Created Date</p>
              <p className="text-white">{new Date(project.createdAt!).toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {project.categories.map((category: string) => (
                <Badge key={category} className="bg-slate-700 text-cyan-300">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Team Members by Role */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Team Members</h3>
            <div className="space-y-4">
              {project.rolesNeeded.map((role) => {
                const roleMembers = getMembersForRole(role);
                return (
                  <div key={role} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-cyan-400">{role}</h4>
                      <span className="text-slate-400 text-sm">({roleMembers.length} members)</span>
                    </div>
                    <div className="space-y-2">
                      {roleMembers.length > 0 ? (
                        roleMembers.map((member) => (
                          <TeamMemberItem key={member.id} member={member} />
                        ))
                      ) : (
                        <p className="text-slate-500 italic">No members in this role yet</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* GitHub Link */}
          {project.githubUrl && (
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 text-white" />
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cyan-400 hover:underline flex items-center"
              >
                GitHub Repository
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
          
          {/* Project Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
            {isUserMember ? (
              <Button disabled className="bg-green-600 text-white">
                <Users className="mr-2 h-4 w-4" />
                Already Joined
              </Button>
            ) : (
              <div className="flex gap-2">
                <Select onValueChange={setSelectedRole} value={selectedRole}>
                  <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600 text-slate-200">
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
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white disabled:opacity-50"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {joinLoading ? 'Joining...' : `Join as ${selectedRole || 'Select Role'}`}
                </Button>
              </div>
            )}
            <Button variant="outline" className="border-slate-600 text-slate-300" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
