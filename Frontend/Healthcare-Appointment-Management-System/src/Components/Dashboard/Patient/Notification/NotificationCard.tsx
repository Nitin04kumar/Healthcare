import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Bell, BellRing, Check, Mail } from "lucide-react";
import { useAuth } from "../../../../Context/AuthContext";
import "./Notifications.css";
import type { Notification } from "../../../../api/types";
import { getUnreadNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../../../api/notificationService";

const NotificationCard: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Data fetching with polling
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const apiNotifications = await getUnreadNotifications();
      setNotifications(apiNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 20000);
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  // API handlers
  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) return;
    try {
      await markAllNotificationsAsRead();
      setNotifications([]);
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error("Failed to mark all as read.");
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="notification">
      <div className="notification__header">
        <h3 className="notification__title">Notifications</h3>
        <button
          className="notification__mark-all"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>
      </div>
      <div className="notification__content">
        {isLoading && notifications.length === 0 ? (
          <div className="notification__state">Loading notifications...</div>
        ) : unreadCount === 0 ? (
          <div className="notification__empty">
            <Bell size={28} />
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="notification__list">
            {notifications.map((notification) => (
              <div key={notification.id} className="notification__item">
                <div className="notification__item-icon">
                  <Mail size={16} />
                </div>
                <div className="notification__item-content">
                  <p className="notification__message">{notification.message}</p>
                  <span className="notification__time">{new Date(notification.createdAt).toLocaleTimeString()}</span>
                </div>
                <button
                  className="notification__action"
                  title="Mark as read"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <Check size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;