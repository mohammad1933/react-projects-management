import { useEffect, useState } from "react"
import NewProjectModal from "../components/CreateProjectModal";
import { Link, useLocation } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { projectService } from "../api/projectService";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { getRemainingTime } from "../helpers/Helpers";
import EditProjectModal from "../components/EditProjectModal";
import ConfirmDeleteModel from "../components/confirmDeleteModel";
import { useAuth } from "../context/AuthContext";

export default function Projects() {

const [isOpen,setIsOpen] = useState(false);
const [isEditOpen,setIsEditOpen] = useState(false);
const [isDeleteOpen,setIsDeleteOpen] = useState(false);
const [remoteProjects,setRemoteProjects] = useState([]);
const [selectedProject,setSelectedProject] = useState([]);

const {user} = useAuth();

useEffect(() => {
async function getProjects() {
try{
const res = await projectService.getProjects();
// console.log(res.data);

setRemoteProjects(res.data.data);
}catch(error){
console.log(error);
}

}
getProjects();
},[])

const location = useLocation();



async function updateRemoteProjects(){
try{
const projects = await projectService.getProjects();
setRemoteProjects(projects.data.data);
}catch(error){
console.log(error);
}
}

 function confirmDelete(){
    console.log("deleting...")
     projectService.deleteProject(selectedProject.id);
    console.log("Deleted")
    setIsDeleteOpen(false);
    setSelectedProject(null);
    updateRemoteProjects();
}

return <>
    {/* {JSON.stringify(remoteProjects)} */}
    {/* {JSON.stringify(selectedProject)} */}
    <NewProjectModal isOpen={isOpen} onClose={()=> setIsOpen(false)} updateRemoteProjects={updateRemoteProjects} />
    <EditProjectModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} updateRemoteProjects={updateRemoteProjects} project={selectedProject} />
    <ConfirmDeleteModel isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} confirm={confirmDelete} />
        <div className="w-full">
            <div className="flex justify-between w-full p-5">
                <h1 className="text-3xl font-bold text-violet-600  h-fit">Projects {location.hash.replace("#",'')}</h1>
                <Link onClick={()=> setIsOpen(old => !old)}
                className="rounded p-4 bg-blue-500 text-white h-fit flex gap-2 items-center">
                <IoMdAdd />Create new Project</Link>
            </div>
            <div className="bg-white rounded-2xl shadow overflow-hidden mt-15">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">

                        {/* Head */}
                        <thead
                            className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wide">
                            <tr>
                                <th className="px-5 py-3 w-12">#</th>
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Created By</th>
                                <th className="px-5 py-3">Description</th>
                                <th className="px-5 py-3 text-center">Tasks</th>
                                <th className="px-5 py-3">Due Date</th>
                                <th className="px-5 py-3">Manage</th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-gray-100">
                            {remoteProjects.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-400">
                                    No projects found.
                                </td>
                            </tr>
                            ) : (
                            remoteProjects.map((project) => (
                            <tr  key={project.id} className={`${"hover:bg-gray-50 transition-colors"} ${location.hash.replace("#",'')==project.id && "bg-blue-300"} `}>
                                {/* ID */}
                                <td className="px-5 py-4 text-gray-400 font-mono">
                                    {project.id}
                                </td>

                                {/* Name */}
                                <td className="px-5 py-4 font-medium text-gray-800">
                                    
                                    <Link to={`/project-details/${project.id}`} className="text-blue-600">{project.name}</Link>
                                </td>

                                {/* Created By */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                                            {project.user.name.charAt(0)}
                                        </div>
                                        <span className="text-gray-700">{project.user.name}</span>
                                    </div>
                                </td>

                                {/* Description */}
                                <td className="px-5 py-4 text-gray-500 max-w-xs truncate">
                                    {project.description}
                                </td>

                                {/* Num of Tasks */}
                                <td className="px-5 py-4 text-center">
                                    <span
                                        className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {project.tasks_count}
                                    </span>
                                </td>

                                {/* Created At */}
                                <td className="px-5 py-4 text-gray-500">
                                    {new Date(project.ends_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    })}
                                    <p>{getRemainingTime(project.ends_at)}</p>
                                </td>

                                {project.user.id===user.id && <td className="px-5 py-4 text-center flex gap-5">
                                    <button
                                    onClick={() => {setIsEditOpen(true);setSelectedProject(project)}}
                                        className="text-white font-bold text-xl bg-blue-600 rounded p-3 cursor-pointer">
                                        <FaPencil />
                                    </button>
                                    <button
                                    onClick={()=>{setSelectedProject(project);setIsDeleteOpen(true)}}
                                        className="text-white font-bold text-xl bg-red-600 rounded p-3 cursor-pointer">
                                        <FaTrash />
                                    </button>
                                </td>}

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
