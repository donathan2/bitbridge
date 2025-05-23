
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProjectNotFound: React.FC = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-cyan-400 mb-4">Project Not Found</h1>
      <p className="text-white mb-8">The project you're looking for doesn't exist or you don't have access.</p>
      <Button asChild>
        <Link to="/profile">Return to Profile</Link>
      </Button>
    </div>
  );
};

export default ProjectNotFound;
