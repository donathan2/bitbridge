
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAvatar } from '@/hooks/useAvatar';

interface MessageUserAvatarProps {
  message: {
    id: string;
    user_id: string;
    message: string;
    created_at: string;
    user?: {
      username?: string;
      full_name?: string;
    };
  };
}

const MessageUserAvatar: React.FC<MessageUserAvatarProps> = ({ message }) => {
  const { avatarUrl: messageUserAvatarUrl } = useAvatar(message.user_id);
  
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={messageUserAvatarUrl} />
        <AvatarFallback className="bg-cyan-600 text-white text-xs">
          {(message.user?.username || message.user?.full_name || 'U').charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-cyan-400">
            {message.user?.username || message.user?.full_name || 'Unknown User'}
          </p>
          <p className="text-xs text-slate-400">
            {new Date(message.created_at).toLocaleString()}
          </p>
        </div>
        <p className="text-white mt-1">{message.message}</p>
      </div>
    </div>
  );
};

export default MessageUserAvatar;
