import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { tasksQueryOptions } from "../../../utils_fetch/fetch";
import { useContext, useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { DimensionContext, UserContext } from "../route";
import {
  DatePicker,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Switch,
} from "antd";
import {
  btnClassBase,
  btnClassBaseDark,
  btnClassPrimary,
  btnClassPrimaryDarkBlue,
} from "../../../utils_other/defaults";
import { rippleAnimation } from "../../../utils_other/helperFunctions";
import UserNotOutlined from "../../../components/svgs/userNotOutlined";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const Route = createLazyFileRoute("/app/tasks/")({
  component: TasksComponent,
});
const pageSizeOptions = [
  { value: 12, label: "12 / page" },
  { value: 30, label: "30 / page" },
  { value: 51, label: "51 / page" },
  { value: 99, label: "99 / page" },
];
const sortByOptions = [
  { value: "title", label: "Title" },
  { value: "due_date", label: "Due Date" },
  { value: "completed", label: "Completed" },
  { value: "created_at", label: "Created At" },
  { value: "updated_at", label: "Updated At" },
];
function TasksComponent() {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const dims = useContext(DimensionContext);
  const theme = useContext(UserContext).theme;
  const isLight = theme === "light";

  const navigate = useNavigate({ from: "/app/tasks" });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(12);
  const [sortBy, setSortBy] = useState<
    "title" | "due_date" | "completed" | "created_at" | "updated_at"
  >("created_at");
  const [sortType, setSortType] = useState<"asc" | "desc">("asc");
  const tasksQ = useQuery(
    tasksQueryOptions({
      page: currentPage,
      page_size: currentPageSize,
      sort_by: sortBy,
      sort_type: sortType,
    })
  );
  const [tasksData, setTasksData] = useState(
    tasksQ.data && !axios.isAxiosError(tasksQ.data) ? tasksQ.data : null
  );
  useEffect(() => {
    setTasksData(
      tasksQ.data && !axios.isAxiosError(tasksQ.data) ? tasksQ.data : null
    );
  }, [tasksQ.data]);

  const [tasksModal, setTasksModal] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  return (
    <>
      {contextHolder}
      <div
        className={`loader ${isLight ? "loader-dark" : "loader-light"} fixed top-0 right-0 m-[2px] ${dims.plus1024 ? "size-6" : "size-4"} ${tasksQ.isFetching || loadingState ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`${dims.plus1024 ? "min-w-[60%] p-12" : "p-6"} ${isLight ? "text-black" : "text-white"}`}
      >
        {tasksData ? (
          <>
            <div className="flex w-full md:flex-row flex-col justify-between items-center mb-4">
              <div className="text-2xl font-bold ">
                Tasks{" "}
                <span className="text-lg font-medium italic">
                  (Total <span>{tasksData.total_tasks}</span>)
                </span>
              </div>
              <div className="flex md:flex-row flex-col gap-2 items-center">
                <div>Sort by: </div>
                <Select
                  title="Sort By"
                  value={sortBy}
                  className="min-w-[120px]"
                  size={dims.plus550 ? "large" : "middle"}
                  options={sortByOptions}
                  onChange={(value) => {
                    setSortBy(value);
                  }}
                />
                <Select
                  title="Sort Type"
                  value={sortType}
                  className="min-w-[120px]"
                  size={dims.plus550 ? "large" : "middle"}
                  options={[
                    { value: "asc", label: "Ascending" },
                    { value: "desc", label: "Descending" },
                  ]}
                  onChange={(value) => {
                    setSortType(value);
                  }}
                />
                <button
                  className={`rounded-md px-4 py-2 ${isLight ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600" : "bg-blue-700 text-white border-gray-700 hover:bg-blue-800 hover:border-gray-600"} transition-colors duration-300`}
                  onClick={() => setTasksModal(!tasksModal)}
                >
                  Add Task
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasksData.tasks.map((task) => (
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
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-semibold mb-2">
                      {task.title}
                    </div>
                    <Popconfirm
                      title="Delete Task"
                      description="Are you sure you want to delete the selected task?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => {
                        setLoadingState(true);
                        axios
                          .delete("/api/task/", {
                            data: { id: task.id },
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
                      onPopupClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </Popconfirm>
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
                    Created At: {new Date(task.created_at).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Updated At: {new Date(task.updated_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            <div className={`flex justify-center items-center my-4 mt-16`}>
              <Pagination
                total={tasksData.total_tasks}
                defaultCurrent={currentPage}
                current={currentPage}
                defaultPageSize={currentPageSize}
                pageSize={currentPageSize}
                showSizeChanger={false}
                size={dims.plus550 ? "default" : "small"}
                showLessItems={!dims.plus375}
                onChange={(value) => {
                  setCurrentPage(value);
                }}
              />
              <Select
                title="Page Size"
                value={currentPageSize}
                // className="flex-grow"
                size={dims.plus550 ? "middle" : "small"}
                options={pageSizeOptions}
                onChange={(value) => {
                  setCurrentPage(1);
                  setCurrentPageSize(value);
                }}
              />
            </div>
            <TasksModalFC
              tasksModal={tasksModal}
              setTasksModal={setTasksModal}
            />
          </>
        ) : null}
      </div>
    </>
  );
}

interface TaskCreate {
  title: string | null;
  description: string | null;
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
const defaultCreateTaskValues: TaskCreate = {
  title: null,
  description: null,
  completed: false,
  due_date: null,
};
const defaultCreateTaskErrors: ErrorsInterface = {
  title: null,
  description: null,
  completed: null,
  due_date: null,
  global: null,
};
interface TasksModalFC {
  tasksModal: boolean;
  setTasksModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const TasksModalFC: React.FC<TasksModalFC> = ({
  tasksModal,
  setTasksModal,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const dims = useContext(DimensionContext);
  const theme = useContext(UserContext).theme;
  const isLight = theme === "light";

  const [values, setValues] = useState(defaultCreateTaskValues);
  const [errors, setErrors] = useState(defaultCreateTaskErrors);

  const [loadingState, setLoadingState] = useState(false);
  const baseBtnClassName = isLight ? btnClassBase : btnClassBaseDark;
  const primaryBtnClassName = isLight
    ? btnClassPrimary
    : btnClassPrimaryDarkBlue;
  return (
    <Modal
      open={tasksModal}
      title="Create new tag"
      onCancel={() => {
        setTasksModal(false);
        setErrors(defaultCreateTaskErrors);
      }}
      footer={
        <div
          className="flex justify-end gap-2"
          onMouseDown={(e) => e.preventDefault()}
        >
          <button
            className={baseBtnClassName + " w-[115px]"}
            onClick={(e) => {
              rippleAnimation(e, isLight);
              setTasksModal(false);
              setErrors(defaultCreateTaskErrors);
            }}
          >
            Close
          </button>
          <button
            className={primaryBtnClassName + ` min-w-[135px]`}
            disabled={loadingState}
            onClick={(e) => {
              rippleAnimation(e, isLight);
              setLoadingState(true);
              let newErr: string | null = null;
              if (!values.title) {
                setErrors((prev) => ({ ...prev, title: "Title is required" }));
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
                console.log(values);
                axios
                  .post("/api/task/create", values, { withCredentials: true })
                  .then((response: AxiosResponse<string>) => {
                    messageApi.success(response.data);
                    ["task", "tasks",'users'].forEach((key) => {
                      queryClient.invalidateQueries({
                        queryKey: [key],
                      });
                    });
                    setValues(defaultCreateTaskValues);
                    setLoadingState(false);
                    setTasksModal(false);
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
            Create
          </button>
        </div>
      }
    >
      {contextHolder}
      <div
        className={`loader ${isLight ? "loader-dark" : "loader-light"} fixed top-1/2 right-1/2 m-[2px] ${dims.plus1024 ? "size-6" : "size-4"} ${loadingState ? "opacity-100" : "opacity-0"}`}
      ></div>
      <div className={`${isLight ? "text-black" : "text-white"}`}>
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
                status={errors.title || errors.global ? "error" : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setValues((prev) => ({
                    ...prev,
                    title: value ? value : null,
                  }));
                  setErrors((prev) => ({ ...prev, title: null, global: null }));
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
                status={errors.description || errors.global ? "error" : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setValues((prev) => ({
                    ...prev,
                    description: value ? value : null,
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
      </div>
    </Modal>
  );
};
