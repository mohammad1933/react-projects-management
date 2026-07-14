import { Link } from "react-router-dom";
import { ActivityType } from "../constant/ActivityType";
import { useActivity } from "../hooks/useActivity";
import { formatDate } from "../lib/helpers";

const activityMessage = {
  // `${activity?.task.user.name} has assigned ${activity.task.title} to ${activity?.task.assigned.name}`
  [ActivityType.TASK_ASSIGNED]: (activity) => (
    <div className="flex justify-between">
      <div>
        <Link to={"/"} className="text-blue-500">
          {activity?.task.user.name}
        </Link>{" "}
        has assigned
        <Link to={"/tasks"} className="text-blue-500">
          {activity.task.title}
        </Link>{" "}
        to
        <Link className="text-blue-500">{activity?.task.assigned.name}</Link>
      </div>
      <div>
        {new Date(activity.created_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    })}
      </div>
    </div>
  ),
  [ActivityType.MEMBER_JOINED_PROJECT]: (activity) => (
    <div className="flex justify-between">
      <div>
        <Link to={`/users/${activity?.actor_id}`} className="text-blue-500">
        {activity?.data.user_name}{" "}
      </Link>{" "}
      joined to the project
      </div>
      <div className="text-gray-500">
        {new Date(activity.created_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    })}
      </div>

    </div>
  ),
};

export default function ProjectActivity({ projectId }) {
  const { activities, loading } = useActivity(projectId);

  if (loading) return <p>Loading activities....</p>;
  return (
    <>
      <h1 className="text-2xl font-bold text-blue-500 mb-3">
        Project Activities
      </h1>
      {activities.map((activity) => {
        return (
          <div key={activity.id}>
            {activity.type === ActivityType.TASK_CREATED && (
              <div>
                {activityMessage[ActivityType.TASK_ASSIGNED]?.(activity)}
              </div>
            )}
            {activity.type === ActivityType.TASK_ASSIGNED && (
              <p>Task Assigned</p>
            )}
            {activity.type === ActivityType.TASK_STATUS_CHANGED && (
              <p>Task Status Changed</p>
            )}
            {activity.type === ActivityType.MEMBER_JOINED_PROJECT && (
              <div>
                {activityMessage[ActivityType.MEMBER_JOINED_PROJECT]?.(
                  activity,
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
