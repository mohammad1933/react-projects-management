import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"
import { authService } from "../api/authService";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export default function Invitations() {

    const [invitations, setInvitations] = useState([]);

    useEffect(() => {
     async function  getInvitations(){
        setInvitations(await authService.invitations());
      }


      getInvitations();
    },[])

    const {user} = useAuth();


    async function approveProject(pid){
        await authService.approveProject(pid);
        setInvitations(await authService.invitations());
    }

      async function declineProject(pid){
        await authService.declineProject(pid);
        setInvitations(await authService.invitations());
    }

    return <div>
        <h1 className="text-2xl text-blue-600 font-bold">Projects Joining Invitation </h1>
        <div className="mt-10 w-full">
            {invitations && invitations.data?.data.map(inv => <div key={inv.id} className="shadow p-3 mb-5 flex-col justify-between">
                <h1 className="text-2xl font-bold">Project: {inv.name}</h1>
                <div className="flex gap-4 mt-4">
                    <button onClick={() => approveProject(inv.id)} className="flex gap-1 items-center cursor-pointer hover:scale-105 transition" title="Approved this oroject invitaion"><FaCheckCircle className="text-green-700" />
                    Approve</button>
                    <button onClick={() => declineProject(inv.id)} className="flex gap-1 items-center cursor-pointer hover:scale-105 transition" title="Decline this oroject invitaion"><MdCancel className="text-red-700" />Decline</button>
                </div>
            </div>  )}
        {invitations.data?.data.length===0 && <div className="w-dvw h-100 flex justify-center items-center">There is no any invitations</div>}
            {/* {JSON.stringify(invitations.data?.data)} */}
        </div>
    
    </div>
}