
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Github, ExternalLink } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">{project.title}</h1>
          <p className="text-slate-300 mt-1">{project.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-cyan-600 hover:bg-cyan-700">{project.difficulty}</Badge>
          <Link to={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Github size={16} />
              GitHub
              <ExternalLink size={14} />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="text-cyan-400 h-5 w-5" />
            <div>
              <p className="text-xs text-slate-400">Start Date</p>
              <p className="text-sm text-white">{new Date(project.startDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="text-cyan-400 h-5 w-5" />
            <div>
              <p className="text-xs text-slate-400">Target Completion</p>
              <p className="text-sm text-white">{new Date(project.endDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700 col-span-1 md:col-span-2">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-slate-300">Overall Progress</span>
              <span className="text-sm font-medium text-white">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech: string, i: number) => (
          <Badge key={i} variant="outline" className="bg-slate-700 text-cyan-300 border-none">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProjectHeader;
