import { FaArchive, FaTasks } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { SiTask } from "react-icons/si";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoIosLogOut } from "react-icons/io";
import { FcInvite } from "react-icons/fc";
import { useEffect, useState } from "react";
import { authService } from "../api/authService";

export default function DashSidebar(){

  const location = useLocation();

  const {clearAuth} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
  await clearAuth();
  navigate('/login');
};

 const [invitations, setInvitations] = useState([]);

    useEffect(() => {
     async function  getInvitations(){
        setInvitations(await authService.invitations());
      }


      getInvitations();
    },[])

return <aside className="p-5 w-70 bg-gray-50 shadow h-screen">
    <div className="">
        <div className="flex gap-5 items-center">
            <SiTask size={40} className="text-blue-600" />
        <div className="flex flex-col">
            <h1 className="text-xl"> Taskify
            </h1>
            <p className="text-gray-400">Let's build something great</p>
        </div>
        </div>  

        
        <Link to={"/dashboard"}  className={`flex gap-2 items-center mt-20 hover:scale-110 hover:bg-blue-300 p-2 rounded transition-all ${location.pathname==='/dashboard' ? 'bg-blue-500 text-white' : null}`}>
        <MdDashboard className="text-blue-600" />
        Dashboard</Link>

                <Link to={"/projects"}  className={`flex gap-2 items-center mt-10 hover:scale-110 hover:bg-blue-300 p-2 rounded transition-all ${location.pathname==='/projects' ? 'bg-blue-500 text-white' : null}`}>
        <FaArchive className="text-blue-600" />
        Projects</Link>

          <Link to={"/tasks"}  className={`flex gap-2 items-center mt-10 hover:scale-110 hover:bg-blue-300 p-2 rounded transition-all ${location.pathname==='/tasks' ? 'bg-blue-500 text-white' : null}`}>
        <FaTasks className="text-blue-600" />
        Tasks</Link>

         <Link to={"/my-tasks"}  className={`flex gap-2 items-center mt-10 hover:scale-110 hover:bg-blue-300 p-2 rounded transition-all ${location.pathname==='/my-tasks' ? 'bg-blue-500 text-white' : null}`}>
        <FaTasks className="text-blue-600" />
         Tasks Assigned To Me</Link>

            <Link to={"/invitations"}  className={`flex gap-2 items-center mt-10 hover:scale-110 hover:bg-blue-300 p-2 rounded transition-all ${location.pathname==='/invitations' ? 'bg-blue-500 text-white' : null}`}>
        <FcInvite className="text-blue-600" />
         Invitations <span className="rounded p-0.5 px-2 bg-red-500 text-white">{invitations.data?.data.length}</span></Link>

  

          <Link to={"/settings"} className={`flex gap-2 items-center mt-10 hover:scale-110 hover:bg-blue-300 p-2 rounded transition-all ${location.pathname==='/settings' ? 'bg-blue-500 text-white' : null}`}>
        <IoSettings className="text-blue-600" />
        Settings</Link>

          <Link onClick={handleLogout} className="flex gap-2 items-center mt-10 hover:scale-110 hover:bg-blue-300 p-2 rounded transition-all text-red-600">
        <IoIosLogOut className="text-red-600 text-xl" />
        Logout</Link>

    </div>
</aside>
}
