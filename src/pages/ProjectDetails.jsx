import { Link, useParams } from "react-router-dom";
import { projectService } from "../api/projectService";
import { useEffect, useState } from "react";

import { FaRegUserCircle, FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import { CiCalendarDate, CiMenuKebab } from "react-icons/ci";
import { RiUserAddFill } from "react-icons/ri";
import { IoChatbubbleEllipses } from "react-icons/io5";
import ProjectChat from "../components/ProjectChat";
import { useAuth } from "../context/AuthContext";
import ProjectActivity from "../components/ProjectActivity";
import { VscServerProcess } from "react-icons/vsc";
import AddNewProjectMemberModal from "../components/AddNewProjectMemberModal";

export default function ProjectDetails(){
const {id} = useParams();
// const {project} = projectService.getProject(id);
const [project,setProject] = useState(null);
const [loading,setLoading] = useState(true);
const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

function closeAddMemberModal() {
    setIsAddMemberOpen(false);
}

useEffect(()=>{
   async function getProject() {
        try {
            // console.log("FETCHING ID:", id);

            const response = await projectService.getProject(id);

            // console.log("RESPONSE:", response.data.data);

            setProject(response.data.data);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


    getProject();

},[id])

// console.log("New Project",project) 

const {user} = useAuth();

if(loading) return <p>Loading...</p>;
// console.log("Current URL ID:", id);

return (
<div>
    <AddNewProjectMemberModal isOpen={isAddMemberOpen} onClose={closeAddMemberModal} members={project?.members} />
    <div className="m-5 bg-white p-4 border grid grid-cols-3 h-fit w-full rounded border-gray-500">
        <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-500">{project.description}</p>
        </div>
        <div className="flex flex-col    justify-center items-center w-full">
            <h1 className="text-gray-500">Timeline</h1>
            <p className="text-gray-500">{new Date(project.starts_at.replace(" ","T")).toLocaleString()} - {new Date(project.ends_at.replace(" ","T")).toLocaleString()}</p>
        </div>
        <div className="flex items-center flex-col">
            <h1 className="text-gray-500">Status</h1>
            <span className="text-white bg-blue-400 rounded-2xl p-2">Pending</span>
        </div>

    </div>
    <div className="grid grid-cols-12 p-4 gap-2">
        <div className="col-span-8 mr-3">
            <div>
                <div className="flex justify-between items-center">

                    <h1 className="text-2xl font-bold">Active Tasks</h1>    
                    <div className="flex gap-5 text-gray-500">
                        <FaSortAmountDown size={30} />
                        <FaSortAmountUpAlt size={30} />
                    </div>
                </div>

                {/*Tasks goes here*/}
                <div className="shadow-2xl mt-10 p-5 mb-3">
                    <div className="flex justify-between">
                        <p className="border p-2 bg-orange-400 text-white rounded-2xl">Development</p>
                        <p className="border p-2 bg-blue-400 text-white rounded-2xl">High Priority</p>
                    </div>
                    <h1 className="mt-6 text-2xl">Task Name</h1>
                    <p className="text-gray-500 mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse ipsa nam non error fugiat nesciunt optio? Ex, pariatur voluptatibus temporibus error libero quidem sunt illo consequuntur porro non. Harum, atque?</p>
                    <hr className="mt-10 text-gray-400"/>
                    <div className="mt-5 flex justify-between items-center text-gray-500">
                       <p className="flex gap-5 items-center"> <CiCalendarDate size={25} /> Due April 27, 2026</p>
                       <FaRegUserCircle size={25} />
                    </div>
                </div>

                    <div className="shadow-2xl mt-10 p-5 mb-3">
                    <div className="flex justify-between">
                        <p className="border p-2 bg-orange-400 text-white rounded-2xl">Development</p>
                        <p className="border p-2 bg-blue-400 text-white rounded-2xl">High Priority</p>
                    </div>
                    <h1 className="mt-6 text-2xl">Task Name</h1>
                    <p className="text-gray-500 mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse ipsa nam non error fugiat nesciunt optio? Ex, pariatur voluptatibus temporibus error libero quidem sunt illo consequuntur porro non. Harum, atque?</p>
                    <hr className="mt-10 text-gray-400"/>
                    <div className="mt-5 flex justify-between items-center text-gray-500">
                       <p className="flex gap-5 items-center"> <CiCalendarDate size={25} /> Due April 27, 2026</p>
                       <FaRegUserCircle size={25} />
                    </div>
                </div>
            </div>
        </div>  
        <div className="col-span-4">

            <div className="shadow-lg p-3">
                  {/* Project Members */}
                <h1 className="text-xl">TEAM MEMBERS</h1>
                {/* {JSON.stringify(project.members)} */}
             
             {project?.members?.map(member => {
                return    <div className="flex items-center mt-5 gap-2 justify-between " key={member.id}>
                   <div className="flex items-center gap-2">
                         <FaRegUserCircle size={25} />
                         <div>
                            <Link to={`/users/${member.id}`} className="text-blue-500">{member.name}</Link>
                            
                            {member.pivot.approved ? <p className="text-gray-500">{member.id === project.user_id ? "Manager" : "Member"}</p> : <p className="text-red-400">Waiting for invitation approval</p>}
                         </div>
                    </div>
                    {user.id === project.user_id && <CiMenuKebab />}
                </div>

             })}
                

                
            {project.user_id===user.id && <button className="border border-dashed p-3 rounded cursor-pointer border-gray-500 flex gap-2 items-center mx-auto mt-10 text-gray-500" onClick={() => setIsAddMemberOpen(true)}><RiUserAddFill />Invite Member</button>
}
        </div> 

        <div className="mt-10 shadow-2xl p-4">

            <div className="flex gap-4 justify-between items-center ">
                <div className="flex items-center gap-2 text-lg">
                    <IoChatbubbleEllipses className="text-blue-500" size={25} /> Team Chat
                </div>
                <p className="text-white bg-blue-500 rounded-2xl p-2">Live</p>
            </div>
            <hr className="mt-5"/>
            <ProjectChat  currentUser={user}/>
        </div>



        <div className="mt-10 shadow-2xl p-4">

            <div className="flex gap-4 justify-between items-center ">
                <div className="flex items-center gap-2 text-lg">
                    <VscServerProcess className="text-blue-500" size={25} /> Team Activity
                </div>
                <p className="text-white bg-blue-500 rounded-2xl p-2">Live</p>
            </div>
            <hr className="mt-5 mb-5"/>
            <ProjectActivity projectId={id} />
        </div>





        </div>

     


    </div>
</div>
);
}
