
import axiosInstance from '../utils/axios';
import type { Notification } from './types';

/**
 * Fetches all unread notifications for the currently logged-in user.
 */
export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const response = await axiosInstance.get('/api/notifications');
  return response.data.data;
};

/**
 * Marks a specific notification as read.
 */
export const markNotificationAsRead = async (notificationId: number): Promise<Notification> => {
  const response = await axiosInstance.patch(`/api/notifications/${notificationId}/read`);
  return response.data.data;
};

/**
 * Marks all unread notifications as read for the current user.
 */
export const markAllNotificationsAsRead = async (): Promise<Notification[]> => {
  const response = await axiosInstance.patch('/api/notifications/read-all');
  return response.data.data;
};