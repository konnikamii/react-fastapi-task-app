import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Input, message, Tooltip } from "antd";
import { DimensionContext, UserContext } from "../route";
import { useContext, useEffect, useState } from "react";
import { userQueryOptions } from "../../../utils_fetch/fetch";
import axios, { AxiosError, AxiosResponse } from "axios";
import { btnClassBase, btnClassBaseDark } from "../../../utils_other/defaults";
import UserNotOutlined from "../../../components/svgs/userNotOutlined";
import Email from "../../../components/svgs/email";
import Password from "../../../components/svgs/password";
import {
  rippleAnimation,
  validatePassword,
} from "../../../utils_other/helperFunctions";
import Info from "../../../components/svgs/info";

export const Route = createLazyFileRoute("/app/user/")({
  component: UserComponent,
});

interface currentUserProp {
  old_password: string | null;
  new_password: string | null;
  confirm_password: string | null;
}
const defaultUser: currentUserProp = {
  old_password: null,
  new_password: null,
  confirm_password: null,
};
function UserComponent() {
  const [messageApi, contextHolder] = message.useMessage();
  const dims = useContext(DimensionContext);
  const theme = useContext(UserContext).theme;
  const isLight = theme === "light";
  const userQ = useQuery(userQueryOptions());
  const [userData, setUserData] = useState(
    userQ.data && !axios.isAxiosError(userQ.data) ? userQ.data : null
  );
  useEffect(() => {
    setUserData(
      userQ.data && !axios.isAxiosError(userQ.data) ? userQ.data : null
    );
  }, [userQ.data]);

  const [currentUser, setCurrentUser] = useState<currentUserProp>(defaultUser);
  const [userErr, setUserErr] = useState(defaultUser);

  const [loadingState, setLoadingState] = useState(false);

  const userIconsClassName = `size-4 ${isLight ? "stroke-black" : "stroke-white"}`;
  const infoSvgClassName = `size-4 ${isLight ? "stroke-black fill-black opacity-45" : "stroke-white fill-white"}`;
  const baseBtnClassName = isLight ? btnClassBase : btnClassBaseDark;
  return (
    <>
      {contextHolder}
      <div
        className={`loader ${isLight ? "loader-dark" : "loader-light"} fixed top-0 right-0 m-[2px] ${dims.plus1024 ? "size-6" : "size-4"} ${userQ.isFetching || loadingState ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`${dims.plus1024 ? "min-w-[60%] p-12" : "p-6"} ${isLight ? "text-black" : "text-white"}`}
      >
        {userData ? (
          <div
            className={`flex flex-col gap-10 p-2 ${dims.plus1440 ? "w-1/3" : dims.plus1024 ? "w-1/2" : "w-full"}`}
          >
            <div className="w-full">
              <div
                className={`font-semibold mb-3 ${dims.plus1440 ? "text-lg" : "text-base"}`}
              >
                Username
              </div>
              <Input
                placeholder={userData.username}
                prefix={
                  <UserNotOutlined
                    className={userIconsClassName + ` size-[14px] opacity-25`}
                  />
                }
                suffix={
                  <Tooltip title="Currently it is not possible to change your username. Contact us if you want this feature unlocked.">
                    <div>
                      <Info className={infoSvgClassName} />
                    </div>
                  </Tooltip>
                }
                disabled
              />
            </div>
            <div className="w-full">
              <div className="flex gap-2 items-center mb-3">
                <div
                  className={`font-semibold ${dims.plus1440 ? "text-lg" : "text-base"}`}
                >
                  Email
                </div>
                <Tooltip title="Email not verified! Please verify your email.">
                  <div>
                    <Info
                      className={"size-4 stroke-orange-600 fill-orange-600"}
                    />
                  </div>
                </Tooltip>
              </div>
              <Input
                placeholder={userData.email}
                prefix={
                  <Email className={userIconsClassName + ` opacity-25`} />
                }
                suffix={
                  <Tooltip title="Currently it is not possible to change your email address. Contact us if you want this feature unlocked.">
                    <div>
                      <Info className={infoSvgClassName} />
                    </div>
                  </Tooltip>
                }
                disabled
              />
            </div>
            <div className="w-full flex flex-col">
              <div className="flex gap-2 items-center mb-3">
                <div
                  className={`font-semibold ${dims.plus1440 ? "text-lg" : "text-base"}`}
                >
                  Passoword
                </div>
              </div>
              <div className="relative size-full mb-6">
                <Input.Password
                  value={currentUser.old_password ?? ""}
                  placeholder={"Old Password"}
                  prefix={<Password className={userIconsClassName} />}
                  type="password"
                  allowClear
                  maxLength={200}
                  status={
                    userErr.old_password
                      ? "error"
                      : currentUser.old_password
                        ? "warning"
                        : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentUser((prev) => ({
                      ...prev,
                      old_password: value,
                    }));
                    let newError = null;
                    if (value && value.length < 8) {
                      newError =
                        "The old password should be at least 8 characters!";
                    }
                    setUserErr((prev) => ({
                      ...prev,
                      old_password: newError,
                    }));
                  }}
                />
                <div
                  className={`absolute bot-0 translate-y-[2px] text-sm text-red-500 transition-all duration-300 ${userErr.old_password ? "max-h-40" : "max-h-0"} overflow-hidden`}
                >
                  {userErr.old_password}
                </div>
              </div>
              <div className="relative size-full mb-6">
                <Input.Password
                  value={currentUser.new_password ?? ""}
                  placeholder={"New Password"}
                  prefix={<Password className={userIconsClassName} />}
                  type="password"
                  allowClear
                  maxLength={200}
                  status={
                    userErr.new_password
                      ? "error"
                      : currentUser.new_password
                        ? "warning"
                        : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentUser((prev) => ({
                      ...prev,
                      new_password: value,
                    }));
                    let newError = null;
                    if (value) {
                      newError = validatePassword(value);
                      if (value === currentUser.old_password) {
                        newError =
                          "The new password should be different than the old one!";
                      }
                    }
                    setUserErr((prev) => ({
                      ...prev,
                      new_password: newError,
                    }));
                  }}
                />
                <div
                  className={`absolute bot-0 translate-y-[2px] text-sm text-red-500 transition-all duration-300 ${userErr.new_password ? "max-h-40" : "max-h-0"} overflow-hidden`}
                >
                  {userErr.new_password}
                </div>
              </div>
              <div className="relative size-full mb-6">
                <Input.Password
                  value={currentUser.confirm_password ?? ""}
                  placeholder={"Confirm Password"}
                  prefix={<Password className={userIconsClassName} />}
                  type="password"
                  allowClear
                  maxLength={200}
                  status={
                    userErr.confirm_password
                      ? "error"
                      : currentUser.confirm_password
                        ? "warning"
                        : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentUser((prev) => ({
                      ...prev,
                      confirm_password: value,
                    }));
                    let newError = null;
                    if (value) {
                      if (value !== currentUser.new_password) {
                        newError = "The passwords do not match!";
                      }
                    }
                    setUserErr((prev) => ({
                      ...prev,
                      confirm_password: newError,
                    }));
                  }}
                />
                <div
                  className={`absolute bot-0 translate-y-[2px] text-sm text-red-500 transition-all duration-300 ${userErr.confirm_password ? "max-h-40" : "max-h-0"} overflow-hidden`}
                >
                  {userErr.confirm_password}
                </div>
              </div>
              <button
                className={baseBtnClassName + " w-[200px] mb-4 self-end"}
                disabled={loadingState}
                onClick={(e) => {
                  rippleAnimation(e, isLight);
                  setLoadingState(true);
                  //validate fields
                  const oldPass = currentUser.old_password;
                  const newPass = currentUser.new_password;
                  const confPass = currentUser.confirm_password;
                  let newErrorOldPass = userErr.old_password;
                  let newErrorNewPass = userErr.new_password;
                  let newErrorConfPass = userErr.confirm_password;
                  if (!oldPass) {
                    newErrorOldPass = "Old password is required";
                  }
                  if (!newPass) {
                    newErrorNewPass = "New password is required";
                  }
                  if (!confPass) {
                    newErrorConfPass = "Please confirm your password";
                  }
                  setUserErr({
                    old_password: newErrorOldPass,
                    new_password: newErrorNewPass,
                    confirm_password: newErrorConfPass,
                  });
                  if (
                    !newErrorOldPass &&
                    !newErrorNewPass &&
                    !newErrorConfPass &&
                    oldPass &&
                    newPass
                  ) {
                    const formData = new FormData();
                    formData.append("old_password", oldPass);
                    formData.append("new_password", newPass);
                    axios
                      .put("/api/change-password/", formData, {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                      })
                      .then((response: AxiosResponse<string>) => {
                        messageApi.success(response.data);
                        setCurrentUser(defaultUser);
                        setLoadingState(false);
                      })
                      .catch((error: AxiosError<Record<string, string>>) => {
                        if (error.response) {
                          if (error.response.status === 401) {
                            window.location.href = "/login";
                          }
                          messageApi.error("Validation Error");
                          const newErr = error.response.data;
                          if (newErr.new_password) {
                            newErrorNewPass = newErr.new_password;
                          } else if (newErr.old_password) {
                            newErrorOldPass = newErr.old_password;
                          } else {
                            if (newErr.detail.startsWith('Old')) {
                              newErrorOldPass = newErr.detail;
                            } else {
                              newErrorNewPass = newErr.detail;
                            }
                          }
                          setUserErr({
                            old_password: newErrorOldPass,
                            new_password: newErrorNewPass,
                            confirm_password: newErrorConfPass,
                          });
                        } else {
                          messageApi.error("An unexpected error occurred.");
                          newErrorNewPass = "An unexpected error occurred.";
                          setUserErr({
                            old_password: newErrorOldPass,
                            new_password: newErrorNewPass,
                            confirm_password: newErrorConfPass,
                          });
                        }
                        setTimeout(() => {
                          setLoadingState(false);
                        }, 1000);
                      });
                  } else {
                    setLoadingState(false);
                  }
                }}
              >
                Update
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
