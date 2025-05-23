
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectTeamProps {
  project: Project;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ project }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white">Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.teamMembers.map((member) => (
            <Card key={member.id} className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar} alt={member.username} />
                    <AvatarFallback className="bg-cyan-600 text-white text-xl">
                      {member.username.substring(1, 3).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium text-white">{member.username}</h3>
                    <p className="text-cyan-400">{member.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="sm" variant="outline" className="h-8 px-3 py-1">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTeam;
