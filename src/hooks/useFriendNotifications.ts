
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

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      setFriendNotifications([]);
      setPendingRequestsCount(0);
      return;
    }

    const fetchNotificationCount = async () => {
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

        // Check for unread messages per friend
        const lastCheckedKey = `friends_last_checked_${user.id}`;
        const lastChecked = localStorage.getItem(lastCheckedKey);
        
        // If no lastChecked time exists, set it to 24 hours ago to catch recent messages
        const lastCheckedTime = lastChecked ? new Date(lastChecked) : new Date(Date.now() - 24 * 60 * 60 * 1000);

        console.log('Checking for messages after:', lastCheckedTime.toISOString());

        const { data: messages, error: messagesError } = await supabase
          .from('friend_messages')
          .select('id, created_at, sender_id')
          .eq('receiver_id', user.id)
          .gt('created_at', lastCheckedTime.toISOString());

        if (messagesError) {
          console.error('Error fetching friend messages:', messagesError);
          return;
        }

        // Group messages by sender to get per-friend notification counts
        const messageCountsBySender: { [key: string]: number } = {};
        messages?.forEach(message => {
          const senderId = message.sender_id;
          messageCountsBySender[senderId] = (messageCountsBySender[senderId] || 0) + 1;
        });

        // Convert to friend notifications array
        const friendNotifs: FriendNotification[] = Object.entries(messageCountsBySender).map(([friendId, count]) => ({
          friendId,
          messageCount: count,
          hasUnreadMessages: count > 0
        }));

        setFriendNotifications(friendNotifs);

        const totalMessagesCount = messages?.length || 0;
        console.log('Found unread messages:', totalMessagesCount);
        console.log('Found pending requests:', requestsCount);
        console.log('Friend notifications:', friendNotifs);

        const totalNotifications = requestsCount + totalMessagesCount;
        setNotificationCount(totalNotifications);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

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
          table: 'friend_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New message received:', payload);
          fetchNotificationCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user]);

  const clearFriendNotifications = (friendId: string) => {
    if (user) {
      // Store per-friend last checked time
      const friendLastCheckedKey = `friend_last_checked_${user.id}_${friendId}`;
      const currentTime = new Date().toISOString();
      localStorage.setItem(friendLastCheckedKey, currentTime);
      console.log('Cleared notifications for friend:', friendId, 'at:', currentTime);
      
      // Remove this friend from notifications
      setFriendNotifications(prev => prev.filter(notif => notif.friendId !== friendId));
      
      // Update total count
      const friendNotif = friendNotifications.find(notif => notif.friendId === friendId);
      if (friendNotif) {
        setNotificationCount(prev => prev - friendNotif.messageCount);
      }
    }
  };

  const clearRequestNotifications = () => {
    // This can be called when requests are handled
    setPendingRequestsCount(0);
    setNotificationCount(prev => prev - pendingRequestsCount);
  };

  const getFriendNotificationCount = (friendId: string): number => {
    const friendNotif = friendNotifications.find(notif => notif.friendId === friendId);
    return friendNotif?.messageCount || 0;
  };

  return {
    notificationCount,
    friendNotifications,
    pendingRequestsCount,
    clearFriendNotifications,
    clearRequestNotifications,
    getFriendNotificationCount
  };
};
