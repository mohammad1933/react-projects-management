import { useEffect, useState } from "react";
import { projectService } from "../api/projectService";
// import { useAuth } from "../context/AuthContext";
import { usersService } from "../api/usersService";
import { taskService } from "../api/taskService";
import { useAuth } from "../context/AuthContext";

export default function NewTaskModal({ isOpen, onClose, updateRemoteTasks }) {
const [form, setForm] = useState({
user_id:0,
project_id:0,
title: "",
category:"",
description: "",
priority:"",
due_date:""
});

const [users,setUsers] = useState([]);
const [projects,setProjects] = useState([]);
const {user} = useAuth();

// const {user} = useAuth();

const handleChange = (e) => {
  
 const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async () => {
console.log("Submitted:", form);
try{
     const res = await taskService.createTask({...form,created_by:user.id});
     console.log(res.data.data);
     updateRemoteTasks();
     onClose();
}catch(error){
     console.log(error.error)
}
setForm({user_id:0,project_id:0, name: "", description: "",priority:"", due_date: "" });
};

const handleClose = () => {
onClose();
setForm({ name: "", description: "", deadline_date: "" });
};

useEffect(() => {


async function getProjects() {
try{
const res = await projectService.getProjects();
setProjects(res.data.data);

}catch(error){
console.log(error);
}

}


getProjects();


},[])




useEffect(() => {
    async function getUsers(id) {
try{
const res = await projectService.getProjectUsers(id);
setUsers(res.data.data);

}catch(error){
console.log(error);
}

}


       
    getUsers(form.project_id);
    console.log(users);

},[form.project_id])



if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">New Task</h2>
            <button onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">
                ✕
            </button>
        </div>

        {/* Form */}
        <form>
               <div className="space-y-4">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                </label>
                <input type="text" name="title" value={form.title} onChange={handleChange}
                    placeholder="e.g. Website Redesign"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea name="description" value={form.description} onChange={handleChange}
                    placeholder="Brief description of the project..." rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
            </div>

            {/* Deadline */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                </label>
                <input type="text" name="category" value={form.category} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                </label>
                <select name="priority" value={form.priority} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Select Priority</option>
                    <option value={"low"}>Low</option>
                    <option value={"medium"}>Medium</option>
                    <option value={"high"}>High</option>
                </select>
            </div>


             {/* Project */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to project
                </label>
                <select name="project_id" value={form.project_id} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value={0}>Select a project</option>
                    {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
            </div>


            {/* Assign to user */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to user
                </label>
                <select name="user_id" value={form.user_id} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value={0}>Select a user</option>
                    {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
            </div>

           
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                </label>
                <input type="date" name="due_date" value={form.due_date} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

        </div>

            {/* Actions */}
        <div typeof="button" className="flex gap-3 mt-6">
            <button onClick={handleClose}
                className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
            </button>
            <button type="submit" onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                Create Task
            </button>
        </div>

        </form>
    
    </div>
</div>
);
}
