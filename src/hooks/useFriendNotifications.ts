
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FriendNotification {
  friendId: string;
  messageCount: number;
  hasUnreadMessages: boolean;
}

export const useFriendNotifications = () => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [friendNotifications, setFriendNotifications] = useState<FriendNotification[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const fetchNotificationCount = async () => {
    if (!user) {
      setNotificationCount(0);
      setFriendNotifications([]);
      setPendingRequestsCount(0);
      return;
    }

    try {
      // Check for pending friend requests
      const { data: requests, error: requestsError } = await supabase
        .from('friend_requests')
        .select('id')
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (requestsError) {
        console.error('Error fetching friend requests:', requestsError);
        return;
      }

      const requestsCount = requests?.length || 0;
      setPendingRequestsCount(requestsCount);

      // Get all friends first
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (friendshipsError) {
        console.error('Error fetching friendships:', friendshipsError);
        return;
      }

      // Get friend IDs
      const friendIds = friendships?.map(friendship => 
        friendship.user1_id === user.id ? friendship.user2_id : friendship.user1_id
      ) || [];

      // Check for unread messages per friend
      const friendNotifs: FriendNotification[] = [];
      let totalUnreadMessages = 0;

      for (const friendId of friendIds) {
        const friendLastCheckedKey = `friend_last_checked_${user.id}_${friendId}`;
        const lastChecked = localStorage.getItem(friendLastCheckedKey);
        
        // If no lastChecked time exists for this friend, set it to 24 hours ago
        const lastCheckedTime = lastChecked ? new Date(lastChecked) : new Date(Date.now() - 24 * 60 * 60 * 1000);

        const { data: messages, error: messagesError } = await supabase
          .from('friend_messages')
          .select('id, created_at, sender_id')
          .eq('receiver_id', user.id)
          .eq('sender_id', friendId)
          .gt('created_at', lastCheckedTime.toISOString());

        if (messagesError) {
          console.error('Error fetching friend messages:', messagesError);
          continue;
        }

        const messageCount = messages?.length || 0;
        if (messageCount > 0) {
          friendNotifs.push({
            friendId,
            messageCount,
            hasUnreadMessages: true
          });
          totalUnreadMessages += messageCount;
        }
      }

      setFriendNotifications(friendNotifs);

      console.log('Found unread messages:', totalUnreadMessages);
      console.log('Found pending requests:', requestsCount);
      console.log('Friend notifications:', friendNotifs);

      const totalNotifications = requestsCount + totalUnreadMessages;
      setNotificationCount(totalNotifications);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      setFriendNotifications([]);
      setPendingRequestsCount(0);
      return;
    }

    // Initial fetch
    fetchNotificationCount();

    // Set up real-time subscriptions for friend requests
    const requestsChannel = supabase
      .channel('friend-requests-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friend_requests',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Friend request change detected:', payload);
          fetchNotificationCount();
        }
      )
      .subscribe();

    // Set up real-time subscriptions for friend messages
    const messagesChannel = supabase
      .channel('friend-messages-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'friend_messages'
        },
        (payload) => {
          console.log('Message change detected:', payload);
          const newMessage = payload.new as any;
          
          // Only refetch if this is a message TO the current user (not from them)
          if (newMessage.receiver_id === user.id) {
            console.log('Received new message, updating notifications');
            fetchNotificationCount();
          } else if (newMessage.sender_id === user.id) {
            // If current user sent a message, don't add to notifications
            console.log('User sent message, no notification update needed');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user]);

  const clearFriendNotifications = (friendId: string) => {
    if (!user) return;
    
    // Store per-friend last checked time
    const friendLastCheckedKey = `friend_last_checked_${user.id}_${friendId}`;
    const currentTime = new Date().toISOString();
    localStorage.setItem(friendLastCheckedKey, currentTime);
    console.log('Cleared notifications for friend:', friendId, 'at:', currentTime);
    
    // Update state immediately for better UX
    setFriendNotifications(prev => {
      const friendNotif = prev.find(notif => notif.friendId === friendId);
      const messageCountToSubtract = friendNotif?.messageCount || 0;
      
      if (messageCountToSubtract > 0) {
        // Update total count immediately
        setNotificationCount(prevCount => {
          const newCount = Math.max(0, prevCount - messageCountToSubtract);
          console.log('Updated notification count:', prevCount, '-', messageCountToSubtract, '=', newCount);
          return newCount;
        });
      }
      
      // Remove this friend from notifications
      return prev.filter(notif => notif.friendId !== friendId);
    });
  };

  const clearRequestNotifications = () => {
    // Update state immediately
    setNotificationCount(prev => Math.max(0, prev - pendingRequestsCount));
    setPendingRequestsCount(0);
    
    // Trigger a refetch to ensure consistency
    setTimeout(() => fetchNotificationCount(), 100);
  };

  const getFriendNotificationCount = (friendId: string): number => {
    const friendNotif = friendNotifications.find(notif => notif.friendId === friendId);
    return friendNotif?.messageCount || 0;
  };

  // Expose refetch function for manual triggers
  const refetchNotifications = () => {
    fetchNotificationCount();
  };

  return {
    notificationCount,
    friendNotifications,
    pendingRequestsCount,
    clearFriendNotifications,
    clearRequestNotifications,
    getFriendNotificationCount,
    refetchNotifications
  };
};
