import React from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { CiFileOn, CiLink } from "react-icons/ci";
import { formatDate } from "../helpers/Helpers";
import { Link } from "react-router-dom";

const TaskCard = ({
  task,
  links = 1,
  attachments = "0/3",
}) => {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-sm border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
          {task.status}
        </span>
        <button className="text-gray-400 hover:text-gray-600">
          <HiOutlineDotsHorizontal size={18} />
        </button>
      </div>

      {/* Title + Description */}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
        <p className="text-gray-500 text-sm mt-1">{task.description}</p>
      </div>


       <div>
        <h3 className="font-semibold text-gray-900 text-lg">Project</h3>
        <Link to={`/project-details/${task.project.id}`} className="text-blue-500 text-sm mt-1 cursor-pointer ">{task.project.name}</Link>
      </div>


      {/* Date + Priority */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <span>📅</span>
          <span>{formatDate(task.due_date)}</span>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
          {task.priority}
        </span>
      </div>

      <hr />

      {/* Footer */}
      <div className="flex items-center gap-4 text-sm text-gray-500">

        <div className="flex items-center gap-1">
          <CiLink size={16} />
          <span>{links} Links</span>
        </div>

        <div className="flex items-center gap-1">
          <CiFileOn size={16} />
          <span>{attachments}</span>
        </div>
      </div>
      {/* {JSON.stringify(task)} */}
    </div>
  );
};

export default TaskCard;