
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ExternalLink, Trash2 } from 'lucide-react';
import { Project } from '@/types/project';
import { getFileIcon } from '@/utils/projectUtils';

interface ProjectFilesProps {
  project: Project;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ project }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-white">Project Files</CardTitle>
        <Button className="bg-cyan-600 hover:bg-cyan-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">File Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Uploaded By</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.files.map((file) => (
                <tr key={file.id} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="text-white">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 capitalize">{file.type}</td>
                  <td className="py-3 px-4 text-slate-300">{file.uploadedBy}</td>
                  <td className="py-3 px-4 text-slate-300">
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectFiles;
