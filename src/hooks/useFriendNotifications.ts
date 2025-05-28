
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFriendNotifications = () => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

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

        // Check for unread messages
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

        console.log('Found unread messages:', messages?.length || 0);
        console.log('Found pending requests:', requests?.length || 0);

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

  const clearNotifications = () => {
    if (user) {
      const lastCheckedKey = `friends_last_checked_${user.id}`;
      const currentTime = new Date().toISOString();
      localStorage.setItem(lastCheckedKey, currentTime);
      console.log('Cleared notifications at:', currentTime);
      setNotificationCount(0);
    }
  };

  return {
    notificationCount,
    clearNotifications
  };
};
