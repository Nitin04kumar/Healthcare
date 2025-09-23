import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../Context/AuthContext";
import { Bell, BellRing, Check, X, Mail } from "lucide-react";
import "./NotificationStyle.css";
import { getUnreadNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../../api/notificationService";
import type { Notification } from "../../../api/types";

const DocNotification: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // --- Data Fetching with Polling ---
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
        setNotifications([]);
        return;
    };
    setIsLoading(true);
    try {
      const apiNotifications = await getUnreadNotifications();
      setNotifications(apiNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // Fetch immediately on mount
    fetchNotifications();
    // Then, fetch every 20 seconds (polling)
    const intervalId = setInterval(fetchNotifications, 20000);
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  // --- API Handlers ---
  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      // Optimistically update UI
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) return;
    try {
      await markAllNotificationsAsRead();
      setNotifications([]); // Clear all notifications from the UI
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error("Failed to mark all as read.");
    }
  };

  return (
    <div className="notification-bell-container">
      <button className="bell-icon-button" onClick={() => setIsOpen(!isOpen)}>
        {notifications.length > 0 ? <BellRing /> : <Bell />}
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button
              className="mark-all-button"
              onClick={handleMarkAllAsRead}
              disabled={notifications.length === 0}
            >
              Mark All as Read
            </button>
          </div>

          <div className="notification-list">
            {isLoading ? (
              <div className="loading-state">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={32} />
                <p>You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-icon">
                    <Mail size={18} />
                  </div>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                  </div>
                  <div className="notification-item-actions">
                    <button
                      className="action-button mark-read"
                      title="Mark as Read"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocNotification;