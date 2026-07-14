import { useEffect, useState, useCallback } from "react";
import { projectService } from "../api/projectService";
import { taskService } from "../api/taskService";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = {
  user_id: "",
  project_id: "",
  title: "",
  category: "",
  description: "",
  priority: "",
  due_date: "",
};

export default function EditTaskModal({ isOpen, onClose, task, updateRemoteTasks }) {
  const { user } = useAuth();

  const [form, setForm]           = useState(EMPTY_FORM);
  const [projects, setProjects]   = useState([]);
  const [users, setUsers]         = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  /* ─── load projects once ─────────────────────────────────────── */
  useEffect(() => {
    projectService.getProjects()
      .then(res => setProjects(res.data.data))
      .catch(console.error);
  }, []);

  /* ─── helper: fetch users for a given project id ─────────────── */
  const fetchUsers = useCallback(async (projectId, selectUserId = "") => {
  if (!projectId) {
    setUsers([]);
    return;
  }

  setLoadingUsers(true);
  try {
    const res = await projectService.getProjectUsers(projectId);
    const list = res.data.data;

    setUsers(list);

    // ✅ Ensure correct selection AFTER users load
    if (selectUserId) {
      const exists = list.some(u => String(u.id) === String(selectUserId));
      if (exists) {
        setForm(prev => ({
          ...prev,
          user_id: String(selectUserId)
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

  /* ─── populate form whenever task changes ─────────────────────── */
  useEffect(() => {
    if (!task || !isOpen) return;

    const projectId = String(task.project_id ?? "");
    const userId    = String(task.user_id    ?? "");

    // Set every field as a string so React controlled inputs never mismatch
    setForm({
      user_id:     userId,
      project_id:  projectId,
      title:       task.title       ?? "",
      category:    task.category    ?? "",
      description: task.description ?? "",
      priority:    task.priority    ?? "",
      due_date:    (task.due_date   ?? "").slice(0, 10), // ensure YYYY-MM-DD
    });

    // Fetch users for this project AND pre-select the assigned user
    fetchUsers(projectId, userId);

  }, [task, isOpen, fetchUsers]);

  /* ─── handlers ───────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // When project changes manually → reload users, clear user selection
    if (name === "project_id") {
      setForm(prev => ({ ...prev, project_id: value, user_id: "" }));
      fetchUsers(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskService.updateTask(task.id, {
        ...form,
        user_id:    Number(form.user_id),
        project_id: Number(form.project_id),
        created_by: user.id,
      });
      await updateRemoteTasks();
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setUsers([]);
    onClose();
  };

  if (!isOpen || !task) return null;

  /* ─── render ─────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit Task</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Website Redesign"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief description..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Project</label>
              <select
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a project</option>
                {projects.map(p => (
                  <option key={p.id} value={String(p.id)}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Assign to User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to User</label>
              {loadingUsers ? (
                <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-400">
                  Loading users...
                </div>
              ) : (
                <select
                  name="user_id"
                  value={task.user_id}
                  // value={1}
                  // defaultValue={task.user_id}
                  onChange={handleChange}
                  disabled={users.length === 0}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Select a user</option>
                  {users.map(u => (
                    <option key={u.id} value={String(u.id)}>{u.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}   