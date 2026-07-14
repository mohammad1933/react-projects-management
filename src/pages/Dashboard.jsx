import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../api/authService';
import { SiAffinitydesigner, SiGoogletasks, SiProgress } from 'react-icons/si';
import { MdOutlinePendingActions } from 'react-icons/md';
import { FaCalendar, FaCircle, FaUserTie } from 'react-icons/fa';
import { CiMenuKebab } from 'react-icons/ci';
import { taskService } from '../api/taskService.js';
import { formatDate } from '../helpers/Helpers.js';

export default function Dashboard() {
const { user, setUser } = useAuth();
const [recentTasks,setRecentTasks] = useState();
const [totalTasks,setTotalTasks] = useState();
const [totalCompletedTasks,setTotalCompletedTasks] = useState();



// Toggle 2FA on/off
const handleToggle2FA = async () => {
setToggling(true);
setMessage('');
try {
const res = await authService.toggleTwoFactor();
const newVal = res.data.data.two_factor_enabled;

// Update user state so UI reflects change immediately
const updatedUser = { ...user, two_factor_enabled: newVal };
setUser(updatedUser);
localStorage.setItem('auth_user', JSON.stringify(updatedUser));

setMessage(res.data.message);
} catch {
setMessage('Failed to update 2FA setting.');
} finally {
setToggling(false);
}
};

useEffect(()=>{
    async function getRecentTasks(){
        try{
            const res = await taskService.getRecentTasks(user.id);
            console.log(res.data.data);
            setRecentTasks(res.data.data.tasks);
            setTotalTasks(res.data.data.total)
            setTotalCompletedTasks(res.data.data.totalCompleted)

        }catch(error){
            console.log(error);
        }
    }

    getRecentTasks();
},[])

return (
<div className='font-serif'>
    <h1 className='text-2xl font-bold'>Welcome back, {user.name}</h1>
    {/* {JSON.stringify(recentTasks)} */}
    <p className='text-gray-500 mt-2'>You have {totalTasks-totalCompletedTasks} tasks remaining for this week. keep up the flow</p>

    {/*Summary Section*/}
    <div className='flex gap-2 justify-center'>
        <div className='flex mt-10 hover:scale-110 transition-all'>
            <div
                className='shadow border border-blue-700 p-5 rounded-2xl flex flex-wrap items-center justify-between w-100'>
                <SiProgress size={40} className='w-1/2 text-blue-400' />
                <h1 className='w-1/2 text-2xl text-gray-500'>My Total Tasks</h1>
                <p className='justify-center mt-5 w-full text-gray-600 flex items-center gap-2'><span
                        className='text-5xl font-bold text-blue-600'>{totalTasks}</span> Tasks active across 4 projects</p>
            </div>
        </div>

        <div className='flex mt-10 hover:scale-110 transition-all'>
            <div
                className='shadow border border-blue-700 p-5 rounded-2xl flex flex-wrap items-center justify-between w-100'>
                <SiGoogletasks size={40} className='w-1/2 text-green-700' />
                <h1 className='w-1/2 text-2xl text-gray-500'>Completed Tasks</h1>
                <p className='justify-center mt-5 w-full text-gray-600 flex items-center gap-2'><span
                        className='text-5xl font-bold text-blue-600'>{totalCompletedTasks}</span> Comoleted this month</p>
            </div>
        </div>


        <div className='flex mt-10 bg-blue-600 rounded-2xl  hover:scale-110 transition-all'>
            <div className='shadow p-5 rounded-2xl flex flex-wrap items-center justify-between w-100'>
                <MdOutlinePendingActions size={40} className='w-1/2 text-white' />
                <h1 className='w-1/2 text-2xl text-gray-200'>Pending Tasks</h1>
                <p className='justify-center mt-5 w-full text-gray-200 flex items-center gap-2'><span
                        className='text-5xl font-bold text-white'>{totalTasks-totalCompletedTasks}</span> Pending</p>
            </div>
        </div>
    </div>
    {/*End Summary Section*/}


    {/*Task Section*/}
    <div className='mt-10'>
        <div className='flex justify-between'>
            <h1 className='text-2xl'>Recent Tasks</h1>
            <Link to={"/tasks"} className='text-blue-700'>View All</Link>
        </div>
        <div className='shadow p-5 mt-4'>

            {recentTasks && recentTasks.map(task => 
            <div key={task.id} className='flex justify-between items-center py-4'>
                <div className='flex gap-5 items-center'>
                    <SiAffinitydesigner size={30} className='text-blue-500' />
                    <div>
                        <h1 className='text-xl'>{task.title}</h1>
                        <p className='flex gap-2 items-center text-gray-500   '>
                            <FaCalendar /> {formatDate(task.created_at)} <span
                                className='p-2 rounded-2xl text-white text-sm bg-blue-400'>{task.category}</span>
                        </p>
                    </div>
                </div>
                <div className='flex gap-4 items-center'>
                    <FaUserTie size={30} className='text-gray-600' />
                    <CiMenuKebab size={20} className='cursor-pointer' />
                </div>

            </div>)}

            <hr className='text-gray-400' />


           </div>
    </div>
    {/*End Task Section*/}

    {/*Actifity Section*/}
    <div className='flex gap-10 items-center justify-between mt-15'>
        <div className='w-1/2 shadow p-5 relative '>
            <div className="absolute inset-0 bg-linear-to-b rounded from-black/50 via-black/40 to-transparent "></div>

            <h1 className='text-sm mb-3 text-blue-500'>Productivity Tip</h1>
            <h1 className='text-2xl text-gray-700 font-bold'>Focus on one high-impact task at a time to maintain flow.
            </h1>
            <p className='text-md'>Deep work sessions of 90 minutes are shown to increase output quality by 40%.</p>
            <button
                className='mt-2 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer text-black font-bold p-2'>Enable
                Focus Mode</button>
        </div>
        <div className='w-1/2 shadow p-5'>
            <h1 className='text-2xl font-serif text-blue-500 rounded'>Actifity Flow</h1>
            <ul className='mt-8'>
              <li className=''>
                <div className='flex items-center gap-1'><FaCircle className='text-blue-600' /> You completed <Link to={'/task/1'} className='text-blue-400'>Research User Journey</Link></div>
                <p className='text-gray-500 text-sm mx-5 font-serif'>2 Hours ago </p>
              </li>

              <li className=''>
                <div className='flex items-center gap-1'><FaCircle className='text-blue-600' /> Weekly sync scheduled with the  <Link to={'/task/1'} className='text-blue-900'>Design Team</Link></div>
                <p className='text-gray-500 text-sm mx-5 font-serif'>3 Hours ago </p>
              </li>

              <li className=''>
                <div className='flex items-center gap-1'><FaCircle className='text-green-900' /> Jordan added you to <Link to={'/task/1'} className='text-green-900'> New Project: Alpha</Link></div>
                <p className='text-gray-500 text-sm mx-5 font-serif'>5 Hours ago </p>
              </li>

            </ul>
        </div>

    </div>
    {/*End Activity Section*/}


</div>
);
}
