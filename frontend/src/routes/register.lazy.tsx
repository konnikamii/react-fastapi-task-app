import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import "../css/index.css";
import { Input, message } from "antd";
import Password from "../components/svgs/password";
import UserNotOutlined from "../components/svgs/userNotOutlined";
import { btnClassPrimaryDarkBlue } from "../utils_other/defaults";
import {
  rippleAnimation,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils_other/helperFunctions";
import Email from "../components/svgs/email";
import TopNavbar from "../components/app/TopNavbar";
import CookiesFC from "../components/app/Cookies";
import BubblesBg from "../components/app/BubblesBg";
import useInteractiveBubble from "../hooks/useInteractiveBubble";
import useMediaQueries from "../hooks/useMediaQueries";
import useTheme from "../hooks/useTheme";

export const Route = createLazyFileRoute("/register")({
  component: Register,
});

interface RegisterValues {
  username: string | null;
  email: string | null;
  password: string | null;
  confirm_password: string | null;
}
interface RegisterErrors {
  username: string | null;
  email: string | null;
  password: string | null;
  confirm_password: string | null;
  global: string | null;
}
const defaultValues: RegisterValues = {
  username: null,
  email: null,
  password: null,
  confirm_password: null,
};
const defaultErrors: RegisterErrors = {
  username: null,
  email: null,
  password: null,
  confirm_password: null,
  global: null,
};
function Register() {
  const navigate = useNavigate({ from: "/register" });
  const [messageApi, contextHolder] = message.useMessage();
  const dims = useMediaQueries();
  const { theme, setTheme, isLight } = useTheme();
  const [loadingState, setLoadingState] = useState(false);

  const [values, setValues] = useState<RegisterValues>(defaultValues);
  const [errors, setErrors] = useState<RegisterErrors>(defaultErrors);

  const handleEnterSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  const handleSubmit = () => {
    setLoadingState(true);
    const usernameErr = validateUsername(values.username);
    const emailErr = validateEmail(values.email);
    const passwordErr = validatePassword(values.password);
    const confirmPasswordErr = values.confirm_password
      ? values.password === values.confirm_password
        ? null
        : "The passwords do not match!"
      : "Please confirm your password!";
    if (usernameErr) {
      setErrors((prev) => ({ ...prev, username: usernameErr }));
    }
    if (emailErr) {
      setErrors((prev) => ({ ...prev, email: emailErr }));
    }
    if (passwordErr) {
      setErrors((prev) => ({ ...prev, password: passwordErr }));
    }
    if (confirmPasswordErr) {
      setErrors((prev) => ({ ...prev, confirm_password: confirmPasswordErr }));
    }
    if (
      values.username &&
      values.email &&
      values.password &&
      values.confirm_password &&
      !usernameErr &&
      !emailErr &&
      !passwordErr &&
      !confirmPasswordErr
    ) {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      axios
        .post("/api/user/", formData)
        .then((response: AxiosResponse<string>) => {
          messageApi.success(response.data);
          setLoadingState(false);
          navigate({ to: "/login" });
        })
        .catch((error: AxiosError<Record<string, string>>) => {
          const res = error.response;
          if (res) {
            messageApi.error("Validation Error");
            const newErr = res.data.detail;
            if (newErr.includes('email')) {
              setErrors((prev) => ({ ...prev, email: newErr }));
            } else if (newErr.includes('assword')) {
              setErrors((prev) => ({ ...prev, password: newErr }));
            } else if (newErr.includes('sername')) {
              setErrors((prev) => ({ ...prev, username: newErr }));
            } else {
              setErrors((prev) => ({ ...prev, global: newErr }));
            }
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
            Sign Up
          </div>
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
                  placeholder="Username"
                  id="fname"
                  name="fname"
                  prefix={
                    <UserNotOutlined className="size-4 stroke-black opacity-40" />
                  }
                  allowClear
                  maxLength={200}
                  status={errors.username || errors.global ? "error" : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s+/g, ""); // removes whitespaces
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
                className={`font-semibold mb-2 ${dims.plus1440 ? "text-lg" : "text-base"}`}
              >
                Email
              </div>
              <div className="relative size-full">
                <Input
                  value={values.email ?? ""}
                  className="rounded-xl"
                  size="large"
                  placeholder="Email"
                  type="email"
                  prefix={<Email className="size-5 stroke-black opacity-40" />}
                  allowClear
                  maxLength={200}
                  status={errors.email || errors.global ? "error" : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s+/g, "");
                    setValues((prev) => ({
                      ...prev,
                      email: value ? value : null,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      email: null,
                      global: null,
                    }));
                  }}
                  onKeyDown={handleEnterSubmit}
                />
              </div>
              <div
                className={`pt-[2px] text-sm text-red-600 transition-all duration-300 ${errors.email || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
              >
                {errors.email ?? errors.global}
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

            <div className="relative size-full">
              <div
                className={`font-semibold mb-2 text-black ${dims.plus1440 ? "text-lg" : "text-base"}`}
              >
                Confirm Password
              </div>
              <div className="relative size-full">
                <Input.Password
                  value={values.confirm_password ?? ""}
                  className="rounded-xl"
                  size="large"
                  placeholder={"Confirm Password"}
                  prefix={
                    <Password className="size-5 stroke-black opacity-40" />
                  }
                  type="password"
                  allowClear
                  maxLength={200}
                  status={
                    errors.confirm_password || errors.global ? "error" : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s+/g, "");
                    setValues((prev) => ({
                      ...prev,
                      confirm_password: value ? value : null,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      confirm_password: null,
                      global: null,
                    }));
                  }}
                  onKeyDown={handleEnterSubmit}
                />
              </div>
              <div
                className={`pt-[2px] text-sm text-red-600 transition-all duration-300 ${errors.confirm_password || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
              >
                {errors.confirm_password ?? errors.global}
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
                : false || errors.email
                  ? true
                  : false || errors.password
                    ? true
                    : false || errors.confirm_password
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
              Create Account
            </div>
          </button>

          <div className={`text-sm text-gray-900 text-center mb-6`}>
            Already have an account? -----{" "}
            <Link to="/login" draggable="false">
              <span className="text-blue-700 hover:underline underline-offset-2 cursor-pointer">
                Log in!
              </span>
            </Link>
          </div>
          <div className="text-xs text-gray-600 text-justify text-pretty mb-3">
            By creating an account, you agree to Taskify&apos;s{" "}
            <a
              href="/tos"
              className="text-black hover:underline cursor-pointer"
              draggable="false"
            >
              Terms of Service
            </a>{" "}
            and confirm that you have read our{" "}
            <a
              href="/privacy"
              className="text-black hover:underline cursor-pointer"
              draggable="false"
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
      <CookiesFC theme={theme} />
    </>
  );
}
