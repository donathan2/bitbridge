
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, UserPlus, MessageCircle, Search, Check, X, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAvatar } from '@/hooks/useAvatar';
import { toast } from '@/components/ui/use-toast';

interface Friend {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

const Friends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          user1_id,
          user2_id,
          profiles_user1:user1_id(id, full_name, username, avatar_url),
          profiles_user2:user2_id(id, full_name, username, avatar_url)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching friends:', error);
        return;
      }

      const friendList: Friend[] = [];
      data?.forEach(friendship => {
        if (friendship.user1_id === user.id && friendship.profiles_user2) {
          friendList.push({
            id: friendship.profiles_user2.id,
            full_name: friendship.profiles_user2.full_name,
            username: friendship.profiles_user2.username,
            avatar_url: friendship.profiles_user2.avatar_url,
          });
        } else if (friendship.user2_id === user.id && friendship.profiles_user1) {
          friendList.push({
            id: friendship.profiles_user1.id,
            full_name: friendship.profiles_user1.full_name,
            username: friendship.profiles_user1.username,
            avatar_url: friendship.profiles_user1.avatar_url,
          });
        }
      });
      setFriends(friendList);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          profiles!friend_requests_sender_id_fkey(id, full_name, username, avatar_url)
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching friend requests:', error);
        return;
      }

      const friendRequestList: FriendRequest[] = data?.map(req => ({
        id: req.id,
        sender_id: req.sender_id,
        receiver_id: req.receiver_id,
        status: req.status as 'pending' | 'accepted' | 'rejected',
        created_at: req.created_at,
        sender: {
          id: req.profiles?.id || '',
          full_name: req.profiles?.full_name || null,
          username: req.profiles?.username || null,
          avatar_url: req.profiles?.avatar_url || null,
        }
      })) || [];
      setFriendRequests(friendRequestList);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${searchQuery}%`)
        .not('id', 'eq', user?.id);

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

  const handleAddFriend = async (friendId: string) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to send friend requests.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('friend_requests')
        .insert([{ sender_id: user.id, receiver_id: friendId }]);

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
        title: "Success",
        description: "Friend request sent!",
      });
      setSearchResults([]);
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFriendRequest = async (requestId: string, action: 'accepted' | 'rejected') => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('friend_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating friend request:', error);
        toast({
          title: "Error",
          description: "Failed to update friend request.",
          variant: "destructive",
        });
        return;
      }

      fetchFriendRequests();
      fetchFriends();
    } catch (error) {
      console.error('Error updating friend request:', error);
      toast({
        title: "Error",
        description: "Failed to update friend request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const FriendCard = ({ friend }: { friend: Friend }) => {
    const { avatarUrl, name } = useAvatar(friend.id);

    return (
      <Card className="bg-slate-800 border-slate-700 hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-cyan-600 text-white">
                {(friend.full_name || friend.username || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-white">{friend.full_name || friend.username || 'Unknown User'}</h3>
              {friend.username && friend.full_name && (
                <p className="text-slate-400 text-sm">@{friend.username}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const FriendRequestCard = ({ request }: { request: FriendRequest }) => {
    const { avatarUrl, name } = useAvatar(request.sender_id);

    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-cyan-600 text-white">
                {(request.sender.full_name || request.sender.username || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium text-white text-sm">
                {request.sender.full_name || request.sender.username || 'Unknown User'}
              </h4>
              {request.sender.username && request.sender.full_name && (
                <p className="text-slate-400 text-xs">@{request.sender.username}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleFriendRequest(request.id, 'accepted')}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
                disabled={loading}
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => handleFriendRequest(request.id, 'rejected')}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white h-8 px-3"
                disabled={loading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-cyan-400">Find Friends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-200"
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((result) => (
                  <Card key={result.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={result.avatar_url || ''} />
                          <AvatarFallback className="bg-cyan-600 text-white">
                            {(result.full_name || result.username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-white text-sm">{result.full_name || result.username || 'Unknown User'}</h4>
                          {result.username && result.full_name && (
                            <p className="text-slate-400 text-xs">@{result.username}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAddFriend(result.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loading}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Friend
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-yellow-400">Friend Requests</CardTitle>
            <Badge variant="secondary">
              <Clock className="h-4 w-4 mr-1" />
              {friendRequests.length}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {friendRequests.length === 0 ? (
              <p className="text-slate-400">No pending friend requests.</p>
            ) : (
              friendRequests.map((request) => (
                <FriendRequestCard key={request.id} request={request} />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-green-400">Friends</CardTitle>
            <Badge variant="secondary">
              <Users className="h-4 w-4 mr-1" />
              {friends.length}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {friends.length === 0 ? (
              <p className="text-slate-400">No friends yet.</p>
            ) : (
              friends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Friends;
