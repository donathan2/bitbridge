
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Project, Task } from '@/types/project';
import { getStatusColor } from '@/utils/projectUtils';

interface ProjectTasksProps {
  project: Project;
  setProject: (project: Project) => void;
}

const ProjectTasks: React.FC<ProjectTasksProps> = ({ project, setProject }) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = {
      id: `new-${Date.now()}`,
      title: newTask,
      assignee: "@alexchen", // Default assignee
      status: "pending" as const,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Due in 7 days
    };
    
    setProject({
      ...project,
      tasks: [...project.tasks, task]
    });
    
    setNewTask('');
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-white">Project Tasks</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Filter:</span>
          <select className="bg-slate-700 text-white rounded px-2 py-1 text-sm border border-slate-600">
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow bg-slate-700 border-slate-600 text-white"
          />
          <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </form>
        
        {/* Tasks List */}
        <div className="space-y-3">
          {project.tasks.map((task: Task) => (
            <div 
              key={task.id} 
              className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Badge className={`${getStatusColor(task.status)} w-3 h-3 p-0 rounded-full`} />
                <div>
                  <p className="text-white">{task.title}</p>
                  <p className="text-xs text-slate-400">Assigned to: {task.assignee}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-300">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <select 
                  className="bg-slate-600 text-white text-sm rounded px-2 py-1 border border-slate-500"
                  value={task.status}
                  onChange={(e) => {
                    const updatedTasks = project.tasks.map((t) => 
                      t.id === task.id ? {...t, status: e.target.value as Task['status']} : t
                    );
                    setProject({...project, tasks: updatedTasks});
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-400 hover:text-red-400"
                  onClick={() => {
                    const updatedTasks = project.tasks.filter((t) => t.id !== task.id);
                    setProject({...project, tasks: updatedTasks});
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTasks;
