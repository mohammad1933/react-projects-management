import apiClient from "./axios";

export const projectService = {
    getProjects : () => apiClient.get("/projects"),
    getProject:(id) => apiClient.get(`/projects/${id}`),
    createProject: (data) => apiClient.post('/create-project',data),
    updateProject: (id,data) => apiClient.post(`/projects/${id}/update-project`,data),
    getProjectUsers:(id) => apiClient.get(`/project-users/${id}`),
    deleteProject:(id) => apiClient.delete(`/projects/${id}`)
}