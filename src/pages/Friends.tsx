import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Search, UserPlus, X, Check, MessageSquare, Send, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: string;
  lastActive: string;
}

interface FriendMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  sender_id: string;
}

interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar: string;
  sender_id: string;
}

interface SearchResult {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
}

const Friends = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [messages, setMessages] = useState<FriendMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchFriendRequests();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() && searchQuery.length > 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend.id);
    }
  }, [selectedFriend]);

  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching friends:', error);
        return;
      }

      if (!data || data.length === 0) {
        setFriends([]);
        return;
      }

      // Get friend user IDs
      const friendIds = data.map(friendship => 
        friendship.user1_id === user.id ? friendship.user2_id : friendship.user1_id
      );

      // Fetch friend profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, profile_picture_url')
        .in('id', friendIds);

      if (profilesError) {
        console.error('Error fetching friend profiles:', profilesError);
        return;
      }

      const friendsList = profiles?.map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Unknown User',
        username: profile.username || 'unknown',
        avatar: profile.profile_picture_url || profile.avatar_url || '/placeholder.svg',
        status: 'Online',
        lastActive: 'Now'
      })) || [];

      setFriends(friendsList);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching friend requests:', error);
        return;
      }

      if (!data || data.length === 0) {
        setFriendRequests([]);
        return;
      }

      // Get sender IDs
      const senderIds = data.map(request => request.sender_id);

      // Fetch sender profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, profile_picture_url')
        .in('id', senderIds);

      if (profilesError) {
        console.error('Error fetching sender profiles:', profilesError);
        return;
      }

      const requestsList = data.map(request => {
        const senderProfile = profiles?.find(p => p.id === request.sender_id);
        return {
          id: request.id,
          name: senderProfile?.full_name || 'Unknown User',
          username: senderProfile?.username || 'unknown',
          avatar: senderProfile?.profile_picture_url || senderProfile?.avatar_url || '/placeholder.svg',
          sender_id: request.sender_id
        };
      }) || [];

      setFriendRequests(requestsList);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchMessages = async (friendId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('friend_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      const messagesList = data?.map(msg => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender_id === user.id ? 'me' : 'friend',
        timestamp: new Date(msg.created_at).toLocaleTimeString(),
        sender_id: msg.sender_id
      })) || [];

      setMessages(messagesList);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim() || searchQuery.length < 3) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
        return;
      }

      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: userId,
          status: 'pending'
        });

      if (error) {
        console.error('Error sending friend request:', error);
        toast({
          title: "Error",
          description: "Failed to send friend request.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Friend request sent!",
        description: "Your friend request has been sent.",
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request.",
        variant: "destructive",
      });
    }
  };

  const acceptFriendRequest = async (requestId: string, senderId: string) => {
    if (!user) return;
    
    try {
      // Update request status to accepted
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error updating friend request:', updateError);
        return;
      }

      // Create friendship (ensure consistent ordering)
      const user1Id = user.id < senderId ? user.id : senderId;
      const user2Id = user.id < senderId ? senderId : user.id;

      const { error: friendshipError } = await supabase
        .from('friendships')
        .insert({
          user1_id: user1Id,
          user2_id: user2Id
        });

      if (friendshipError) {
        console.error('Error creating friendship:', friendshipError);
        return;
      }

      toast({
        title: "Friend request accepted!",
        description: "You are now friends.",
      });
      
      await fetchFriends();
      await fetchFriendRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to accept friend request.",
        variant: "destructive",
      });
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'declined', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) {
        console.error('Error declining friend request:', error);
        return;
      }

      toast({
        title: "Friend request declined",
        description: "The friend request has been declined.",
      });
      
      await fetchFriendRequests();
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast({
        title: "Error",
        description: "Failed to decline friend request.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedFriend || !user) return;
    
    try {
      const { error } = await supabase
        .from('friend_messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedFriend.id,
          message: newMessage.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message.",
          variant: "destructive",
        });
        return;
      }

      setNewMessage("");
      await fetchMessages(selectedFriend.id);
      
      toast({
        title: "Message sent!",
        description: "Your message has been sent.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Friends</h1>
          <p className="text-lg text-slate-300">Please log in to access your friends.</p>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search for developers by name or username"
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Search Results</h3>
                {searchResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={result.avatar_url || '/placeholder.svg'} alt={result.full_name || 'User'} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                          {(result.full_name || result.username || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-white">{result.full_name || 'Unknown User'}</h3>
                        <p className="text-sm text-slate-400">@{result.username || 'unknown'}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => sendFriendRequest(result.id)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      size="sm"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Friend
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="text-center text-slate-400 py-4">
                <Search className="w-6 h-6 mx-auto mb-2 animate-spin" />
                <p>Searching...</p>
              </div>
            )}
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
              </TabsList>

              {/* Friends list */}
              <TabsContent value="friends">
                <div className="space-y-3">
                  {friends.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No friends yet</h3>
                      <p className="text-slate-500">Search for users above to add friends!</p>
                    </div>
                  ) : (
                    friends.map((friend) => (
                      <Card 
                        key={friend.id} 
                        className={`bg-slate-800 border-slate-700 hover:shadow-md hover:border-slate-600 transition-all ${selectedFriend?.id === friend.id ? 'border-l-4 border-l-cyan-500' : ''}`}
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
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-800 bg-green-500"></span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{friend.name}</h3>
                              <p className="text-sm text-slate-400">{friend.username}</p>
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-600 hover:bg-slate-700 text-slate-300"
                                  onClick={() => navigate(`/profile/${friend.id}`)}
                                >
                                  <User className="h-3 w-3 mr-1" />
                                  View Profile
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                  onClick={() => setSelectedFriend(friend)}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Message
                                </Button>
                              </div>
                            </div>
                            <div className="text-right text-xs text-slate-500">
                              <p>{friend.lastActive}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Friend Requests */}
              <TabsContent value="requests">
                <div className="space-y-3">
                  {friendRequests.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No friend requests</h3>
                      <p className="text-slate-500">No pending friend requests at the moment.</p>
                    </div>
                  ) : (
                    friendRequests.map((request) => (
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
                              <div className="flex gap-2 mt-3">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => acceptFriendRequest(request.id, request.sender_id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-slate-600 hover:bg-slate-700 text-slate-300"
                                  onClick={() => declineFriendRequest(request.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
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
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-800 bg-green-500"></span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{selectedFriend.name}</h3>
                        <p className="text-xs text-slate-400">{selectedFriend.status} · {selectedFriend.lastActive}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-4 overflow-auto flex flex-col space-y-4 max-h-[calc(75vh-8rem)]">
                  {messages.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center text-slate-400">
                      <div className="text-center">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Start your conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message: FriendMessage) => (
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
                    ))
                  )}
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
