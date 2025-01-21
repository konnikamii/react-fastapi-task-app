import { createLazyFileRoute, Link } from "@tanstack/react-router";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import "../css/index.css";
import { Input, message } from "antd";
import Password from "../components/svgs/password";
import UserNotOutlined from "../components/svgs/userNotOutlined";
import { btnClassPrimaryDarkBlue } from "../utils_other/defaults";
import { rippleAnimation } from "../utils_other/helperFunctions";
import TopNavbar from "../components/app/TopNavbar";
import CookiesFC from "../components/app/Cookies";
import BubblesBg from "../components/app/BubblesBg";
import useInteractiveBubble from "../hooks/useInteractiveBubble";
import useMediaQueries from "../hooks/useMediaQueries";
import useTheme from "../hooks/useTheme";
export const Route = createLazyFileRoute("/login")({
  component: Login,
});

interface LoginValues {
  username: string | null;
  password: string | null;
}
interface LoginErrors {
  username: string | null;
  password: string | null;
  global: string | null;
  google: string | null;
}
const defaultValues: LoginValues = { username: null, password: null };
const defaultErrors: LoginErrors = {
  username: null,
  password: null,
  global: null,
  google: null,
};
function Login() {
  // const navigate = useNavigate({ from: '/login' })
  const [messageApi, contextHolder] = message.useMessage();
  const dims = useMediaQueries();
  const { theme, setTheme, isLight } = useTheme();
  const [loadingState, setLoadingState] = useState(false);

  const [values, setValues] = useState<LoginValues>(defaultValues);
  const [errors, setErrors] = useState<LoginErrors>(defaultErrors);

  const handleEnterSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  const handleSubmit = () => {
    setLoadingState(true);
    if (!values.username) {
      setErrors((prev) => ({
        ...prev,
        username: "Please provide your username or email!",
      }));
    }
    if (!values.password) {
      setErrors((prev) => ({
        ...prev,
        password: "Please provide your password!",
      }));
    }
    if (
      values.username &&
      values.password &&
      !errors.username &&
      !errors.password
    ) {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("password", values.password);
      axios
        .post("/api/login/", formData)
        .then((response: AxiosResponse<string>) => {
          messageApi.success(response.data);
          setLoadingState(false);
          window.location.href = "/app";
        })
        .catch((error: AxiosError<string>) => {
          const res = error.response;
          if (res) {
            messageApi.error(res.data);
            setErrors((prev) => ({ ...prev, global: res.data }));
          } else {
            messageApi.error("An unexpected error occurred.");
            setErrors((prev) => ({
              ...prev,
              global: "An unexpected error occurred.",
            }));
          }
          setTimeout(() => {
            setLoadingState(false);
          }, 1000);
        });
    } else {
      setTimeout(() => {
        setLoadingState(false);
      }, 500);
    }
  };
  useInteractiveBubble(".interactive");
  return (
    <>
      {contextHolder}
      <TopNavbar theme={theme} setTheme={setTheme} dims={dims} />
      <BubblesBg />
      <div
        className={`flex flex-col items-center justify-center gap-10 py-[90px] px-2 w-full h-fit min-h-screen ${isLight ? "bg-gray-900 bg-opacity-20" : "bg-gray-800 bg-opacity-60"} transition-colors duration-300 overflow-y-auto relative`}
      >
        <div className="absolute w-full h-full overflow-hidden pointer-events-none">
          <div className="w-full h-full relative overflow-hidden pointer-events-none">
            <div
              className={`scaling-up-side absolute top-0 left-0 translate-x-[-75%] h-full bg-[#c83bf3] rounded-full filter blur-[30px] ${isLight ? "opacity-60 w-[7px] mix-blend-darken" : "opacity-20 w-[5px] mix-blend-lighten"}`}
            />
            <div
              className={`scaling-up-side absolute top-0 right-0 translate-x-[75%] h-full bg-[#c83bf3] rounded-full filter blur-[30px] ${isLight ? "opacity-60 w-[7px] mix-blend-darken" : "opacity-20 w-[5px] mix-blend-lighten"}`}
            />
          </div>
        </div>

        <div
          className={`flex flex-col ${dims.plus550 ? "w-[430px]" : "w-auto"} px-10 py-4 rounded-xl border shadow-lg transition-all duration-300 ${isLight ? "border-gray-400 bg-gray-200/60 shadow-gray-500 hover:shadow-gray-400" : "border-gray-600 bg-white/45 shadow-gray-500/40"} backdrop-blur-lg relative overflow-hidden`}
        >
          <div className="w-full flex flex-col items-center py-6 font-bold text-3xl">
            Login
          </div>
          <div onClick={() => {
                    setValues((prev) => ({
                      ...prev,
                      username: 'konnik',
                      password: 'qwerty123',
                    }));
          }}>demo</div>
          <div className="flex flex-col gap-3 mb-6">
            <div className="relative size-full">
              <div
                className={`font-semibold mb-2 ${dims.plus1440 ? "text-lg" : "text-base"}`}
              >
                Username
              </div>
              <div className="relative size-full">
                <Input
                  value={values.username ?? ""}
                  className="rounded-xl"
                  size="large"
                  placeholder="Username/Email"
                  prefix={
                    <UserNotOutlined className="size-4 stroke-black opacity-40" />
                  }
                  allowClear
                  maxLength={200}
                  status={errors.username || errors.global ? "error" : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s+/g, "");
                    setValues((prev) => ({
                      ...prev,
                      username: value ? value : null,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      username: null,
                      global: null,
                    }));
                  }}
                  onKeyDown={handleEnterSubmit}
                />
              </div>
              <div
                className={`pt-[2px] text-sm text-red-600 transition-all duration-300 ${errors.username || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
              >
                {errors.username ?? errors.global}
              </div>
            </div>

            <div className="relative size-full">
              <div
                className={`font-semibold mb-2 text-black ${dims.plus1440 ? "text-lg" : "text-base"}`}
              >
                Password
              </div>
              <div className="relative size-full">
                <Input.Password
                  value={values.password ?? ""}
                  className="rounded-xl"
                  size="large"
                  placeholder={"Password"}
                  prefix={
                    <Password className="size-5 stroke-black opacity-40" />
                  }
                  type="password"
                  allowClear
                  maxLength={200}
                  status={errors.password || errors.global ? "error" : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s+/g, "");
                    setValues((prev) => ({
                      ...prev,
                      password: value ? value : null,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      password: null,
                      global: null,
                    }));
                  }}
                  onKeyDown={handleEnterSubmit}
                />
              </div>
              <div
                className={`pt-[2px] text-sm text-red-600 transition-all duration-300 ${errors.password || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
              >
                {errors.password ?? errors.global}
              </div>
            </div>
          </div>
          <button
            className={
              btnClassPrimaryDarkBlue +
              ` py-[6px] w-full flex justify-center mb-1 mt-4 ${isLight ? "" : "shadow-gray-500 border-gray-600"}`
            }
            disabled={
              errors.username
                ? true
                : false || errors.password
                  ? true
                  : false || errors.global
                    ? true
                    : false || loadingState
            }
            onClick={(e) => {
              rippleAnimation(e, isLight, 1300);
              handleSubmit();
            }}
          >
            <div className="relative">
              <div
                className={`loader ${isLight ? "loader-dark" : "loader-light"} absolute top-0 left-[-32px] size-6 ${loadingState ? "opacity-100" : "opacity-0"}`}
              />
              Log In
            </div>
          </button>

          <div className={`text-sm text-gray-900 text-center mb-6`}>
            Don&apos;t have an account? -----{" "}
            <Link to="/register" draggable="false">
              <span className="text-blue-700 hover:underline underline-offset-2 cursor-pointer">
                Sign up!
              </span>
            </Link>
          </div>
        </div>
      </div>
      <CookiesFC theme={theme} />
    </>
  );
}
