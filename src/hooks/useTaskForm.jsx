import { useState, useEffect, useCallback } from "react";
import { projectService } from "../api/projectService";
import { taskService } from "../api/taskService";

const EMPTY_FORM = {
  user_id: "",
  project_id: "",
  title: "",
  category: "",
  description: "",
  priority: "",
  due_date: "",
};

export function useTaskForm({ task, isOpen, user, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ─── load projects once ───────────────────── */
  useEffect(() => {
    projectService.getProjects()
      .then(res => setProjects(res.data.data))
      .catch(console.error);
  }, []);

  /* ─── fetch users by project ───────────────── */
  const fetchUsers = useCallback(async (projectId, selectedUserId = "") => {
    if (!projectId) {
      setUsers([]);
      return;
    }

    setLoadingUsers(true);
    try {
      const res = await projectService.getProjectUsers(projectId);
      const list = res.data.data;

      setUsers(list);

      if (selectedUserId) {
        const exists = list.some(u => String(u.id) === String(selectedUserId));
        if (exists) {
          setForm(prev => ({
            ...prev,
            user_id: String(selectedUserId),
          }));
        }
      }

    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  /* ─── initialize form when editing ─────────── */
  useEffect(() => {
    if (!task || !isOpen) return;

    const projectId = String(task.project_id ?? "");
    const userId    = String(task.user_id ?? "");

    setForm({
      user_id: userId,
      project_id: projectId,
      title: task.title ?? "",
      category: task.category ?? "",
      description: task.description ?? "",
      priority: task.priority ?? "",
      due_date: (task.due_date ?? "").slice(0, 10),
    });

    fetchUsers(projectId, userId);

  }, [task, isOpen, fetchUsers]);

  /* ─── handle change ───────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "project_id") {
      setForm(prev => ({
        ...prev,
        project_id: value,
        user_id: "",
      }));
      fetchUsers(value);
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* ─── submit ──────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await taskService.updateTask(task.id, {
        ...form,
        user_id: Number(form.user_id),
        project_id: Number(form.project_id),
        created_by: user.id,
      });

      await onSuccess();
      resetForm();

    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── reset ──────────────────────────────── */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setUsers([]);
  };

  return {
    form,
    projects,
    users,
    loadingUsers,
    submitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
}