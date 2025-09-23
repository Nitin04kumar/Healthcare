import axiosInstance from '../utils/axios';

export const getNotificationsByUserId = async (userId: number | string) => {
    console.log("getNotificationsByUserId api called")
  const accessToken = localStorage.getItem('token');
  const response = await axiosInstance.get(`/notifications/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
