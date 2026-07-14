import apiClient from "./axios";

export const notificationService = {
    getNotifications:() => apiClient.get("/notifications"),
    readNotification:(id) => apiClient.post(`/notifications/${id}/read`),
    readAllNotifications:() => apiClient.post('/notifications/read-all'),
}