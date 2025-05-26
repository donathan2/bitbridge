
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
    assigned_user_ids: [] as string[],
    due_date: '',
    status: 'pending'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        assigned_user_ids: task.assigned_user_ids || (task.assigned_user_id ? [task.assigned_user_id] : []),
        due_date: task.due_date || '',
        status: task.status
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assigned_user_ids: [],
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

  const handleUserAssignmentChange = (userId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        assigned_user_ids: [...formData.assigned_user_ids, userId]
      });
    } else {
      setFormData({
        ...formData,
        assigned_user_ids: formData.assigned_user_ids.filter(id => id !== userId)
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
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

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Assign to Users</Label>
            <div className="col-span-3 space-y-2 max-h-40 overflow-y-auto bg-slate-700 p-3 rounded border border-slate-600">
              {members.length === 0 ? (
                <p className="text-slate-400 text-sm">No team members available</p>
              ) : (
                members.map((member) => (
                  <div key={member.user_id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${member.user_id}`}
                      checked={formData.assigned_user_ids.includes(member.user_id)}
                      onCheckedChange={(checked) => 
                        handleUserAssignmentChange(member.user_id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`user-${member.user_id}`} className="text-sm cursor-pointer">
                      {member.user?.full_name || member.user?.username || 'Unknown User'} ({member.role})
                    </Label>
                  </div>
                ))
              )}
            </div>
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
