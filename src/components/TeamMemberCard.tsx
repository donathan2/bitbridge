
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAvatar } from '@/hooks/useAvatar';

interface TeamMemberCardProps {
  member: {
    id: string;
    user_id: string;
    role: string;
    user?: {
      full_name?: string;
      username?: string;
      avatar_url?: string;
    };
  };
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const { avatarUrl: memberAvatarUrl } = useAvatar(member.user_id);
  
  return (
    <div className="bg-slate-700 border-slate-600 p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={memberAvatarUrl} />
          <AvatarFallback className="bg-cyan-600 text-white text-xl">
            {(member.user?.full_name || member.user?.username || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium text-white">{member.user?.username || member.user?.full_name || 'Unknown'}</h3>
          <p className="text-cyan-400">{member.role}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
