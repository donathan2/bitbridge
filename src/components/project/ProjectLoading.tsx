
import React from 'react';

const ProjectLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-cyan-400 text-lg">Loading project workspace...</p>
      </div>
    </div>
  );
};

export default ProjectLoading;
