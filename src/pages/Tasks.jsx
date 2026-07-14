import { useEffect, useState } from "react"
import NewProjectModal from "../components/CreateProjectModal";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { taskService } from "../api/taskService";
import NewTaskModal from "../components/CreateTaskModal";
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { getRemainingTime } from "../helpers/Helpers";
import { useAuth } from "../context/AuthContext";
import EditTaskModal from "../components/EditTaskModal";
import dayjs from "dayjs";

export default function Tasks() {

const [isOpen,setIsOpen] = useState(false);
const [isOpenEditTask,setIsOpenEditTask] = useState(false);
// const [projects,setProjects] = useState(mockProjects)
const [remoteTasks,setRemoteTasks] = useState([]);
const [selectedTask,setSelectedTask] = useState();
const {user} = useAuth();

useEffect(() => {
async function getTasks() {
try{
const res = await taskService.getTasks(user.id);
console.log(res.data);

setRemoteTasks(res.data.data);
}catch(error){
console.log(error);
}

}
getTasks();
},[])

async function updateRemoteTasks(){
try{
const tasks = await taskService.getTasks();
setRemoteTasks(tasks.data.data);
}catch(error){
console.log(error);
}
}

return <>
    {/* {JSON.stringify(remoteTasks)} */}
    <NewTaskModal isOpen={isOpen} onClose={()=> setIsOpen(false)} updateRemoteTasks={updateRemoteTasks} />
    <EditTaskModal isOpen={isOpenEditTask} onClose={()=> setIsOpenEditTask(false)} task = {selectedTask} updateRemoteTasks={updateRemoteTasks} />
        <div className="w-full">
            <div className="flex justify-between w-full p-5">
                <h1 className="text-3xl font-bold text-blue-600  h-fit">Tasks</h1>
                <Link onClick={()=> setIsOpen(old => !old)}
                className="rounded p-4 bg-blue-500 text-white h-fit flex gap-2 items-center">
                <IoMdAdd />Create new Task</Link>
            </div>
            <div className="bg-white rounded-2xl shadow overflow-hidden mt-15">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">

                        {/* Head */}
                        <thead
                            className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wide">
                            <tr>
                                <th className="px-5 py-3 w-12">#</th>
                                <th className="px-5 py-3">Title</th>
                                <th className="px-5 py-3">Created By</th>
                                <th className="px-5 py-3">Assigned To</th>
                                <th className="px-5 py-3">Project</th>
                                <th className="px-5 py-3">Proiority</th>
                                <th className="px-5 py-3 text-center">Category</th>
                                <th className="px-5 py-3 text-center">Description</th>
                                <th className="px-5 py-3">Due Date</th>
                                <th className="px-5 py-3">Manage</th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-gray-100">
                            {remoteTasks.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-400">
                                    No projects found.
                                </td>
                            </tr>
                            ) : (
                            remoteTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                {/* ID */}
                                <td className="px-5 py-4 text-gray-400 font-mono">
                                    {task.id}
                                </td>

                                {/* Name */}
                                <td className="px-5 py-4 font-medium text-gray-800">
                                    {task.title}
                                </td>

                                {/* Created By */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                                            {task.user.name.charAt(0)}
                                        </div>
                                        <span className="text-gray-700 hover:text-blue-400 cursor-pointer">{task.user.name}</span>
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                                            {task.assigned.name.charAt(0)}
                                        </div>
                                        <span className="text-gray-700 hover:text-blue-400 cursor-pointer">{task.assigned.name}</span>
                                    </div>
                                </td>

                                {/* Description */}
                                <td className="px-5 py-4 text-gray-500 max-w-xs truncate">
                                    {task.project.name}
                                </td>

                                <td className="px-5 py-4 text-gray-500 max-w-xs truncate">
                                    {task.priority}
                                </td>

                                {/* Num of Tasks */}
                                <td className="px-5 py-4 text-center">
                                    <span
                                        className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {task.category}
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-center">
                                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {task.description}
                                    </span>
                                </td>

                                {/* Created At */}
                                <td className={`px-5 py-4 ${dayjs(task.due_date).isBefore() ? 'text-red-400' : 'text-gray-400'}`}>
                                    {new Date(task.due_date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    })}
                                    {dayjs(task.due_date).isBefore() ? <p className="text-red-400">Expired</p> : <p>{getRemainingTime(task.due_date)}</p>}
                                </td>
                                <td className="px-5 py-4 text-center flex gap-5">
                                   {task.user.id === user.id && <div> <button
                                   onClick={() => {setIsOpenEditTask(true);setSelectedTask(task)}}
                                        className="text-white font-bold text-xl mb-1 bg-blue-600 rounded p-3 cursor-pointer">
                                        <FaPencil />
                                    </button>
                                    <button
                                        className="text-white font-bold text-xl bg-red-600 rounded p-3 cursor-pointer">
                                        <FaTrash />
                                    </button></div>}
                                </td>
                            </tr>
                            ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>


</>
}
