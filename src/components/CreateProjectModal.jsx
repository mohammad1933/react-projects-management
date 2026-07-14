import { useEffect, useState } from "react";
import { projectService } from "../api/projectService";
import { useAuth } from "../context/AuthContext";
import { usersService } from "../api/usersService";
 
export default function NewProjectModal({ isOpen, onClose, updateRemoteProjects }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    ends_at: "",
    users:[],
    due_date:""
  });

  const [users,setUsers] = useState([]);



  useEffect(() => {
  async function getUsers() {
    try{
      const res = await usersService.getUsers();
      setUsers(res.data.data);
    }catch(error){
      console.log(error);
    }
  }
    getUsers();
  },[])

  // useEffect(() => {
  //   console.log(form);
  // },[form]);

  const {user} = useAuth();
 
  const handleChange = (e) => {
    console.log(e.target.selectedOptions);
    if(e.target.name === "users"){
      const options = Array.from(e.target.selectedOptions,(option => (option.value)));
      setForm(prev => ({...prev, users:options}));
      // console.log(form);
    }else{
      const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
 
  const handleSubmit = async () => {
    console.log("Submitted:", form);
    try{
        const res = await projectService.createProject({...form,user_id:user.id});
        console.log(res.data.data);
        updateRemoteProjects();
        onClose();
    }catch(error){
        console.log(error.error)
    }
    // setForm({ name: "", description: "", ends_at: "" });
  };
 
  const handleClose = () => {
    onClose();
    setForm({ name: "", description: "",users:[], ends_at: "" });
  };
 
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
 
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">New Project</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>
 
        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Website Redesign"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
 
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the project..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>


           <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add users to Project
                </label>
                <select name="users" value={form.users} onChange={handleChange} multiple={true}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Select Users</option>
                    {users && users.map(u => user.id!=u.id && <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
            </div>
 
          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline Date
            </label>
            <input
              type="date"
              name="ends_at"
              value={form.ends_at}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
 
        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}