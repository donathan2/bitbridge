
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Search, UserPlus, X, Check, MessageSquare, Send } from 'lucide-react';

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('friends');
  
  // Mock friends data
  const [friends, setFriends] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      username: "@sarahj",
      avatar: "/placeholder.svg",
      status: "Online",
      lastActive: "Now",
      messages: [
        { id: 1, text: "Hey, how's your project going?", sender: "@sarahj", timestamp: "10:30 AM" },
        { id: 2, text: "Pretty good! Almost done with the frontend.", sender: "me", timestamp: "10:32 AM" },
        { id: 3, text: "That's awesome! Can't wait to see it.", sender: "@sarahj", timestamp: "10:35 AM" }
      ]
    },
    {
      id: 2,
      name: "Michael Wong",
      username: "@mwong",
      avatar: "/placeholder.svg",
      status: "Offline",
      lastActive: "3h ago",
      messages: [
        { id: 1, text: "Did you check out that new React library?", sender: "@mwong", timestamp: "Yesterday" },
        { id: 2, text: "Not yet, what's it called?", sender: "me", timestamp: "Yesterday" },
        { id: 3, text: "It's called XState. Really good for complex state management.", sender: "@mwong", timestamp: "Yesterday" }
      ]
    },
    {
      id: 3,
      name: "Priya Patel",
      username: "@priyap",
      avatar: "/placeholder.svg",
      status: "Online",
      lastActive: "Now",
      messages: [
        { id: 1, text: "Thanks for helping with the code review!", sender: "me", timestamp: "2d ago" },
        { id: 2, text: "No problem! It was a clean implementation.", sender: "@priyap", timestamp: "2d ago" }
      ]
    }
  ]);

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

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedFriend) return;
    
    const updatedFriends = friends.map(friend => {
      if (friend.id === selectedFriend.id) {
        return {
          ...friend,
          messages: [
            ...friend.messages,
            {
              id: friend.messages.length + 1,
              text: newMessage,
              sender: "me",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return friend;
    });
    
    setFriends(updatedFriends);
    setNewMessage("");
    
    // Update the selected friend with new messages
    const updatedSelectedFriend = updatedFriends.find(friend => friend.id === selectedFriend.id);
    if (updatedSelectedFriend) {
      setSelectedFriend(updatedSelectedFriend);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Friends list and tabs */}
          <div className="lg:col-span-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              </TabsList>

              {/* Friends list */}
              <TabsContent value="friends">
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <Card 
                      key={friend.id} 
                      className={`bg-slate-800 border-slate-700 hover:shadow-md hover:border-slate-600 transition-all cursor-pointer ${selectedFriend?.id === friend.id ? 'border-l-4 border-l-cyan-500' : ''}`}
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-slate-700">
                              <AvatarImage src={friend.avatar} alt={friend.name} />
                              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                                {friend.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-800 ${friend.status === "Online" ? "bg-green-500" : "bg-slate-500"}`}></span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{friend.name}</h3>
                            <p className="text-sm text-slate-400">{friend.username}</p>
                            {friend.messages.length > 0 && (
                              <p className="text-xs text-slate-500 truncate mt-1">
                                {friend.messages[friend.messages.length - 1].sender === "me" ? "You: " : ""}
                                {friend.messages[friend.messages.length - 1].text}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-xs text-slate-500">
                            <p>{friend.lastActive}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Friend Requests */}
              <TabsContent value="requests">
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <Card key={request.id} className="bg-slate-800 border-slate-700 hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-slate-700">
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
                <div className="space-y-3">
                  {suggestedFriends.map((suggestion) => (
                    <Card key={suggestion.id} className="bg-slate-800 border-slate-700 hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-slate-700">
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
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat area */}
          <div className="lg:col-span-2">
            {selectedFriend ? (
              <Card className="bg-slate-800 border-slate-700 shadow-lg h-full flex flex-col">
                <CardHeader className="bg-slate-750 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedFriend.avatar} alt={selectedFriend.name} />
                          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                            {selectedFriend.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-800 ${selectedFriend.status === "Online" ? "bg-green-500" : "bg-slate-500"}`}></span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{selectedFriend.name}</h3>
                        <p className="text-xs text-slate-400">{selectedFriend.status} · {selectedFriend.lastActive}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-4 overflow-auto flex flex-col space-y-4 max-h-[calc(75vh-8rem)]">
                  {selectedFriend.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender !== "me" && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={selectedFriend.avatar} alt={selectedFriend.name} />
                          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs">
                            {selectedFriend.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`rounded-lg py-2 px-3 max-w-xs break-words ${
                            message.sender === "me"
                              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                              : "bg-slate-700 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <div className="p-4 border-t border-slate-700">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-grow bg-slate-700 border-slate-600 text-white resize-none"
                      rows={1}
                    />
                    <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white self-end">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-slate-700 shadow-lg h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Your messages</h3>
                  <p className="text-slate-400">Select a friend to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
