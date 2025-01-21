import axios, { AxiosError } from "axios";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
  TasksGet,
  UsersGet,
  TasksIdGet,
  User,
  UserTasks,
  TasksIn,
  Task,
} from "../utils_other/types";

const staleTime = 1000 * 60 * 30; //fetch every 30 minutes

// -------------------------- User -------------------------- //
export const fetchUser = () => {
  console.log("fetching user");
  return axios
    .get<User>(`/api/user/`, {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
      return error;
    });
};
export const userQueryOptions = () => {
  return queryOptions({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: staleTime, //fetch every minute
    placeholderData: keepPreviousData,
  });
};
export const fetchUsers = ({ type }: UsersGet) => {
  console.log("fetching users", type);
  return axios
    .post<UserTasks[]>(
      `/api/users/`,
      { type },
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
      return error;
    });
};
export const usersQueryOptions = ({ type }: UsersGet) => {
  return queryOptions({
    queryKey: ["users", type],
    queryFn: () => fetchUsers({ type }),
    staleTime: staleTime, //fetch every minute
    placeholderData: keepPreviousData,
  });
};
// -------------------------- Tasks -------------------------- //
export const fetchTasks = ({
  page,
  page_size,
  sort_by,
  sort_type,
}: TasksGet) => {
  console.log("fetching tasks");
  return axios
    .post<TasksIn>(
      `/api/tasks/`,
      { page, page_size, sort_by, sort_type },
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
      return error;
    });
};
export const tasksQueryOptions = ({
  page,
  page_size,
  sort_by,
  sort_type,
}: TasksGet) => {
  return queryOptions({
    queryKey: ["tasks", page, page_size, sort_by, sort_type],
    queryFn: () => fetchTasks({ page, page_size, sort_by, sort_type }),
    staleTime: staleTime, //fetch every minute
    placeholderData: keepPreviousData,
  });
};
export const fetchTaskId = ({ id }: TasksIdGet) => {
  console.log("fetching task with id:", id);
  return axios
    .post<Task>(
      `/api/task/`,
      { id },
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
      return error;
    });
};
export const taskIdQueryOptions = ({ id }: TasksIdGet) => {
  return queryOptions({
    queryKey: ["taskid", id],
    queryFn: () => fetchTaskId({ id }),
    staleTime: staleTime, // fetch every minute
    placeholderData: keepPreviousData,
  });
};
