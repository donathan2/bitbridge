
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, X, MessageSquare, Check } from 'lucide-react';

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock friends data
  const friends = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "@sarahj",
      avatar: "/placeholder.svg",
      status: "Online",
      lastActive: "Now"
    },
    {
      id: 2,
      name: "Michael Wong",
      username: "@mwong",
      avatar: "/placeholder.svg",
      status: "Offline",
      lastActive: "3h ago"
    },
    {
      id: 3,
      name: "Priya Patel",
      username: "@priyap",
      avatar: "/placeholder.svg",
      status: "Online",
      lastActive: "Now"
    }
  ];

  // Mock friend requests
  const friendRequests = [
    {
      id: 1,
      name: "David Smith",
      username: "@dsmith",
      avatar: "/placeholder.svg",
      mutualFriends: 3
    },
    {
      id: 2,
      name: "Emma Chen",
      username: "@echen",
      avatar: "/placeholder.svg",
      mutualFriends: 1
    }
  ];

  // Mock suggested friends
  const suggestedFriends = [
    {
      id: 1,
      name: "James Wilson",
      username: "@jwilson",
      avatar: "/placeholder.svg",
      mutualFriends: 5
    },
    {
      id: 2,
      name: "Aisha Khan",
      username: "@akhan",
      avatar: "/placeholder.svg",
      mutualFriends: 2
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      username: "@crodriguez",
      avatar: "/placeholder.svg",
      mutualFriends: 4
    }
  ];

  // Mock recent messages
  const recentMessages = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "@sarahj",
      avatar: "/placeholder.svg",
      lastMessage: "Hey, did you check out that new React library?",
      time: "10:25 AM"
    },
    {
      id: 2,
      name: "Michael Wong",
      username: "@mwong",
      avatar: "/placeholder.svg", 
      lastMessage: "I'm starting a new project, want to join?",
      time: "Yesterday"
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Friends</h1>
          <p className="text-lg text-slate-300 font-light">Connect and collaborate with your network</p>
        </div>

        {/* Search and add friends section */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              Find Friends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search for developers by name or username"
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Friends tabs */}
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="bg-slate-700 border border-slate-600 w-full mb-6">
            <TabsTrigger value="friends" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              Friends
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              Requests
              {friendRequests.length > 0 && (
                <Badge className="ml-2 bg-cyan-500 text-white">{friendRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Friends list */}
          <TabsContent value="friends">
            <div className="grid md:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <Card key={friend.id} className="bg-slate-800 border-slate-700 hover:shadow-md hover:border-slate-600 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-slate-700">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-white">{friend.name}</h3>
                          <Badge className={friend.status === "Online" ? "bg-green-600" : "bg-slate-600"}>
                            {friend.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">{friend.username}</p>
                        <p className="text-xs text-slate-500 mt-1">Active: {friend.lastActive}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-700">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Friend Requests */}
          <TabsContent value="requests">
            <div className="grid md:grid-cols-2 gap-4">
              {friendRequests.map((request) => (
                <Card key={request.id} className="bg-slate-800 border-slate-700 hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-slate-700">
                        <AvatarImage src={request.avatar} alt={request.name} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                          {request.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white">{request.name}</h3>
                        <p className="text-sm text-slate-400">{request.username}</p>
                        <p className="text-xs text-slate-500 mt-1">{request.mutualFriends} mutual connections</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-700 text-slate-300">
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Friend Suggestions */}
          <TabsContent value="suggestions">
            <div className="grid md:grid-cols-2 gap-4">
              {suggestedFriends.map((suggestion) => (
                <Card key={suggestion.id} className="bg-slate-800 border-slate-700 hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-slate-700">
                        <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                          {suggestion.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white">{suggestion.name}</h3>
                        <p className="text-sm text-slate-400">{suggestion.username}</p>
                        <p className="text-xs text-slate-500 mt-1">{suggestion.mutualFriends} mutual connections</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Connect
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-700 text-slate-300">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages">
            <div className="grid md:grid-cols-1 gap-4">
              {recentMessages.map((message) => (
                <Card key={message.id} className="bg-slate-800 border-slate-700 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-slate-700">
                        <AvatarImage src={message.avatar} alt={message.name} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                          {message.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-white">{message.name}</h3>
                          <span className="text-xs text-slate-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-slate-400">{message.username}</p>
                        <p className="text-sm text-slate-300 mt-1 line-clamp-1">{message.lastMessage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Friends;
