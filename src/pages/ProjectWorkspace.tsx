
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, CheckSquare, Users, FileText, MessageSquare } from 'lucide-react';
import { Project } from '@/types/project';

// Import components
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectOverview from '@/components/project/ProjectOverview';
import ProjectTasks from '@/components/project/ProjectTasks';
import ProjectTeam from '@/components/project/ProjectTeam';
import ProjectFiles from '@/components/project/ProjectFiles';
import ProjectDiscussion from '@/components/project/ProjectDiscussion';
import ProjectLoading from '@/components/project/ProjectLoading';
import ProjectNotFound from '@/components/project/ProjectNotFound';

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch project data - this would be replaced with a real API call
  useEffect(() => {
    // Simulating API fetch
    const fetchProject = () => {
      setLoading(true);
      // Mock data - would be replaced with actual API call
      const ongoingProjects = [
        {
          id: "1",
          title: "AI Chat Interface",
          description: "Modern chat UI with AI integration",
          tech: ["React", "TypeScript", "OpenAI"],
          progress: 75,
          startDate: "2024-05-20",
          endDate: "2024-06-30",
          difficulty: "Advanced",
          githubUrl: "https://github.com/alexchen/ai-chat",
          teamMembers: [
            { id: "1", role: "Frontend Developer", username: "@alexchen", avatar: "/placeholder.svg" },
            { id: "2", role: "AI Engineer", username: "@jwilson", avatar: "/placeholder.svg" },
            { id: "3", role: "UX Designer", username: "@echen", avatar: "/placeholder.svg" }
          ],
          messages: [
            { id: "1", username: "@alexchen", avatar: "/placeholder.svg", text: "Just pushed the new chat components", timestamp: "2024-05-22 10:30 AM" },
            { id: "2", username: "@jwilson", avatar: "/placeholder.svg", text: "Great! I'll update the API integration tomorrow", timestamp: "2024-05-22 11:45 AM" },
            { id: "3", username: "@echen", avatar: "/placeholder.svg", text: "I've uploaded the new design mockups to Figma", timestamp: "2024-05-23 09:15 AM" }
          ],
          tasks: [
            { id: "1", title: "Create responsive chat interface", assignee: "@alexchen", status: "completed", dueDate: "2024-05-25" },
            { id: "2", title: "Implement message history", assignee: "@alexchen", status: "in-progress", dueDate: "2024-05-28" },
            { id: "3", title: "Connect OpenAI API", assignee: "@jwilson", status: "in-progress", dueDate: "2024-05-30" },
            { id: "4", title: "Design user onboarding flow", assignee: "@echen", status: "pending", dueDate: "2024-06-05" }
          ],
          files: [
            { id: "1", name: "Design System.fig", type: "figma", uploadedBy: "@echen", uploadDate: "2024-05-20" },
            { id: "2", name: "API Documentation.md", type: "markdown", uploadedBy: "@jwilson", uploadDate: "2024-05-22" },
            { id: "3", name: "Project Roadmap.pdf", type: "pdf", uploadedBy: "@alexchen", uploadDate: "2024-05-23" }
          ]
        },
        {
          id: "2",
          title: "Portfolio Website",
          description: "Personal portfolio with animations",
          tech: ["React", "Framer Motion"],
          progress: 60,
          startDate: "2024-05-18",
          endDate: "2024-06-15",
          difficulty: "Intermediate",
          githubUrl: "https://github.com/alexchen/portfolio",
          teamMembers: [
            { id: "1", role: "Developer", username: "@alexchen", avatar: "/placeholder.svg" },
            { id: "2", role: "Designer", username: "@sarahj", avatar: "/placeholder.svg" }
          ],
          messages: [
            { id: "1", username: "@alexchen", avatar: "/placeholder.svg", text: "Homepage animations are complete", timestamp: "2024-05-21 09:30 AM" },
            { id: "2", username: "@sarahj", avatar: "/placeholder.svg", text: "New color scheme looks great!", timestamp: "2024-05-22 14:20 PM" }
          ],
          tasks: [
            { id: "1", title: "Implement page transitions", assignee: "@alexchen", status: "completed", dueDate: "2024-05-22" },
            { id: "2", title: "Create project showcase component", assignee: "@alexchen", status: "in-progress", dueDate: "2024-05-25" },
            { id: "3", title: "Design contact form", assignee: "@sarahj", status: "completed", dueDate: "2024-05-20" }
          ],
          files: [
            { id: "1", name: "Portfolio Wireframes.fig", type: "figma", uploadedBy: "@sarahj", uploadDate: "2024-05-18" },
            { id: "2", name: "Content Strategy.docx", type: "document", uploadedBy: "@alexchen", uploadDate: "2024-05-19" }
          ]
        },
        {
          id: "3",
          title: "Mobile Game",
          description: "Puzzle game with React Native",
          tech: ["React Native", "Expo"],
          progress: 30,
          startDate: "2024-05-22",
          endDate: "2024-07-15",
          difficulty: "Expert",
          githubUrl: "https://github.com/alexchen/puzzle-game",
          teamMembers: [
            { id: "1", role: "Mobile Developer", username: "@alexchen", avatar: "/placeholder.svg" },
            { id: "2", role: "Game Designer", username: "@mwong", avatar: "/placeholder.svg" },
            { id: "3", role: "Sound Engineer", username: "@dsmith", avatar: "/placeholder.svg" },
            { id: "4", role: "Animator", username: "@akhan", avatar: "/placeholder.svg" }
          ],
          messages: [
            { id: "1", username: "@alexchen", avatar: "/placeholder.svg", text: "Basic game mechanics implemented", timestamp: "2024-05-22 16:30 PM" },
            { id: "2", username: "@mwong", avatar: "/placeholder.svg", text: "Level designs ready for review", timestamp: "2024-05-23 08:40 AM" }
          ],
          tasks: [
            { id: "1", title: "Implement core gameplay loop", assignee: "@alexchen", status: "in-progress", dueDate: "2024-05-29" },
            { id: "2", title: "Design first 10 levels", assignee: "@mwong", status: "completed", dueDate: "2024-05-23" },
            { id: "3", title: "Create background music", assignee: "@dsmith", status: "pending", dueDate: "2024-06-05" },
            { id: "4", title: "Animate character movements", assignee: "@akhan", status: "pending", dueDate: "2024-06-10" }
          ],
          files: [
            { id: "1", name: "Game Design Document.pdf", type: "pdf", uploadedBy: "@mwong", uploadDate: "2024-05-22" },
            { id: "2", name: "Character Assets.zip", type: "archive", uploadedBy: "@akhan", uploadDate: "2024-05-23" }
          ]
        }
      ];

      const foundProject = ongoingProjects.find(p => p.id === projectId);
      
      if (foundProject) {
        setProject(foundProject as Project);
      }
      setLoading(false);
    };
    
    fetchProject();
  }, [projectId]);

  if (loading) {
    return <ProjectLoading />;
  }

  if (!project) {
    return <ProjectNotFound />;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Project Header */}
      <ProjectHeader project={project} />
      
      {/* Workspace Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-800 border-b border-slate-700 w-full justify-start rounded-none p-0 h-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <Layout className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <CheckSquare className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <FileText className="h-4 w-4 mr-2" />
            Files
          </TabsTrigger>
          <TabsTrigger value="discussion" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussion
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <ProjectOverview project={project} />
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-6">
          <ProjectTasks project={project} setProject={setProject} />
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team" className="mt-6">
          <ProjectTeam project={project} />
        </TabsContent>
        
        {/* Files Tab */}
        <TabsContent value="files" className="mt-6">
          <ProjectFiles project={project} />
        </TabsContent>
        
        {/* Discussion Tab */}
        <TabsContent value="discussion" className="mt-6">
          <ProjectDiscussion project={project} setProject={setProject} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectWorkspace;
