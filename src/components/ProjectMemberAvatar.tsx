
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAvatar } from '@/hooks/useAvatar';

interface ProjectMemberAvatarProps {
  userId: string;
  userName?: string;
  className?: string;
}

const ProjectMemberAvatar: React.FC<ProjectMemberAvatarProps> = ({ 
  userId, 
  userName, 
  className = "h-8 w-8" 
}) => {
  const { avatarUrl, name } = useAvatar(userId);

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback className="bg-cyan-600 text-white text-xs">
        {(userName || name || 'U').charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProjectMemberAvatar;
