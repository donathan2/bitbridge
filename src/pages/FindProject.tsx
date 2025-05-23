
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Star, 
  Code, 
  Calendar, 
  Users, 
  Clock,
  CheckCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FindProject = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>("any");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("any");
  const [skillFilter, setSkillFilter] = useState<string>("any");
  
  // Mock project data
  const projects = [
    {
      id: 1,
      title: "E-commerce Mobile App",
      description: "Building a React Native e-commerce app with product listings, cart functionality, and payment processing",
      difficulty: "Advanced",
      xpReward: 1200,
      skills: ["React Native", "JavaScript", "Redux", "API Integration"],
      rolesNeeded: ["Frontend Developer", "UI/UX Designer", "Tester"],
      postedDate: "2024-05-18",
      estimatedCompletion: "4 weeks",
      ownerName: "Sarah Johnson",
      progress: 25
    },
    {
      id: 2,
      title: "Task Management API",
      description: "Backend API for a task management application with user authentication and task CRUD operations",
      difficulty: "Intermediate",
      xpReward: 850,
      skills: ["Node.js", "Express", "MongoDB", "Authentication"],
      rolesNeeded: ["Backend Developer", "Database Designer", "API Tester"],
      postedDate: "2024-05-15",
      estimatedCompletion: "3 weeks",
      ownerName: "Michael Chang",
      progress: 40
    },
    {
      id: 3,
      title: "Video Streaming Platform",
      description: "Building a video streaming platform with user accounts, content recommendations, and playback controls",
      difficulty: "Expert",
      xpReward: 1500,
      skills: ["React", "Node.js", "WebRTC", "AWS", "Redis"],
      rolesNeeded: ["Full-stack Developer", "DevOps Engineer", "QA Engineer"],
      postedDate: "2024-05-20",
      estimatedCompletion: "8 weeks",
      ownerName: "Emily Wilson",
      progress: 10
    },
    {
      id: 4,
      title: "Personal Finance Tracker",
      description: "Web application to track personal expenses, income, and generate financial reports",
      difficulty: "Beginner",
      xpReward: 600,
      skills: ["HTML", "CSS", "JavaScript", "Chart.js"],
      rolesNeeded: ["Frontend Developer", "UI Designer", "Tester"],
      postedDate: "2024-05-22",
      estimatedCompletion: "2 weeks",
      ownerName: "David Lee",
      progress: 15
    },
    {
      id: 5,
      title: "Weather Forecast Dashboard",
      description: "Dashboard displaying weather forecasts with interactive maps and data visualization",
      difficulty: "Intermediate",
      xpReward: 750,
      skills: ["React", "TypeScript", "API Integration", "D3.js"],
      rolesNeeded: ["Frontend Developer", "API Specialist", "UI Designer"],
      postedDate: "2024-05-19",
      estimatedCompletion: "3 weeks",
      ownerName: "Julia Parker",
      progress: 30
    }
  ];

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-teal-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Advanced': return 'bg-indigo-600';
      case 'Expert': return 'bg-violet-700';
      default: return 'bg-teal-500';
    }
  };
  
  // Filter projects based on search query and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "any" || 
      project.rolesNeeded.some(role => role.toLowerCase().includes(roleFilter.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === "any" || 
      project.difficulty === difficultyFilter;
    
    const matchesSkill = skillFilter === "any" || 
      project.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    
    return matchesSearch && matchesRole && matchesDifficulty && matchesSkill;
  });

  const allSkills = Array.from(
    new Set(projects.flatMap(project => project.skills))
  ).sort();

  const allRoles = Array.from(
    new Set(projects.flatMap(project => project.rolesNeeded))
  ).sort();

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-cyan-400 mb-3 font-sans">Find a Project</h1>
          <p className="text-lg text-slate-300 font-light">
            Join exciting projects, gain experience, and earn XP
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search projects or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400"
                />
              </div>
              
              {/* Filter Section */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-slate-300">Role</label>
                  <Select onValueChange={setRoleFilter} value={roleFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue placeholder="Any Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectItem value="any">Any Role</SelectItem>
                      {allRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-slate-300">Difficulty</label>
                  <Select onValueChange={setDifficultyFilter} value={difficultyFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue placeholder="Any Difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectItem value="any">Any Difficulty</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-slate-300">Skill</label>
                  <Select onValueChange={setSkillFilter} value={skillFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue placeholder="Any Skill" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectItem value="any">Any Skill</SelectItem>
                      {allSkills.map(skill => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Found
            </h2>
            <div className="flex items-center text-slate-300 text-sm">
              <Filter className="mr-2 h-4 w-4" />
              Sorted by newest
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid gap-6">
              {filteredProjects.map(project => (
                <Card key={project.id} className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                            <div className="flex items-center text-sm text-slate-400">
                              <Calendar className="mr-1 h-4 w-4" />
                              Posted {new Date(project.postedDate).toLocaleDateString()} by {project.ownerName}
                            </div>
                          </div>
                          <Badge className={`${getDifficultyColor(project.difficulty)} text-white shadow-glow`}>
                            {project.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-300">{project.description}</p>
                        
                        {/* Skills */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-slate-300">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.skills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs text-slate-300 border-slate-600">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Roles Needed */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-slate-300">Roles Needed</h4>
                            <ul className="space-y-1">
                              {project.rolesNeeded.map((role, idx) => (
                                <li key={idx} className="flex items-center text-sm text-slate-300">
                                  <CheckCircle className="mr-1 h-4 w-4 text-cyan-400" />
                                  {role}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Project Details */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-300">Progress</span>
                              <span className="text-sm text-slate-300">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2 bg-slate-700" />
                            
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center text-slate-300">
                                <Clock className="mr-1 h-4 w-4" />
                                {project.estimatedCompletion}
                              </div>
                              <div className="flex items-center font-medium text-cyan-400">
                                <Star className="mr-1 h-4 w-4" />
                                +{project.xpReward} XP
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button (Desktop) */}
                      <div className="hidden md:flex items-center md:self-center">
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/20 transition-all px-8 whitespace-nowrap">
                          Join Project
                        </Button>
                      </div>
                    </div>
                    
                    {/* Action Button (Mobile) */}
                    <div className="md:hidden mt-4">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/20 transition-all">
                        Join Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800 border-slate-700 p-8 text-center">
              <p className="text-slate-300">No projects match your search criteria.</p>
              <p className="text-slate-400 mt-2">Try adjusting your filters or search term.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindProject;
