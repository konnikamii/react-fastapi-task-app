import { createLazyFileRoute } from "@tanstack/react-router";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import "../css/index.css";
import { Input, message } from "antd";
import { btnClassPrimaryDarkBlue } from "../utils_other/defaults";
import { rippleAnimation, validateEmail } from "../utils_other/helperFunctions";
import TopNavbar from "../components/app/TopNavbar";
import CookiesFC from "../components/app/Cookies";
import BubblesBg from "../components/app/BubblesBg";
import useInteractiveBubble from "../hooks/useInteractiveBubble";
import useMediaQueries from "../hooks/useMediaQueries";
import useTheme from "../hooks/useTheme";

export const Route = createLazyFileRoute("/contact")({
  component: Contact,
});

interface ContactValues {
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
}
interface ContactErrors {
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  global: string | null;
}
const defaultValues: ContactValues = {
  name: null,
  email: null,
  subject: null,
  message: null,
};
const defaultErrors: ContactErrors = {
  name: null,
  email: null,
  subject: null,
  message: null,
  global: null,
};
function Contact() {
  const [messageApi, contextHolder] = message.useMessage();
  const dims = useMediaQueries();
  const { theme, setTheme, isLight } = useTheme();
  const [loadingState, setLoadingState] = useState(false);

  const [values, setValues] = useState<ContactValues>(defaultValues);
  const [errors, setErrors] = useState<ContactErrors>(defaultErrors);

  const handleEnterSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  const handleSubmit = () => {
    setLoadingState(true);
    const nameErr = !values.name ? "Name is required" : null;
    const emailErr = validateEmail(values.email);
    const subjectErr = !values.subject ? "Subject is required" : null;
    const messageErr = !values.message ? "Message is required" : null;
    if (nameErr) {
      setErrors((prev) => ({ ...prev, name: nameErr }));
    }
    if (emailErr) {
      setErrors((prev) => ({ ...prev, email: emailErr }));
    }
    if (subjectErr) {
      setErrors((prev) => ({ ...prev, subject: subjectErr }));
    }
    if (messageErr) {
      setErrors((prev) => ({ ...prev, message: messageErr }));
    }
    if (
      values.name &&
      values.email &&
      values.subject &&
      values.message &&
      !nameErr &&
      !emailErr &&
      !subjectErr &&
      !messageErr
    ) {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("subject", values.subject);
      formData.append("message", values.message);
      axios
        .post("/api/contact/", formData)
        .then((response: AxiosResponse<{ detail: string }>) => {
          console.log(response.data);
          messageApi.success(response.data.detail, 3);
          setValues(defaultValues);
          setErrors(defaultErrors);
          setTimeout(() => {
            setLoadingState(false);
          }, 500);
        })
        .catch((error: AxiosError<string>) => {
          const res = error.response;
          if (res) {
            console.log(res);
            messageApi.error(res.data ?? "Validation error");
            const newErr = res.data;
            if (newErr.startsWith('Name')) {
              setErrors((prev) => ({ ...prev, name: newErr }));
            } else if (newErr.startsWith('Email')) {
              setErrors((prev) => ({ ...prev, email: newErr }));
            } else if (newErr.startsWith('Subject')) {
              setErrors((prev) => ({ ...prev, subject: newErr }));
            } else if (newErr.startsWith('Message')) {
              setErrors((prev) => ({ ...prev, message: newErr }));
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
            Contact Form
          </div>
          <div className="flex flex-col gap-3 mb-6">
            <div className="relative size-full">
              <div
                className={`font-semibold mb-1 ${dims.plus1440 ? "text-lg" : "text-base"}`}
              >
                Name:
              </div>
              <div className="relative size-full">
                <Input
                  value={values.name ?? ""}
                  className="rounded-md"
                  size="large"
                  id="fname"
                  name="fname"
                  allowClear
                  maxLength={200}
                  status={errors.name || errors.global ? "error" : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValues((prev) => ({
                      ...prev,
                      name: value ? value : null,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      name: null,
                      global: null,
                    }));
                  }}
                  onKeyDown={handleEnterSubmit}
                />
              </div>
              <div
                className={`pt-[2px] text-sm text-red-600 transition-all duration-300 ${errors.name || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
              >
                {errors.name ?? errors.global}
              </div>
            </div>

            <div className="relative size-full">
              <div
                className={`font-semibold mb-1 ${dims.plus1440 ? "text-lg" : "text-base"}`}
              >
                Email:
              </div>
              <div className="relative size-full">
                <Input
                  value={values.email ?? ""}
                  className="rounded-md"
                  size="large"
                  type="email"
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
                className={`font-semibold mb-1 text-black ${dims.plus1440 ? "text-lg" : "text-base"}`}
              >
                Subject
              </div>
              <div className="relative size-full">
                <Input
                  value={values.subject ?? ""}
                  className="rounded-md"
                  size="large"
                  type="text"
                  allowClear
                  maxLength={200}
                  status={errors.subject || errors.global ? "error" : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValues((prev) => ({
                      ...prev,
                      subject: value ? value : null,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      subject: null,
                      global: null,
                    }));
                  }}
                  onKeyDown={handleEnterSubmit}
                />
              </div>
              <div
                className={`pt-[2px] text-sm text-red-600 transition-all duration-300 ${errors.subject || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
              >
                {errors.subject ?? errors.global}
              </div>
            </div>

            <div className="relative size-full">
              <div
                className={`font-semibold mb-1 text-black ${dims.plus1440 ? "text-lg" : "text-base"}`}
              >
                Message:
              </div>
              <div className="relative size-full">
                <Input.TextArea
                  value={values.message ?? ""}
                  className="rounded-md"
                  size="large"
                  allowClear
                  maxLength={1500}
                  showCount
                  status={errors.message || errors.global ? "error" : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValues((prev) => ({
                      ...prev,
                      message: value ? value : null,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      message: null,
                      global: null,
                    }));
                  }}
                  onKeyDown={handleEnterSubmit}
                />
              </div>
              <div
                className={`pt-[2px] text-sm w-9/12 text-red-600 transition-all duration-300 ${errors.message || errors.global ? "max-h-40" : "max-h-0"} overflow-hidden`}
              >
                {errors.message ?? errors.global}
              </div>
            </div>
          </div>

          <button
            className={
              btnClassPrimaryDarkBlue +
              ` py-[6px] w-full flex justify-center mb-1 mt-4 ${isLight ? "" : "shadow-gray-500 border-gray-600"}`
            }
            disabled={
              errors.name
                ? true
                : false || errors.email
                  ? true
                  : false || errors.subject
                    ? true
                    : false || errors.message
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
              Send
            </div>
          </button>
        </div>
      </div>
      <CookiesFC theme={theme} />
    </>
  );
}
