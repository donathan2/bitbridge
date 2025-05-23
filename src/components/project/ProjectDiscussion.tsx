
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Project } from '@/types/project';

interface ProjectDiscussionProps {
  project: Project;
  setProject: (project: Project) => void;
}

const ProjectDiscussion: React.FC<ProjectDiscussionProps> = ({ project, setProject }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      id: `new-${Date.now()}`,
      username: "@alexchen", // Current user
      avatar: "/placeholder.svg",
      text: newMessage,
      timestamp: new Date().toLocaleString()
    };
    
    setProject({
      ...project,
      messages: [...project.messages, message]
    });
    
    setNewMessage('');
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white">Team Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-96">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {project.messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.avatar} alt={message.username} />
                  <AvatarFallback className="bg-cyan-600 text-white text-xs">
                    {message.username.substring(1, 3).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-cyan-400">{message.username}</p>
                    <p className="text-xs text-slate-400">{message.timestamp}</p>
                  </div>
                  <p className="text-white mt-1">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddMessage} className="flex gap-2 mt-auto">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-slate-700 border-slate-600 text-white resize-none"
              rows={2}
            />
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 self-end">
              Send
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDiscussion;
