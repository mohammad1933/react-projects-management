import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
    } = useNotifications();

    const [open, setOpen] = useState(false);

    return (
        <div className='relative'>

            {/* Bell icon with animated badge */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className='relative p-2 rounded-full hover:bg-gray-100 transition'
            >
                <span className='text-xl'>&#128276;</span>
                {unreadCount > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white
                                    text-xs rounded-full min-w-5 h-5 px-1
                                    flex items-center justify-center font-bold
                                    animate-bounce'>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className='absolute right-0 mt-2 w-80 bg-white border
                               border-gray-200 rounded-xl shadow-xl z-50
                               divide-y divide-gray-100'>

                    {/* Header */}
                    <div className='flex justify-between items-center px-4 py-3'>
                        <span className='font-semibold text-gray-900'>
                            Notifications
{unreadCount > 0 && (
                                <span className='ml-2 text-xs bg-blue-100
                                                text-blue-700 px-2 py-0.5 rounded-full'>
                                    {unreadCount} new
                                </span>
                            )}
                        </span>
                        <button
                            onClick={markAllAsRead}
                            className='text-xs text-blue-600 hover:underline'
                        >
                            Mark all read
                        </button>
                    </div>

                    {/* List */}
                    <div className='max-h-96 overflow-y-auto'>
                        {loading && (
                            <p className='text-center py-6 text-gray-400 text-sm'>Loading...</p>
                        )}

                        {!loading && notifications.length === 0 && (
                            <p className='text-center py-6 text-gray-400 text-sm'>
                                No notifications yet
                            </p>
                        )}

                        {notifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => !n.read_at && markAsRead(n.id)}
                                className={[
                                    'px-4 py-3 cursor-pointer hover:bg-gray-50 transition',
                                    !n.read_at ? 'bg-blue-50 border-l-4 border-blue-400' : '',
                                ].join(' ')}
                            >
                                {/* n.data.message comes from toDatabase() / toBroadcast() */}
                                <p className={`text-sm ${!n.read_at
                                    ? 'font-semibold text-gray-900'
                                    : 'text-gray-600'}`}
                                >
                                    {n.data.message}
                                    {n.data.type==="project_invitaion_approved" ? <Link to={`/projects#${n.data.project_id}`} className='text-blue-500'>{n.data.project_name}</Link>:null}
                                    {n.data.type==="project_invitaion_declined" ? <Link to={`/projects#${n.data.project_id}`} className='text-red-500'>{n.data.project_name}</Link>:null}
                                </p>
                                <p className='text-xs text-gray-400 mt-1'>
                                    {new Date(n.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}