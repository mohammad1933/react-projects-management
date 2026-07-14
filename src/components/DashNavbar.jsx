import { CiBellOn } from "react-icons/ci";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import NotificationsBell from "./NotificationsBell";
import { useAuth } from "../context/AuthContext";

export default function DashNavbar(){
    const {user} = useAuth();
    


return <nav className="p-5 shadow flex items-center justify-between">
    <div className="flex gap-4">
        <h1 className="text-blue-600 text-2xl font-bold">Dash Navbar</h1>
        <input type="search" className="border px-2 rounded border-blue-600" placeholder="Search tasks..." />

    </div>
    <div className="flex gap-4 justify-center items-center">
        <NotificationsBell />
        <MdContactSupport size={30} className="text-gray-500" />

        <FaUserCircle size={30} className="text-gray-500"    />

         {user.name}
    </div>
</nav>
}
