
export interface TeamMember {
  id: string;
  role: string;
  username: string;
  avatar: string;
}

export interface Message {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  progress: number;
  startDate: string;
  endDate: string;
  difficulty: string;
  githubUrl: string;
  teamMembers: TeamMember[];
  messages: Message[];
  tasks: Task[];
  files: ProjectFile[];
}
