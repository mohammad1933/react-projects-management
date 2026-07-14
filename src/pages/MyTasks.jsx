import { useEffect, useState } from "react"
import { usersService } from "../api/usersService";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";

export default function MyTasks(){

    const [tasks,setTasks] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
       async function getUserTasks() {
        setTasks(await usersService.getTasks(user.id));
       }

       getUserTasks();
    })

    if(!tasks) return <h1>Loading.....</h1>

    return (
        <div>
            <h1 className="text-3xl mb-5 bold text-blue-700">Tasks Assigned to Me</h1>
            {/* {JSON.stringify(tasks.data.data.tasks)} */}
            <div className="flex gap-5">
                {tasks && tasks?.data?.data?.tasks.map(t=><TaskCard key={t.id} task={t} />)}
            </div>
            
        </div>
    )
}