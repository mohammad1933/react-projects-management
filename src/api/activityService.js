import apiClient from "./axios";

export const activityService = {
    getActivities: (projectId) => apiClient.get(`/projects/${projectId}/activities`),
};