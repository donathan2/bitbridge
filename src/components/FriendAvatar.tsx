
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAvatar } from '@/hooks/useAvatar';

interface FriendAvatarProps {
  userId: string;
  className?: string;
  fallbackClassName?: string;
}

const FriendAvatar: React.FC<FriendAvatarProps> = ({ 
  userId, 
  className = "h-12 w-12", 
  fallbackClassName = "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
}) => {
  const { avatarUrl, name, loading } = useAvatar(userId);

  if (loading) {
    return (
      <Avatar className={`${className} border-2 border-slate-700`}>
        <AvatarFallback className={fallbackClassName}>
          ...
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={`${className} border-2 border-slate-700`}>
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className={fallbackClassName}>
        {name.split(' ').map(n => n[0]).join('').toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default FriendAvatar;
