
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Project } from '@/types/project';
import { getStatusColor } from '@/utils/projectUtils';

interface ProjectOverviewProps {
  project: Project;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Project Stats */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-300">{project.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Project Status</h4>
                  <p className="text-white">In Progress</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Progress</h4>
                  <p className="text-white">{project.progress}% Complete</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Start Date</h4>
                  <p className="text-white">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Target Completion</h4>
                  <p className="text-white">{new Date(project.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Task Overview */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-white">Recent Tasks</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="#tasks" onClick={() => {
                // Use querySelector with type assertion to handle click
                const element = document.querySelector('[data-value="tasks"]') as HTMLElement;
                if (element) {
                  element.click();
                }
              }}>
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(task.status)} w-3 h-3 p-0 rounded-full`} />
                    <span className="text-white">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">{task.assignee}</span>
                    <span className="text-xs text-slate-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Team Members */}
      <div>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-md">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.username} />
                    <AvatarFallback>
                      {member.username.substring(1, 3).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white">{member.username}</p>
                    <p className="text-xs text-slate-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectOverview;
