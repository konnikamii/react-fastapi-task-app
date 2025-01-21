import {
  createLazyFileRoute,
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import NotFoundFC from "../../../components/app/NotFound";
import { useContext, useEffect, useState } from "react";
import { DimensionContext, UserContext } from "../route";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { taskIdQueryOptions } from "../../../utils_fetch/fetch";
import axios, { AxiosError, AxiosResponse } from "axios";
import { DatePicker, Empty, Input, message, Popconfirm, Switch } from "antd";
import {
  btnClassBase,
  btnClassBaseDark,
  btnClassPrimary,
  btnClassPrimaryDarkBlue,
} from "../../../utils_other/defaults";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import UserNotOutlined from "../../../components/svgs/userNotOutlined";
import { rippleAnimation } from "../../../utils_other/helperFunctions";
dayjs.extend(customParseFormat);

export const Route = createLazyFileRoute("/app/tasks/$taskid")({
  component: TaskIdComponent,
  notFoundComponent: NotFoundFC,
});

interface TaskUpdate {
  title: string;
  description: string;
  completed: boolean;
  due_date: string | null;
}
interface ErrorsInterface {
  title: string | null;
  description: string | null;
  completed: string | null;
  due_date: string | null;
  global: string | null;
}
const defaultUpdateTaskValues: TaskUpdate = {
  title: "",
  description: "",
  completed: false,
  due_date: null,
};
const defaultUpdateTaskErrors: ErrorsInterface = {
  title: null,
  description: null,
  completed: null,
  due_date: null,
  global: null,
};
function TaskIdComponent() {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const dims = useContext(DimensionContext);
  const theme = useContext(UserContext).theme;
  const isLight = theme === "light";
  const id = useParams({ from: "/app/tasks/$taskid" });
  const tasksidQ = useQuery(taskIdQueryOptions({ id: +id.taskid }));

  const navigate = useNavigate({ from: "/app/tasks/$taskid" });
  const [taskData, setTaskData] = useState(
    tasksidQ.data && !axios.isAxiosError(tasksidQ.data) ? tasksidQ.data : null
  );
  useEffect(() => {
    setTaskData(
      tasksidQ.data && !axios.isAxiosError(tasksidQ.data) ? tasksidQ.data : null
    );
    setValues(
      tasksidQ.data && !axios.isAxiosError(tasksidQ.data)
        ? {
            title: tasksidQ.data.title,
            description: tasksidQ.data.description,
            completed: tasksidQ.data.completed,
            due_date: tasksidQ.data.due_date,
          }
        : defaultUpdateTaskValues
    );
  }, [tasksidQ.data]);

  const [values, setValues] = useState(defaultUpdateTaskValues);
  const [errors, setErrors] = useState(defaultUpdateTaskErrors);
  const [loadingState, setLoadingState] = useState(false);

  const baseBtnClassName = isLight ? btnClassBase : btnClassBaseDark;
  const primaryBtnClassName = isLight
    ? btnClassPrimary
    : btnClassPrimaryDarkBlue;
  return (
    <>
      {contextHolder}
      <div
        className={`loader ${isLight ? "loader-dark" : "loader-light"} fixed top-0 right-0 m-[2px] ${dims.plus1024 ? "size-6" : "size-4"} ${tasksidQ.isFetching || loadingState ? "opacity-100" : "opacity-0"}`}
      />
      <div className={`${dims.plus1024 ? "min-w-[60%] p-12" : "p-6"}`}>
        {taskData ? (
          <div
            className={`task-details p-4 border rounded-lg shadow-md ${isLight ? "bg-slate-50 border-gray-300" : "bg-slate-800 border-gray-700"}`}
          >
            <div className="flex flex-col gap-3 mb-6">
              <div className="relative size-full">
                <div
                  className={`font-semibold mb-2 ${dims.plus1440 ? "text-lg" : "text-base"}`}
                >
                  Title
                </div>
                <div className="relative size-full">
                  <Input
                    value={values.title ?? ""}
                    className="rounded-md"
                    size="large"
                    placeholder="Title"
                    prefix={
                      <UserNotOutlined
                        className={`size-4 ${isLight ? "stroke-black" : "stroke-white"} opacity-40`}
                      />
                    }
                    allowClear
                    maxLength={200}
                    status={
                      errors.title || errors.global
                        ? "error"
                        : values.title !== taskData.title
                          ? "warning"
                          : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setValues((prev) => ({
                        ...prev,
                        title: value ? value : "",
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        title: null,
                        global: null,
                      }));
                    }}
                  />
                </div>
                <div
                  className={`pt-[2px] text-sm text-red-600 transition-all duration-300 ${errors.title || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
                >
                  {errors.title ?? errors.global}
                </div>
              </div>

              <div className="relative size-full">
                <div
                  className={`font-semibold mb-2 ${dims.plus1440 ? "text-lg" : "text-base"}`}
                >
                  Description
                </div>
                <div className="relative size-full">
                  <Input.TextArea
                    value={values.description ?? ""}
                    className="rounded-md"
                    size="large"
                    placeholder="Description" 
                    allowClear
                    maxLength={1500}
                    showCount
                    status={
                      errors.description || errors.global
                        ? "error"
                        : values.description !== taskData.description
                          ? "warning"
                          : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setValues((prev) => ({
                        ...prev,
                        description: value ? value : "",
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        description: null,
                        global: null,
                      }));
                    }}
                  />
                </div>
                <div
                  className={`pt-[2px] text-sm text-red-600 transition-all duration-300 ${errors.description || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
                >
                  {errors.description ?? errors.global}
                </div>
              </div>

              <div className="relative size-full">
                <div
                  className={`font-semibold mb-2 ${dims.plus1440 ? "text-lg" : "text-base"}`}
                >
                  Completed
                </div>
                <div className="relative size-full">
                  <Switch
                    value={values.completed ?? false}
                    className="w-fit"
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, completed: e }));
                      setErrors((prev) => ({
                        ...prev,
                        completed: null,
                        global: null,
                      }));
                    }}
                  />
                </div>
                <div
                  className={`pt-[2px] text-sm text-red-600 transition-all duration-300 ${errors.completed || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
                >
                  {errors.completed ?? errors.global}
                </div>
              </div>

              <div className="relative size-full">
                <div
                  className={`font-semibold mb-2 ${dims.plus1440 ? "text-lg" : "text-base"}`}
                >
                  Due Date
                </div>
                <div className="relative size-full">
                  <DatePicker
                    title="due_date"
                    value={values.due_date ? dayjs(values.due_date) : null}
                    className=""
                    placeholder="Select Date"
                    size={"middle"}
                    inputReadOnly
                    status={
                      values.due_date !== taskData.due_date ? "warning" : ""
                    }
                    minDate={dayjs("1976-01-01", "YYYY-MM-DD")}
                    onChange={(value) => {
                      setValues((prev) => ({
                        ...prev,
                        due_date: value ? value.format("YYYY-MM-DD") : null,
                      }));
                    }}
                  />
                </div>
                <div
                  className={`pt-[2px] text-sm text-red-600 transition-all duration-300 ${errors.due_date || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
                >
                  {errors.due_date ?? errors.global}
                </div>
              </div>
            </div>

            <p className="mb-2">
              <strong>Created At:</strong>{" "}
              {new Date(taskData.created_at).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>Last Updated At:</strong>{" "}
              {new Date(taskData.updated_at).toLocaleString()}
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className={baseBtnClassName + ` w-[115px]`}
                disabled={
                  values.title === taskData.title &&
                  values.description === taskData.description &&
                  values.completed === taskData.completed &&
                  values.due_date === taskData.due_date
                }
                onClick={(e) => {
                  rippleAnimation(e, isLight);
                  setLoadingState(true);
                  let newErr: string | null = null;
                  if (!values.title) {
                    setErrors((prev) => ({
                      ...prev,
                      title: "Title is required",
                    }));
                    newErr = "err";
                  }
                  if (!values.description) {
                    setErrors((prev) => ({
                      ...prev,
                      description: "Description is required",
                    }));
                    newErr = "err";
                  }
                  if (newErr) {
                    setTimeout(() => {
                      setLoadingState(false);
                    }, 500);
                    setErrors((prev) => ({ ...prev, tag_name: newErr }));
                  } else {
                    axios
                      .put(
                        "/api/task/",
                        { ...values, id: taskData.id },
                        { withCredentials: true }
                      )
                      .then((response: AxiosResponse<string>) => {
                        messageApi.success(response.data);
                        ["task", "tasks", "taskid",'users'].forEach((key) => {
                          queryClient.invalidateQueries({
                            queryKey: [key],
                          });
                        });
                        setLoadingState(false);
                      })
                      .catch((error: AxiosError<Record<string, string>>) => {
                        if (error.response) {
                          if (error.response.status === 401) {
                            window.location.href = "/login";
                          }
                          messageApi.error("There was a validation error");
                          console.log(error.response.data);
                        } else {
                          messageApi.error("An unexpected error occurred.");
                          newErr = "An unexpected error occurred.";
                        }
                        setErrors((prev) => ({ ...prev, tag_name: newErr }));
                        setTimeout(() => {
                          setLoadingState(false);
                        }, 1000);
                      });
                  }
                }}
              >
                Update Task
              </button>
              <Popconfirm
                title="Delete Task"
                description="Are you sure you want to delete the selected task?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  setLoadingState(true);
                  axios
                    .delete("/api/task/", {
                      data: { id: taskData.id },
                      withCredentials: true,
                    })
                    .then((response: AxiosResponse<string>) => {
                      messageApi.success(response.data);
                      ["task", "tasks",'users'].forEach((key) => {
                        queryClient.invalidateQueries({
                          queryKey: [key],
                        });
                      });
                      setLoadingState(false);
                      navigate({ to: "/app/tasks" });
                    })
                    .catch((error: AxiosError<{ detail: string }>) => {
                      if (error.response) {
                        if (error.response.status === 401) {
                          window.location.href = "/login";
                        }
                        messageApi.error("There was a validation error");
                        console.log(error.response.data.detail);
                      } else {
                        messageApi.error("An unexpected error occurred.");
                      }
                      setTimeout(() => {
                        setLoadingState(false);
                      }, 1000);
                    });
                }}
              >
                <button
                  className={`rounded-md px-4 py-2 ${isLight ? "bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600" : "bg-red-700 text-white border-red-700 hover:bg-red-600 hover:border-red-600"} transition-colors duration-300`}
                  onClick={() => {}}
                >
                  Delete Task
                </button>
              </Popconfirm>
            </div>
          </div>
        ) : (
          <div className="h-screen flex-col justify-center">
            <Empty description="No task found with this id." />

            <div className="flex justify-center mt-2">
              <Link
                to="/app/tasks"
                className={primaryBtnClassName}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
              >
                Back to Tasks
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
