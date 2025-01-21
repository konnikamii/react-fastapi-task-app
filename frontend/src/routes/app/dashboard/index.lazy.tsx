import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { DimensionContext, UserContext } from "../route";
import { useContext, useEffect, useState } from "react";
import {
  tasksQueryOptions,
  userQueryOptions,
  usersQueryOptions,
} from "../../../utils_fetch/fetch";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CheckBox from "../../../components/svgs/checkBox";
dayjs.extend(relativeTime);

export const Route = createLazyFileRoute("/app/dashboard/")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const dims = useContext(DimensionContext);
  const theme = useContext(UserContext).theme;
  const isLight = theme === "light";

  const navigate = useNavigate({ from: "/app/dashboard" });

  // const [sortBy, setSortBy] = useState<'title'| 'due_date'| 'completed'| 'created_at'| 'updated_at'>('created_at');
  const upcomingTasksQ = useQuery(
    tasksQueryOptions({
      page: 1,
      page_size: 25,
      sort_by: "due_date",
      sort_type: "asc",
    })
  );
  const [upcomingTasksData, setUpcomingTasksData] = useState(
    upcomingTasksQ.data && !axios.isAxiosError(upcomingTasksQ.data)
      ? upcomingTasksQ.data
      : null
  );
  useEffect(() => {
    setUpcomingTasksData(
      upcomingTasksQ.data && !axios.isAxiosError(upcomingTasksQ.data)
        ? upcomingTasksQ.data
        : null
    );
  }, [upcomingTasksQ.data]);
  const today = new Date();
  const filteredTasks = upcomingTasksData
    ? upcomingTasksData.tasks
        .filter(
          (task) =>
            task.due_date && new Date(task.due_date) >= today && !task.completed
        )
        .sort((a, b) => {
          const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
          const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
          return dateA - dateB;
        })
        .slice(0, 3)
    : [];
  const completedTasksQ = useQuery(
    tasksQueryOptions({
      page: 1,
      page_size: 3,
      sort_by: "completed",
      sort_type: "desc",
    })
  );
  const [completedTasksData, setCompletedTasksData] = useState(
    completedTasksQ.data && !axios.isAxiosError(completedTasksQ.data)
      ? completedTasksQ.data
      : null
  );
  useEffect(() => {
    setCompletedTasksData(
      completedTasksQ.data && !axios.isAxiosError(completedTasksQ.data)
        ? completedTasksQ.data
        : null
    );
  }, [completedTasksQ.data]);
  const filteredCompletedTasks = completedTasksData
    ? completedTasksData.tasks.filter((task) => task.completed)
    : [];
  const recentTasksQ = useQuery(
    tasksQueryOptions({
      page: 1,
      page_size: 3,
      sort_by: "created_at",
      sort_type: "desc",
    })
  );
  const [recentTasksData, setRecentTasksData] = useState(
    recentTasksQ.data && !axios.isAxiosError(recentTasksQ.data)
      ? recentTasksQ.data
      : null
  );
  useEffect(() => {
    setRecentTasksData(
      recentTasksQ.data && !axios.isAxiosError(recentTasksQ.data)
        ? recentTasksQ.data
        : null
    );
  }, [recentTasksQ.data]);

  const userQ = useQuery(userQueryOptions());
  const [userData, setUserData] = useState(
    userQ.data && !axios.isAxiosError(userQ.data) ? userQ.data : null
  );
  useEffect(() => {
    setUserData(
      userQ.data && !axios.isAxiosError(userQ.data) ? userQ.data : null
    );
  }, [userQ.data]);
  const usersQ = useQuery(usersQueryOptions({ type: "user_tasks" }));
  const [usersData, setUsersData] = useState(
    usersQ.data && !axios.isAxiosError(usersQ.data) ? usersQ.data : null
  );
  useEffect(() => {
    setUsersData(
      usersQ.data && !axios.isAxiosError(usersQ.data) ? usersQ.data : null
    );
  }, [usersQ.data]);

  const sortedUsers = usersData
    ? [...usersData]
        .sort((a, b) => b.tasks.length - a.tasks.length)
        .slice(0, 10)
    : [];

  return (
    <>
      <div
        className={`loader ${isLight ? "loader-dark" : "loader-light"} fixed top-0 right-0 m-[2px] ${dims.plus1024 ? "size-6" : "size-4"} ${usersQ.isFetching || completedTasksQ.isFetching || recentTasksQ.isFetching || upcomingTasksQ.isFetching ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`${dims.plus1024 ? "min-w-[60%] p-12" : "p-6"} ${isLight ? "text-black" : "text-white"}`}
      >
        <div className="flex md:flex-row flex-col gap-10 w-full">
          <div className="flex flex-col md:w-8/12">
            <div className="flex w-full justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">Upcoming Tasks</h1>
            </div>
            {filteredTasks && filteredTasks.length > 0 ? (
              <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-card p-4 border rounded-lg shadow-md ${isLight ? "bg-white hover:bg-blue-100/70 border-gray-300" : "bg-gray-700 hover:bg-gray-800 border-gray-600"} hover:scale-105 cursor-pointer transition-all duration-300`}
                    onClick={() =>
                      navigate({
                        to: "/app/tasks/$taskid",
                        params: { taskid: `${task.id}` },
                      })
                    }
                  >
                    <div className="text-xl font-semibold mb-2">
                      {task.title}
                    </div>
                    <p
                      className={`mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}
                    >
                      {task.description}
                    </p>
                    <p
                      className={`mb-2 ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Due Date:{" "}
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : "Not set"}
                    </p>
                    <p
                      className={`text-sm font-medium ${task.completed ? "text-green-600" : "text-red-600"}`}
                    >
                      {task.completed ? "Completed" : "Not Completed"}
                    </p>
                    <p
                      className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Created At:{" "}
                      {new Date(task.created_at).toLocaleDateString()}
                    </p>
                    <p
                      className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Updated At:{" "}
                      {new Date(task.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10">
                No <span className="font-semibold">upcoming, uncompleted</span>{" "}
                tasks found
              </div>
            )}

            <div className="flex w-full justify-between items-center my-4">
              <h1 className="text-2xl font-bold mb-4">Completed Tasks</h1>
            </div>
            {filteredCompletedTasks && filteredCompletedTasks.length > 0 ? (
              <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
                {filteredCompletedTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-card p-4 border rounded-lg shadow-md ${isLight ? "bg-white hover:bg-blue-100/70 border-gray-300" : "bg-gray-700 hover:bg-gray-800 border-gray-600"} hover:scale-105 cursor-pointer transition-all duration-300`}
                    onClick={() =>
                      navigate({
                        to: "/app/tasks/$taskid",
                        params: { taskid: `${task.id}` },
                      })
                    }
                  >
                    <div className="text-xl font-semibold mb-2">
                      {task.title}
                    </div>
                    <p
                      className={`mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}
                    >
                      {task.description}
                    </p>
                    <p
                      className={`mb-2 ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Due Date:{" "}
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : "Not set"}
                    </p>
                    <p
                      className={`text-sm font-medium ${task.completed ? "text-green-600" : "text-red-600"}`}
                    >
                      {task.completed ? "Completed" : "Not Completed"}
                    </p>
                    <p
                      className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Created At:{" "}
                      {new Date(task.created_at).toLocaleDateString()}
                    </p>
                    <p
                      className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Updated At:{" "}
                      {new Date(task.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10">
                No <span className="font-semibold">completed</span> tasks found
              </div>
            )}

            <div className="flex w-full justify-between items-center my-4">
              <h1 className="text-2xl font-bold mb-4">Recently Added Tasks</h1>
            </div>

            {recentTasksData && recentTasksData.tasks.length > 0 ? (
              <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
                {recentTasksData.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-card p-4 border rounded-lg shadow-md ${isLight ? "bg-white hover:bg-blue-100/70 border-gray-300" : "bg-gray-700 hover:bg-gray-800 border-gray-600"} hover:scale-105 cursor-pointer transition-all duration-300`}
                    onClick={() =>
                      navigate({
                        to: "/app/tasks/$taskid",
                        params: { taskid: `${task.id}` },
                      })
                    }
                  >
                    <div className="text-xl font-semibold mb-2">
                      {task.title}
                    </div>
                    <p
                      className={`mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}
                    >
                      {task.description}
                    </p>
                    <p
                      className={`mb-2 ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Due Date:{" "}
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : "Not set"}
                    </p>
                    <p
                      className={`text-sm font-medium ${task.completed ? "text-green-600" : "text-red-600"}`}
                    >
                      {task.completed ? "Completed" : "Not Completed"}
                    </p>
                    <p
                      className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Created At:{" "}
                      {new Date(task.created_at).toLocaleDateString()}
                    </p>
                    <p
                      className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Updated At:{" "}
                      {new Date(task.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10">No tasks found</div>
            )}
          </div>

          <div className="flex flex-col md:w-4/12">
            {usersData && userData ? (
              <>
                <div className="flex w-full justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold mb-4">Top Users</h1>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {sortedUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`user-card p-4 border rounded-lg shadow-md ${isLight ? "bg-white hover:bg-blue-100/70 border-gray-300" : "bg-gray-700 hover:bg-gray-800 border-gray-600"} transition-all duration-300`}
                    >
                      <h2 className="text-xl font-semibold mb-2">
                        {user.username}
                      </h2>
                      <p className="mb-2">
                        <strong>Joined:</strong>{" "}
                        {new Date(user.date_joined).toLocaleDateString()} (
                        {dayjs(user.date_joined).fromNow()})
                      </p>
                      <h3 className="text-lg font-semibold mt-4 mb-2">
                        Tasks{" "}
                        <span className="italisc text-sm">
                          (total {user.tasks.length})
                        </span>
                      </h3>
                      <ul className="list-disc list-inside">
                        {user.tasks.map((task) => {
                          const isCurrentUser = user.id === userData.id;
                          const truncatedDescription =
                            task.description.length > 20
                              ? `${task.description.slice(0, 20)}...`
                              : task.description;
                          return (
                            <li
                              key={task.id}
                              className={`mb-2 flex justify-between items-center ${isLight ? "hover:bg-gray-300" : "hover:bg-black"} rounded-md px-2 py-1 transition-all duration-300 ${isCurrentUser ? "cursor-pointer" : ""}`}
                              onClick={() => {
                                if (isCurrentUser) {
                                  navigate({
                                    to: "/app/tasks/$taskid",
                                    params: { taskid: `${task.id}` },
                                  });
                                }
                              }}
                            >
                              <div>
                                <strong>{task.title}</strong>:{" "}
                                {truncatedDescription} (Due:{" "}
                                {task.due_date
                                  ? new Date(task.due_date).toLocaleDateString()
                                  : "No due date"}
                                )
                              </div>
                              {task.completed && (
                                <CheckBox className="stroke-green-400 size-5 flex-shrink-0" />
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>No users found</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
