import { useState, useEffect, useCallback } from 'react';
import echo from '../lib/echo';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../api/notificationService';

export function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount]     = useState(0);
    const [loading, setLoading]             = useState(true);

    // ── Initial fetch: load existing notifications from DB ──
    const fetchNotifications = useCallback(async () => {
        try {
            const res = await notificationService.getNotifications();
            // console.log("nots",res.data.data.notifications)
            setNotifications(res.data.data.notifications.data);
            setUnreadCount(res.data.data.unread_count);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // ── WebSocket listener: receive real-time notifications ──
    useEffect(() => {
        if (!user?.id) return; // wait until we have the user

        fetchNotifications(); // load existing on mount

        // Subscribe to the user's private channel.
        // Channel name: App.Models.User.{id}  (Laravel's convention)
        // .notification() listens for ANY notification broadcast to this channel.
        const channel = echo
            .private(`App.Models.User.${user.id}`)
            .notification((notification) => {
                // notification is the toBroadcast() payload from Laravel
// It has the same shape as a database notification row

                // Prepend to list so newest appears at top
                setNotifications(prev => [notification, ...prev]);

                // Increment unread badge
                setUnreadCount(prev => prev + 1);
            });

        // Cleanup: leave the channel when component unmounts
        // or when the user changes (e.g. logout)
        return () => {
            echo.leave(`App.Models.User.${user.id}`);
        };
    }, [user?.id]);

    // ── Mark a single notification as read ──
    const markAsRead = async (id) => {
        try {
            await notificationService.readNotification(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    // ── Mark all notifications as read ──
    const markAllAsRead = async () => {
        try {
            await notificationService.readAllNotifications( );
            setNotifications(prev =>
                prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
