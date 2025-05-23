
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Search, Send, Users, Github, ExternalLink } from 'lucide-react';

const Chat = () => {
  const [activeConversation, setActiveConversation] = useState<'project' | 'personal' | null>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageInput, setMessageInput] = useState('');

  // Mock projects with chat data
  const projectChats = [
    {
      id: 1,
      title: "AI Chat Interface",
      type: "project",
      lastMessage: "Just pushed the new chat components",
      timestamp: "10:30 AM",
      unread: 2,
      members: [
        { username: "@alexchen", avatar: "/placeholder.svg", online: true },
        { username: "@jwilson", avatar: "/placeholder.svg", online: false },
        { username: "@echen", avatar: "/placeholder.svg", online: true }
      ],
      messages: [
        { username: "@alexchen", avatar: "/placeholder.svg", text: "Just pushed the new chat components", timestamp: "2024-05-22 10:30 AM" },
        { username: "@jwilson", avatar: "/placeholder.svg", text: "Great! I'll update the API integration tomorrow", timestamp: "2024-05-22 11:45 AM" },
        { username: "@echen", avatar: "/placeholder.svg", text: "I've uploaded the new design mockups to Figma", timestamp: "2024-05-23 09:15 AM" }
      ],
      githubUrl: "https://github.com/alexchen/ai-chat"
    },
    {
      id: 2,
      title: "Portfolio Website",
      type: "project",
      lastMessage: "New color scheme looks great!",
      timestamp: "Yesterday",
      unread: 0,
      members: [
        { username: "@alexchen", avatar: "/placeholder.svg", online: true },
        { username: "@sarahj", avatar: "/placeholder.svg", online: true }
      ],
      messages: [
        { username: "@alexchen", avatar: "/placeholder.svg", text: "Homepage animations are complete", timestamp: "2024-05-21 09:30 AM" },
        { username: "@sarahj", avatar: "/placeholder.svg", text: "New color scheme looks great!", timestamp: "2024-05-22 14:20 PM" }
      ],
      githubUrl: "https://github.com/alexchen/portfolio"
    },
    {
      id: 3,
      title: "Mobile Game",
      type: "project",
      lastMessage: "Level designs ready for review",
      timestamp: "08:40 AM",
      unread: 5,
      members: [
        { username: "@alexchen", avatar: "/placeholder.svg", online: true },
        { username: "@mwong", avatar: "/placeholder.svg", online: false },
        { username: "@dsmith", avatar: "/placeholder.svg", online: false },
        { username: "@akhan", avatar: "/placeholder.svg", online: true }
      ],
      messages: [
        { username: "@alexchen", avatar: "/placeholder.svg", text: "Basic game mechanics implemented", timestamp: "2024-05-22 16:30 PM" },
        { username: "@mwong", avatar: "/placeholder.svg", text: "Level designs ready for review", timestamp: "2024-05-23 08:40 AM" }
      ],
      githubUrl: "https://github.com/alexchen/puzzle-game"
    }
  ];

  // Mock personal chats
  const personalChats = [
    {
      id: 1,
      username: "@sarahj",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      lastMessage: "Hey, did you check out that new React library?",
      timestamp: "10:25 AM",
      unread: 1,
      online: true,
      messages: [
        { username: "@alexchen", avatar: "/placeholder.svg", text: "Hey Sarah! How's the project going?", timestamp: "2024-05-22 10:15 AM" },
        { username: "@sarahj", avatar: "/placeholder.svg", text: "Pretty good! Just working on the UI designs", timestamp: "2024-05-22 10:20 AM" },
        { username: "@sarahj", avatar: "/placeholder.svg", text: "Hey, did you check out that new React library?", timestamp: "2024-05-23 10:25 AM" }
      ]
    },
    {
      id: 2,
      username: "@mwong",
      name: "Michael Wong",
      avatar: "/placeholder.svg",
      lastMessage: "I'm starting a new project, want to join?",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
      messages: [
        { username: "@mwong", avatar: "/placeholder.svg", text: "Hey, long time no chat!", timestamp: "2024-05-21 15:30 PM" },
        { username: "@alexchen", avatar: "/placeholder.svg", text: "Yeah, been busy with work. How are things?", timestamp: "2024-05-21 16:45 PM" },
        { username: "@mwong", avatar: "/placeholder.svg", text: "I'm starting a new project, want to join?", timestamp: "2024-05-22 09:20 AM" }
      ]
    },
    {
      id: 3,
      username: "@priyap",
      name: "Priya Patel",
      avatar: "/placeholder.svg",
      lastMessage: "The backend API is ready for testing",
      timestamp: "Monday",
      unread: 0,
      online: true,
      messages: [
        { username: "@priyap", avatar: "/placeholder.svg", text: "How's the frontend coming along?", timestamp: "2024-05-20 11:15 AM" },
        { username: "@alexchen", avatar: "/placeholder.svg", text: "Almost done with the dashboard components", timestamp: "2024-05-20 12:30 PM" },
        { username: "@priyap", avatar: "/placeholder.svg", text: "The backend API is ready for testing", timestamp: "2024-05-20 14:45 PM" }
      ]
    }
  ];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    // In a real app, this would send the message to an API
    console.log("Sending message:", messageInput);
    
    // Clear input after sending
    setMessageInput('');
  };

  const selectChat = (chat: any, type: 'project' | 'personal') => {
    setSelectedChat(chat);
    setActiveConversation(type);
  };

  // Function to find a project chat by ID (used for navigation from Profile page)
  const navigateToProjectChat = (projectId: number) => {
    const project = projectChats.find(p => p.id === projectId);
    if (project) {
      selectChat(project, 'project');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Conversations</h1>
          <p className="text-lg text-slate-300 font-light">Chat with your team and friends</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Chats</CardTitle>
                </div>
              </CardHeader>
              
              <div className="p-3">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search conversations" 
                    className="pl-10 bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>
              </div>

              <Tabs defaultValue="projects" className="flex-1 flex flex-col">
                <TabsList className="bg-slate-700 border border-slate-600 mx-3">
                  <TabsTrigger value="projects" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400 flex-1">
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="direct" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400 flex-1">
                    Direct
                  </TabsTrigger>
                </TabsList>

                {/* Project Chats */}
                <TabsContent value="projects" className="flex-1 overflow-auto px-3 py-2">
                  {projectChats.map(chat => (
                    <div 
                      key={chat.id}
                      onClick={() => selectChat(chat, 'project')}
                      className={`p-3 rounded-md mb-1 cursor-pointer flex items-center ${
                        selectedChat?.id === chat.id && activeConversation === 'project'
                          ? 'bg-slate-700' 
                          : 'hover:bg-slate-700'
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                            {chat.title.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-white text-sm truncate">{chat.title}</h3>
                          <span className="text-xs text-slate-400">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-300 truncate">{chat.lastMessage}</p>
                        <div className="flex mt-1">
                          <div className="flex -space-x-2">
                            {chat.members.slice(0, 3).map((member, i) => (
                              <Avatar key={i} className="h-5 w-5 border border-slate-800">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="bg-cyan-600 text-xs">
                                  {member.username.substring(1, 3).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {chat.members.length > 3 && (
                              <div className="h-5 w-5 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs border border-slate-800">
                                +{chat.members.length - 3}
                              </div>
                            )}
                          </div>
                          {chat.unread > 0 && (
                            <Badge className="ml-auto bg-cyan-500 text-white">{chat.unread}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* Direct Messages */}
                <TabsContent value="direct" className="flex-1 overflow-auto px-3 py-2">
                  {personalChats.map(chat => (
                    <div 
                      key={chat.id}
                      onClick={() => selectChat(chat, 'personal')}
                      className={`p-3 rounded-md mb-1 cursor-pointer flex items-center ${
                        selectedChat?.id === chat.id && activeConversation === 'personal'
                          ? 'bg-slate-700' 
                          : 'hover:bg-slate-700'
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback className="bg-cyan-600 text-white">
                            {chat.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-slate-800 ${
                          chat.online ? 'bg-green-500' : 'bg-slate-500'
                        }`}></span>
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-white text-sm">{chat.username}</h3>
                          <span className="text-xs text-slate-400">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-300 truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <div className="mt-1 flex justify-end">
                            <Badge className="bg-cyan-500 text-white">{chat.unread}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800 border-slate-700 h-[calc(100vh-200px)] flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {activeConversation === 'project' ? (
                          <CardTitle className="text-lg flex items-center">
                            {selectedChat.title}
                            <Badge className="ml-3 bg-slate-700 text-white">Project</Badge>
                          </CardTitle>
                        ) : (
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={selectedChat.avatar} />
                              <AvatarFallback className="bg-cyan-600 text-white">
                                {selectedChat.name?.split(' ').map((n: string) => n[0]).join('') || selectedChat.username.substring(1, 3).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-lg">{selectedChat.username}</CardTitle>
                            <span className={`ml-3 h-2.5 w-2.5 rounded-full ${selectedChat.online ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                          </div>
                        )}
                      </div>

                      {activeConversation === 'project' && (
                        <div className="flex items-center">
                          <Button variant="ghost" className="text-white hover:bg-blue-700" asChild>
                            <a href={selectedChat.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-5 w-5 mr-1" />
                              <span className="hidden md:inline">GitHub</span>
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                          <Button variant="ghost" className="text-white hover:bg-blue-700">
                            <Users className="h-5 w-5 mr-1" />
                            <span className="hidden md:inline">Members ({selectedChat.members.length})</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-auto p-6 space-y-4">
                    {selectedChat.messages.map((message: any, index: number) => (
                      <div key={index} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback className="bg-cyan-600 text-white text-xs">
                            {message.username.substring(1, 3).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-300 text-sm">{message.username}</span>
                            <span className="text-slate-400 text-xs">{message.timestamp}</span>
                          </div>
                          <p className="text-slate-200 text-sm mt-1">{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-slate-700 flex gap-3">
                    <Textarea 
                      placeholder={`Message ${activeConversation === 'project' ? selectedChat.title : selectedChat.username}...`}
                      className="bg-slate-700 border-slate-600 resize-none flex-1"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="bg-cyan-600 hover:bg-cyan-700 text-white self-end"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MessageSquare className="h-16 w-16 mb-4 text-slate-600" />
                  <h3 className="text-xl font-medium text-slate-300 mb-2">No conversation selected</h3>
                  <p className="text-center max-w-md">
                    Select a project chat or direct message from the sidebar to start chatting
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
