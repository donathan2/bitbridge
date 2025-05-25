
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ProjectTask } from '@/hooks/useProjectTasks';
import { ProjectMember } from '@/hooks/useProjectMembers';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: any) => Promise<boolean>;
  task?: ProjectTask | null;
  members: ProjectMember[];
  availableRoles: string[];
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  members,
  availableRoles
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_role: '',
    assigned_user_id: '',
    due_date: '',
    status: 'pending'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        assigned_role: task.assigned_role || '',
        assigned_user_id: task.assigned_user_id || '',
        due_date: task.due_date || '',
        status: task.status
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assigned_role: '',
        assigned_user_id: '',
        due_date: '',
        status: 'pending'
      });
    }
  }, [task, isOpen]);

  const handleSave = async () => {
    if (!formData.title.trim()) return;

    setSaving(true);
    const success = await onSave(formData);
    setSaving(false);

    if (success) {
      onClose();
    }
  };

  const filteredMembers = formData.assigned_role 
    ? members.filter(member => member.role === formData.assigned_role)
    : members;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="col-span-3 bg-slate-700 border-slate-600"
              placeholder="Enter task title"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="col-span-3 bg-slate-700 border-slate-600"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assigned_role" className="text-right">Assign to Role</Label>
            <Select 
              value={formData.assigned_role}
              onValueChange={(value) => setFormData({ ...formData, assigned_role: value, assigned_user_id: '' })}
            >
              <SelectTrigger className="col-span-3 bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="">Any Role</SelectItem>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assigned_user" className="text-right">Assign to User</Label>
            <Select 
              value={formData.assigned_user_id}
              onValueChange={(value) => setFormData({ ...formData, assigned_user_id: value })}
            >
              <SelectTrigger className="col-span-3 bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select a user (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="">No specific user</SelectItem>
                {filteredMembers.map((member) => (
                  <SelectItem key={member.user_id} value={member.user_id}>
                    {member.user?.username || member.user?.full_name || 'Unknown User'} ({member.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due_date" className="text-right">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="col-span-3 bg-slate-700 border-slate-600"
            />
          </div>

          {task && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || !formData.title.trim()}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {saving ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
