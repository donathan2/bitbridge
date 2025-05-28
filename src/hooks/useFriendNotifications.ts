
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFriendNotifications = () => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasCheckedRecently, setHasCheckedRecently] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
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

        // Check for unread messages (we'll consider all messages as potentially unread for simplicity)
        // In a real app, you'd track read/unread status
        const lastCheckedKey = `friends_last_checked_${user.id}`;
        const lastChecked = localStorage.getItem(lastCheckedKey);
        const lastCheckedTime = lastChecked ? new Date(lastChecked) : new Date(0);

        const { data: messages, error: messagesError } = await supabase
          .from('friend_messages')
          .select('id')
          .eq('receiver_id', user.id)
          .gt('created_at', lastCheckedTime.toISOString());

        if (messagesError) {
          console.error('Error fetching friend messages:', messagesError);
          return;
        }

        const totalNotifications = (requests?.length || 0) + (messages?.length || 0);
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
        () => {
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
        () => {
          fetchNotificationCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user]);

  const clearNotifications = () => {
    if (user) {
      const lastCheckedKey = `friends_last_checked_${user.id}`;
      localStorage.setItem(lastCheckedKey, new Date().toISOString());
      setNotificationCount(0);
    }
  };

  return {
    notificationCount,
    clearNotifications
  };
};
