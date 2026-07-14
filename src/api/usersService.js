import apiClient from "./axios";

export const usersService = {
    getUsers: () => apiClient.get("/users"),
    getTasks: (id) => apiClient.get(`/user-tasks/${id}`)
}