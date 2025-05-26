
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAvatar } from '@/hooks/useAvatar';
import { ProjectMember } from '@/hooks/useProjectMembers';

interface TaskAssigneeListProps {
  assignedUserIds: string[];
  members: ProjectMember[];
}

const TaskAssignee: React.FC<{ member: ProjectMember }> = ({ member }) => {
  const { avatarUrl } = useAvatar(member.user_id);
  
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="bg-cyan-600 text-white text-xs">
          {(member.user?.full_name || member.user?.username || 'U').charAt(0)}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-white">
        {member.user?.full_name || member.user?.username || 'Unknown User'}
      </span>
      <Badge variant="outline" className="text-xs text-slate-400 border-slate-500">
        {member.role}
      </Badge>
    </div>
  );
};

const TaskAssigneeList: React.FC<TaskAssigneeListProps> = ({ assignedUserIds, members }) => {
  if (!assignedUserIds || assignedUserIds.length === 0) {
    return (
      <div className="text-sm text-slate-400 italic">
        Unassigned
      </div>
    );
  }

  const assignedMembers = members.filter(member => 
    assignedUserIds.includes(member.user_id)
  );

  if (assignedMembers.length === 0) {
    return (
      <div className="text-sm text-slate-400 italic">
        Assigned users not found
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {assignedMembers.map((member) => (
        <TaskAssignee key={member.user_id} member={member} />
      ))}
    </div>
  );
};

export default TaskAssigneeList;
