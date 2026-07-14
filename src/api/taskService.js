import apiClient from "./axios";

export const taskService = {
    getTasks: (uid) => apiClient.get(`/tasks/${uid}`),
    getRecentTasks: (uid) => apiClient.get(`/recent-tasks/${uid}`),
    createTask: (data) =>  apiClient.post("/create-task",data),
    updateTask:(tid,data) => apiClient.post(`/update-task/${tid}`,data)
}