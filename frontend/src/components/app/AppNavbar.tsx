import { FC, useContext, useEffect, useRef, useState } from "react";
import Logo from "../svgs/navbar/logo";
import ThemeToggleLight from "../svgs/themeToggleLight";
import ThemeToggleDark from "../svgs/themeToggleDark";
import LeftArrow from "../svgs/navbar/leftArrow";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DimensionContext, UserContext } from "../../routes/app/route";
import { userQueryOptions } from "../../utils_fetch/fetch";
import axios from "axios";
import React from "react";
import Settings from "../svgs/navbar/settings";
import Logout from "../svgs/navbar/logout";
import User from "../svgs/navbar/user";
import Dashboard from "../svgs/navbar/dashboard";
import Tasks from "../svgs/navbar/tasks";
import Sandwich from "../svgs/navbar/sandwich";
import {
  btnClassPrimary,
  btnClassPrimaryDarkBlue,
} from "../../utils_other/defaults";
import { Tour, TourProps } from "antd";
import { rippleAnimation } from "../../utils_other/helperFunctions";
import Info from "../svgs/info";

const allLinksNames = [
  {
    to: "/app",
    name: "Home",
    welcome_message: `Hello there diligent person!`,
    tooltip:
      "Welcome to the Taskify Web Application! Here you can learn more about its capabilities and how to use it.",
  },
  {
    to: "/app/user",
    name: "Settings",
    welcome_message: `Welcome to your Profile!`,
    tooltip:
      "Here you can look at your profile, change your password or modify your account.",
  },
  {
    to: "/app/dashboard",
    name: "Dashboard",
    welcome_message: `Welcome to your Dashboard!`,
    tooltip: "Here you can have a good overview of your overall activity.",
  },
  {
    to: "/app/tasks",
    name: "Tasks",
    welcome_message: `Welcome to the Tasks section!`,
    tooltip:
      "Here you can review, update or delete tasks. Use filters for more specific selection.",
  },
  {
    to: "/app/tasks/$taskid",
    name: "Single Task",
    welcome_message: `Welcome to the Single Task section!`,
    tooltip: "Here you can review each individual Task and modify it.",
  },
];
const navbarMainLinks = [
  {
    to: "/app/dashboard",
    name: "Dashboard",
    icon: <Dashboard />,
  },
  {
    to: "/app/tasks",
    name: "Tasks",
    icon: <Tasks />,
  },
];
const navbarToolLinks = [
  {
    to: "/app/user/",
    name: "Settings",
    icon: <Settings />,
  },
];
const navbarTopLinks = [
  { to: "/app", name: "Home" },
  { to: "/app/user", name: "Settings" },
];
const delayClasses = [
  "",
  "delay-[50ms]",
  "delay-[100ms]",
  "delay-[150ms]",
  "delay-[200ms]",
  "delay-[250ms]",
];
interface AppNavbarProps {
  children: React.ReactNode; // Explicitly type 'children'
}
const themeBackgroundColors = {
  light: "#ffffff",
  dark: "#000000",
};
const AppNavbar: React.FC<AppNavbarProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const dims = useContext(DimensionContext);
  const theme = useContext(UserContext).theme;
  const [isLight, _] = useState(theme === "light");
  const matchRoute = useMatchRoute();
  const userQ = useQuery(userQueryOptions());

  useEffect(() => {
    document.body.style.backgroundColor =
      themeBackgroundColors[theme] || "#ffffff";
  }, [theme]);
  const [userData, setUserData] = useState(
    userQ.data && !axios.isAxiosError(userQ.data) ? userQ.data : null
  );
  useEffect(() => {
    setUserData(
      userQ.data && !axios.isAxiosError(userQ.data) ? userQ.data : null
    );
  }, [userQ.data]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [leftNavOpen, setLeftNavOpen] = useState(true);

  const navbarRef = useRef<HTMLDivElement | null>(null);
  const bottomNavbarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        if (navbarRef.current) {
          navbarRef.current.style.transform = "translateY(-100%)";
        }
        if (bottomNavbarRef.current) {
          bottomNavbarRef.current.style.transform = "translate(-50%,50%)";
        }
      } else {
        if (navbarRef.current) {
          navbarRef.current.style.transform = "translateY(0)";
        }
        if (bottomNavbarRef.current) {
          bottomNavbarRef.current.style.transform = "translate(-50%,0)";
        }
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef(null);
  const ref9 = useRef(null);

  return (
    <>
      {dims.plus1024 ? (
        <>
          <div
            ref={ref1}
            className={`z-[30] fixed h-screen flex flex-col bg-gradient-to-b 
            ${leftNavOpen ? (dims.plus1440 ? "w-[250px]" : "w-[200px]") : dims.plus1440 ? "w-[80px]" : "w-[60px]"} 
            ${isLight ? "text-black bg-white/80" : "text-white from-gray-800 to-gray-800"} 
            transition-all duration-300`}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
          >
            {/* Logo */}
            <div
              ref={ref9}
              className={`flex w-full min-h-[90px] items-center border-r-2 border-b-2 
          ${isLight ? "border-gray-300" : "border-gray-600"} 
          relative`}
            >
              <Link
                className={`flex w-full justify-start overflow-hidden gap-2 relative transition-all duration-100  ${dims.plus1440 ? "pl-4" : leftNavOpen ? "pl-2" : "pl-1"}`}
                to={"/app"}
              >
                <Logo
                  className={`flex-shrink-0 ${dims.plus1440 ? "size-12" : "size-11"} transition-all duration-300 active:scale-90`}
                  isLight={isLight}
                />
                <div
                  className={`absolute top-1/2 transition-all duration-100 font-medium ${leftNavOpen ? "" : "translate-x-20"} ${dims.plus1440 ? "text-3xl left-[90px] translate-y-[-50%]" : "text-xl left-[52px] translate-y-[-30%]"} text-nowrap`}
                  style={{ fontFamily: "Pacifico" }}
                >
                  Taskify
                </div>
              </Link>
              <div
                className={`group absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 py-[6px] px-[3px] rounded-xl border 
          ${
            isLight
              ? "bg-black hover:bg-white border-gray-700"
              : "bg-white hover:bg-black border-gray-300"
          }
          transition-all duration-300 active:scale-95 cursor-pointer`}
                onClick={() => {
                  setLeftNavOpen(!leftNavOpen);
                }}
              >
                <LeftArrow
                  className={`${dims.plus1440 ? "size-4" : "size-3"} ${leftNavOpen ? "" : "rotate-180"} 
              ${
                isLight
                  ? "stroke-white group-hover:stroke-black"
                  : "stroke-black group-hover:stroke-white"
              }
              transition-all duration-300`}
                />
              </div>
            </div>

            {/* Links */}
            <div
              className={`flex flex-col flex-1 pt-4 ${dims.plus768h ? "gap-3" : dims.plus500h ? "gap-1" : "gap-0"} border-r-2 ${isLight ? "border-gray-300" : "border-gray-600"} transition-all duration-300 ${leftNavOpen ? (dims.plus1440 ? "pl-12 pr-11" : "px-8") : dims.plus1440 ? "px-3" : "px-2"}`}
            >
              {/* Navigation links MAIN*/}
              <div
                ref={ref5}
                className={`flex flex-col ${dims.plus768h ? "gap-3 pt-4" : dims.plus500h ? "gap-1" : "gap-0"}`}
              >
                {dims.plus500h ? (
                  <div
                    className={`font-bold 
                          ${isLight ? "text-gray-600" : "text-gray-300"} 
                          ${leftNavOpen ? "" : dims.plus1440 ? "pl-[9px]" : "pl-[6px]"} ${dims.plus1440 ? "text-sm" : "text-xs"}
                          transition-all duration-300`}
                  >
                    MAIN
                  </div>
                ) : null}
                {navbarMainLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className={`group group-w-full flex items-center gap-3 rounded-md 
                            ${dims.plus768h ? "py-3" : "py-2"}
                            ${leftNavOpen ? "px-4" : dims.plus1440 ? "px-[15px] hover:w-fit" : "px-[11px] hover:w-fit"} 
                            ${
                              isLight
                                ? `${matchRoute({ to: link.to }) ? "bg-blue-500" : "hover:bg-blue-500"}`
                                : `font-medium ${matchRoute({ to: link.to }) ? "bg-blue-400" : "hover:bg-blue-400"}`
                            } 
                                transition-all duration-300 active:scale-95 overflow-hidden`}
                  >
                    {React.cloneElement(link.icon, {
                      className: `flex-shrink-0 fill-none 
                            ${dims.plus1440 ? "size-6" : "size-5"}
                            ${
                              isLight
                                ? `group-hover:stroke-white ${matchRoute({ to: link.to }) ? "stroke-white" : "stroke-black"}`
                                : `group-hover:stroke-black ${matchRoute({ to: link.to }) ? "stroke-black" : "stroke-white"}`
                            }  
                                transition-all duration-100`,
                    })}
                    <div
                      className={`relative transition-all duration-300 ${leftNavOpen ? "opacity-100" : "slide-right-and-back opacity-0 group-hover:opacity-100"} ${dims.plus1440 ? "text-base " : "text-sm "}`}
                    >
                      <span
                        className={`relative underline-animation 
                                ${
                                  isLight
                                    ? `${matchRoute({ to: link.to }) ? "text-white" : "group-hover:text-white"}`
                                    : `${matchRoute({ to: link.to }) ? "text-black" : "group-hover:text-black"}`
                                }`}
                      >
                        {link.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {/* Navigation links TOOLS*/}
              <div
                className={`flex flex-col ${dims.plus768h ? "gap-3 pt-8" : dims.plus500h ? "gap-1 pt-2" : "gap-0"}`}
              >
                {dims.plus500h ? (
                  <div
                    className={`font-bold 
                          ${isLight ? "text-gray-600" : "text-gray-300"} 
                          ${leftNavOpen ? "" : dims.plus1440 ? "pl-[9px]" : "pl-[6px]"} ${dims.plus1440 ? "text-sm" : "text-xs"}
                          transition-all duration-300`}
                  >
                    TOOLS
                  </div>
                ) : null}
                {navbarToolLinks.map((link) => (
                  <Link
                    key={link.name}
                    ref={
                      link.name === "Settings"
                        ? ref3
                        : link.name === "Upload"
                          ? ref4
                          : link.name === "Journal"
                            ? ref6
                            : link.name === "Preferences"
                              ? ref8
                              : null
                    }
                    to={link.to}
                    className={`group group-w-full flex items-center gap-3 rounded-md 
                            ${dims.plus768h ? "py-3" : "py-2"}
                            ${leftNavOpen ? "px-4" : dims.plus1440 ? "px-[15px] hover:w-fit" : "px-[11px] hover:w-fit"} 
                            ${
                              isLight
                                ? `${matchRoute({ to: link.to }) ? "bg-blue-500" : "hover:bg-blue-500"}`
                                : `font-medium ${matchRoute({ to: link.to }) ? "bg-blue-400" : "hover:bg-blue-400"}`
                            } 
                                transition-all duration-300 active:scale-95 overflow-hidden`}
                  >
                    {React.cloneElement(link.icon, {
                      className: `flex-shrink-0 fill-none 
                            ${dims.plus1440 ? "size-6" : "size-5"}
                            ${
                              isLight
                                ? `group-hover:stroke-white ${matchRoute({ to: link.to }) ? "stroke-white" : "stroke-black"}`
                                : `group-hover:stroke-black ${matchRoute({ to: link.to }) ? "stroke-black" : "stroke-white"}`
                            }  
                                transition-all duration-100`,
                    })}
                    <div
                      className={`relative transition-all duration-300 ${leftNavOpen ? "opacity-100" : "slide-right-and-back opacity-0 group-hover:opacity-100"} ${dims.plus1440 ? "text-base " : "text-sm "}`}
                    >
                      <span
                        className={`relative underline-animation 
                                ${
                                  isLight
                                    ? `${matchRoute({ to: link.to }) ? "text-white" : "group-hover:text-white"}`
                                    : `${matchRoute({ to: link.to }) ? "text-black" : "group-hover:text-black"}`
                                }`}
                      >
                        {link.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {/* Logout */}
            <div
              className={`flex flex-col justify-center border-r-2 border-t-2 
                  ${dims.plus768h ? "min-h-[75px]" : "min-h-[60px]"}
                  ${leftNavOpen ? (dims.plus1440 ? "px-12" : "px-8") : dims.plus1440 ? "px-3" : "px-2"}
                  ${isLight ? "border-gray-300" : "border-gray-600"} 
                  transition-all duration-300`}
            >
              <div
                className={`group group-w-full flex items-center gap-3 rounded-md 
                      ${dims.plus768h ? "py-3" : "py-2"} ${leftNavOpen ? "px-4" : "px-[15px] hover:w-fit "}  
                      ${
                        isLight
                          ? `hover:bg-blue-500 `
                          : `font-medium hover:bg-blue-400`
                      }  
                      transition-all duration-300 active:scale-95 overflow-hidden cursor-pointer`}
                onClick={() => {
                  axios
                    .post("/logout")
                    .then(() => {
                      queryClient.removeQueries();
                      window.location.href = "/";
                    })
                    .catch(() => {
                      window.location.reload();
                    });
                }}
              >
                <Logout
                  className={`flex-shrink-0 fill-none 
                          ${dims.plus1440 ? "size-6" : "size-5"}
                          ${
                            isLight
                              ? `group-hover:stroke-white stroke-black`
                              : `group-hover:stroke-black stroke-white`
                          }  
                              transition-all duration-100`}
                />
                <div
                  className={`relative transition-all duration-300 ${leftNavOpen ? "opacity-100" : "slide-right-and-back opacity-0 group-hover:opacity-100"} ${dims.plus1440 ? "text-base " : "text-sm "}`}
                >
                  <span
                    className={`relative underline-animation 
                              ${
                                isLight
                                  ? `text-black group-hover:text-white`
                                  : `text-white group-hover:text-black`
                              }`}
                  >
                    Logout
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/*-------------- Top Navbar --------------*/}
          <div
            className={`fixed flex items-center justify-between w-full min-h-[90px] max-h-[90px] shadow-lg border-b-2 bg-gradient-to-r 
                ${leftNavOpen ? (dims.plus1440 ? "ml-[250px]" : "ml-[200px]") : dims.plus1440 ? "ml-[80px]" : "ml-[60px]"} 
                ${
                  isLight
                    ? `text-black bg-white/80 border-gray-300 shadow-gray-300/30`
                    : `text-white from-gray-800 to-gray-800 border-gray-600 shadow-gray-600/30`
                } 
                    z-[20] backdrop-blur-md transition-all duration-300`}
            style={{
              width: `calc(100% - ${leftNavOpen ? (dims.plus1440 ? "250px" : "200px") : dims.plus1440 ? "80px" : "60px"})`,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            ref={navbarRef}
          >
            <div
              ref={ref2}
              className={`ml-12 ${dims.plus1440 ? "w-3/4 text-xl" : "w-2/3 text-lg"}`}
            >
              <div className="font-bold">
                {
                  allLinksNames.find((route) => matchRoute({ to: route.to }))
                    ?.welcome_message
                }
              </div>
              <div
                className={`mt-2 ${dims.plus1440 ? "text-base" : "text-sm"}`}
              >
                {
                  allLinksNames.find((route) => matchRoute({ to: route.to }))
                    ?.tooltip
                }
              </div>
            </div>

            <div
              ref={ref7}
              className={`flex justify-end items-center gap-6 pr-4 ${dims.plus1440 ? "w-1/4" : "w-1/3"}`}
            >
              <div
                className="w-12 h-6 px-[6px] py-[3px] bg-gray-400 shadow-inner shadow-gray-700 border border-gray-400 rounded-full cursor-pointer relative"
                onClick={() => {
                  const newTheme = isLight ? "dark" : "light";
                  localStorage.setItem("theme", newTheme);
                  window.location.reload();
                }}
              >
                <ThemeToggleLight
                  className={`absolute left-1 size-4 bg-white fill-yellow-500 rounded-full transition-all duration-300 ${isLight ? "opacity-100 rotate-[-360deg] translate-x-0" : "translate-x-6 opacity-0 rotate-0"}`}
                />
                <ThemeToggleDark
                  className={`absolute left-1 size-4 bg-white fill-black rounded-full transition-all duration-300 ${isLight ? "opacity-0 rotate-[-360deg] translate-x-0" : "translate-x-6 opacity-100 rotate-0"}`}
                />
              </div>
              <Link className="group flex items-center gap-2 " to="/app/user">
                {userData ? (
                  <div>
                    <div
                      className={`${dims.plus1440 ? "text-base" : "text-xs"} ${isLight ? "text-gray-600" : "text-white"}`}
                    >
                      {userData.username}
                    </div>
                    <div
                      className={`${dims.plus1440 ? "text-xs" : "text-[10px]"} ${isLight ? "text-gray-400" : "text-gray-300"}`}
                    >
                      Plan: free
                    </div>
                  </div>
                ) : null}
                <User
                  className={`rounded-2xl active:scale-95 transition-all duration-200 
                          ${dims.plus1440 ? "size-12" : "size-10"} 
                          ${
                            isLight
                              ? `${matchRoute({ to: "/app/user" }) ? "stroke-white fill-white bg-black" : "fill-black stroke-black  group-hover:fill-white group-hover:stroke-white group-hover:bg-black"}`
                              : `${matchRoute({ to: "/app/user" }) ? "stroke-black fill-black bg-white" : "fill-white stroke-white  group-hover:fill-black group-hover:stroke-black group-hover:bg-white"}`
                          }`}
                />
              </Link>
            </div>
          </div>

          {/*-------------- Main content --------------*/}
          <div
            className={`absolute w-full h-fit min-h-screen pt-[90px] bg-gradient-to-b 
            ${leftNavOpen ? (dims.plus1440 ? "ml-[250px]" : "ml-[200px]") : dims.plus1440 ? "ml-[80px]" : "ml-[60px]"} 
            ${isLight ? "text-black from-gray-100 to-gray-200" : "text-white from-gray-900 to-gray-900"} 
            transition-all duration-300`}
            style={{
              width: `calc(100% - ${leftNavOpen ? (dims.plus1440 ? "250px" : "200px") : dims.plus1440 ? "80px" : "60px"})`,
            }}
          >
            <div
              className="absolute w-full overflow-hidden pointer-events-none"
              style={{ height: `calc(100% - 90px)` }}
            >
              <div className="w-full h-full relative overflow-hidden">
                <div
                  className={`scaling-up-side absolute top-0 left-0 translate-x-[-75%] h-full bg-[#c83bf3] roundeds-full filter blur-[30px] ${isLight ? "opacity-60 w-[3px] mix-blend-darken" : "opacity-20 w-[7px] mix-blend-lighten"}`}
                />
                <div
                  className={`scaling-up-side absolute top-0 right-0 translate-x-[75%] h-full bg-[#c83bf3] roundeds-full filter blur-[30px] ${isLight ? "opacity-60 w-[3px] mix-blend-darken" : "opacity-20 w-[7px] mix-blend-lighten"}`}
                />
              </div>
            </div>
            {matchRoute({ to: "/app" }) ? (
              <WelcomePageFC
                ref1={ref1}
                ref2={ref2}
                ref3={ref3}
                ref5={ref5}
                ref7={ref7}
                ref9={ref9}
              />
            ) : (
              children
            )}
          </div>
        </>
      ) : (
        <>
          {/*-------------- Top Navbar --------------*/}
          <div
            className={`fixed top-0 left-0 z-[20] w-screen min-h-[65px] border-b-2 shadow-sm backdrop-blur-sm 
              ${dropdownOpen ? "max-h-screen" : "max-h-[65px] delay-[100ms]"} 
              ${isLight ? "border-gray-300" : `${"border-gray-700"} bg-gradient-to-r from-gray-800 to-gray-800 text-white`} 
              transition-all duration-300 overflow-hidden select-none`}
            ref={navbarRef}
          >
            <div className="flex flex-col items-center gap-2 pb-4">
              <div className="flex justify-between items-center w-full px-4 h-[65px]">
                <Link className="flex-1 " to="/app">
                  <Logo
                    className={`flex-shrink-0 ${dims.plus375 ? "size-12" : "size-11"} transition-all duration-100 active:scale-90`}
                    isLight={isLight}
                  />
                </Link>
                <div
                  className={`flex-0 font-semibold ${dims.plus375 ? "text-xl" : "text-lg"}`}
                >
                  {
                    allLinksNames.find((route) => matchRoute({ to: route.to }))
                      ?.name
                  }
                </div>
                <div className="flex flex-1 justify-end items-center gap-2">
                  <Link
                    to="/app/user"
                    onClick={() => {
                      if (dropdownOpen) {
                        setDropdownOpen(false);
                      }
                    }}
                  >
                    <User
                      className={`rounded-lg ${dims.plus375 ? "size-7" : "size-6"} 
                    ${
                      isLight
                        ? `${matchRoute({ to: "/app/user" }) ? `stroke-white fill-white bg-black` : "stroke-black fill-black"}`
                        : `${matchRoute({ to: "/app/user" }) ? `stroke-black fill-black bg-white` : "stroke-white fill-white"}`
                    } 
                        transition-all duration-300`}
                    />
                  </Link>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <Sandwich
                      className={`${dims.plus375 ? "size-8" : "size-7"} 
                      ${dropdownOpen ? "sandwich-open scale-[.8]" : "delay-[100ms]"} 
                      ${isLight ? `stroke-black` : `stroke-white`} 
                      transition-transform duration-200 delay-0`}
                    />
                  </button>
                </div>
              </div>

              {/* Navigation links TOOLS */}
              {navbarTopLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`transition-all duration-300 ${dropdownOpen ? ` ${delayClasses[index]}` : `delay-[100ms] opacity-0 ${index % 2 === 0 ? "-" : ""}translate-x-10 `} ${matchRoute({ to: link.to }) ? `underline-animation-active ` : ""}`}
                  onClick={() => {
                    if (dropdownOpen) {
                      setDropdownOpen(false);
                    }
                  }}
                >
                  <div className="relative transition-all duration-300 ">
                    <span
                      className={`relative underline-animation ${dims.plus375 ? "text-base" : "text-sm"}  
                      ${
                        isLight
                          ? `${matchRoute({ to: link.to }) ? "text-black" : "group-hover:text-white"}`
                          : `${matchRoute({ to: link.to }) ? "text-white" : "group-hover:text-black"}`
                      }`}
                    >
                      {link.name}
                    </span>
                  </div>
                </Link>
              ))}
              {/* Logout button */}
              <div
                className={`transition-all duration-300 ${dims.plus375 ? "text-base" : "text-sm"} ${dropdownOpen ? " delay-[200ms]" : "delay-[100ms] opacity-0 -translate-x-10 "}`}
                onClick={() => {
                  axios
                    .post("/logout")
                    .then(() => {
                      queryClient.removeQueries();
                      window.location.href = "/";
                    })
                    .catch(() => {
                      window.location.reload();
                    });
                }}
              >
                Logout
              </div>
            </div>
          </div>

          {/*-------------- Main content --------------*/}
          <div
            className={`absolute w-full h-fit min-h-screen pt-[65px] bg-gradient-to-b  
            ${isLight ? "text-black from-gray-100 to-gray-200" : "text-white from-gray-900 to-gray-900"}
             transition-all duration-300`}
            style={{ transform: "" }}
          >
            <div
              className="absolute w-full h-full overflow-hidden pointer-events-none"
              style={{ height: `calc(100% - 65px)` }}
            >
              <div className="w-full h-full relative overflow-hidden">
                <div
                  className={`scaling-up-side absolute top-0 left-0 translate-x-[-75%] h-full bg-[#c83bf3] roundeds-full filter blur-[30px] ${isLight ? "opacity-60 w-[4px] mix-blend-darken" : "opacity-20 w-[6px] mix-blend-lighten"}`}
                />
                <div
                  className={`scaling-up-side absolute top-0 right-0 translate-x-[75%] h-full bg-[#c83bf3] roundeds-full filter blur-[30px] ${isLight ? "opacity-60 w-[4px] mix-blend-darken" : "opacity-20 w-[6px] mix-blend-lighten"}`}
                />
              </div>
            </div>
            {matchRoute({ to: "/app" }) ? (
              <WelcomePageFC
                ref1={null}
                ref2={null}
                ref3={null}
                ref5={null}
                ref7={null}
                ref9={null}
              />
            ) : (
              children
            )}
          </div>
          {/*-------------- Navbar Bottom --------------*/}
          {/* Navigation links MAIN */}
          <div className="fixed bottom-5 w-screen z-[10]">
            <div
              ref={bottomNavbarRef}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-fit flex py-1 px-2 gap-1 items-center rounded-full shadow-inner border-2
                ${
                  isLight
                    ? `${"border-gray-400"} shadow-[#474747] bg-gray-200`
                    : `${"border-gray-400"} shadow-[#2c2c2c] bg-gradient-to-br from-gray-700 to-gray-900`
                }
                transition-all duration-300`}
            >
              {navbarMainLinks.map((link) => (
                <div
                  key={link.name}
                  className={`overflow-hidden transition-all duration-300 ease-in-out rounded-full shadow-md
                    ${
                      isLight
                        ? `${matchRoute({ to: link.to }) ? "max-w-[130px] shadow-slate-800 bg-black" : "max-w-[46px] bg-transparent shadow-transparent"}`
                        : `${matchRoute({ to: link.to }) ? "max-w-[130px] shadow-gray-500 bg-blue-400" : "max-w-[46px] bg-transparent shadow-transparent"}`
                    }
                    `}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center text-sm font-bold gap-2 px-2 py-[6px] overflow-hidden 
                        ${
                          isLight
                            ? `${matchRoute({ to: link.to }) ? "text-white" : "text-black"}`
                            : `${matchRoute({ to: link.to }) ? "text-black" : "text-white"}`
                        }`}
                    onClick={() => {
                      if (dropdownOpen) {
                        setDropdownOpen(false);
                      }
                    }}
                  >
                    <div
                      className={`p-1 border rounded-full transition-all duration-500 ease-in-out 
                          ${
                            isLight
                              ? `${matchRoute({ to: link.to }) ? "scale-[1.15] shadow-sm shadow-gray-700 border-white" : "scale-100 border-black"}`
                              : `${matchRoute({ to: link.to }) ? "scale-[1.15] shadow-sm shadow-gray-600 border-black" : "scale-100 border-white"}`
                          }`}
                    >
                      {React.cloneElement(link.icon, {
                        className: `flex-shrink-0 size-5 fill-none 
                          ${
                            isLight
                              ? `${matchRoute({ to: link.to }) ? "stroke-white" : "stroke-black"}`
                              : `${matchRoute({ to: link.to }) ? "stroke-black" : "stroke-gray-300"}`
                          }`,
                      })}
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-150 ease-in-out ${matchRoute({ to: link.to }) ? "translate-x-0 delay-150" : "translate-x-20"}`}
                    >
                      <h1>{link.name}</h1>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

interface WelcomePageFCProps {
  ref1: React.RefObject<null> | null;
  ref2: React.RefObject<null> | null;
  ref3: React.RefObject<null> | null;
  ref5: React.RefObject<null> | null;
  ref7: React.RefObject<null> | null;
  ref9: React.RefObject<null> | null;
}

const WelcomePageFC: FC<WelcomePageFCProps> = ({
  ref1,
  ref2,
  ref3,
  ref5,
  ref7,
  ref9,
}) => {
  const theme = useContext(UserContext).theme;
  const isLight = theme === "light";
  // const isContrast = theme === 'light_contrast' || theme === 'dark_contrast'

  const [open, setOpen] = useState(false);

  const steps: TourProps["steps"] = [
    {
      title: "Finding Your Way Around",
      description:
        "Use the Navigation Bar to quickly go from one section of the site to the other!",
      placement: "right",
      target: () => (ref1 ? ref1.current : null),
    },
    {
      title: "Tooltips",
      description:
        "There are short tooltips for each section, explaining what it is for!",
      cover: (
        <Info className="absolute top-[12px] left-[12px] size-10 stroke-indigo-600 fill-indigo-600" />
      ),
      target: () => (ref2 ? ref2.current : null),
    },
    {
      title: "Setting Your Settings",
      description:
        "Visiting the settings tab if you want to change your password.",
      placement: "right",
      cover: (
        <Settings className="absolute top-[12px] left-[12px] size-10 stroke-indigo-600" />
      ),
      target: () => (ref3 ? ref3.current : null),
    },
    {
      title: "Ready to Analyse",
      description:
        "Dive into task management by navigating to the Tasks section! There you can create see all your task in a nice, systematic view. Next, visit your dashboard to see the most important tasks and how other users of the website perform.",
      placement: "right",
      target: () => (ref5 ? ref5.current : null),
    },
    {
      title: "You - The User",
      description:
        "There is another way to reach your user settings - by clicking the user icon. You can also change the theme there.",
      placement: "left",
      cover: (
        <User className="absolute top-[12px] left-[12px] size-10 stroke-indigo-600 fill-indigo-600" />
      ),
      target: () => (ref7 ? ref7.current : null),
    },
    {
      title: "Back Home",
      description:
        "To come back to this section you can click on our logo here or simply navigate to the home domain '.../app'.",
      placement: "right",
      cover: (
        <Logo
          className="absolute top-[12px] left-[12px] size-10 transition-all duration-300 active:scale-90"
          isLight={isLight}
        />
      ),
      target: () => (ref9 ? ref9.current : null),
    },
  ];

  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
  }, []);

  const cardClassNameLight = `group flex flex-col gap-6 pb-6 rounded-lg shadow-round shadow-gray-300 hover:shadow-gray-400 bg-white border border-gray-300 hover:border-gray-400 transition-all duration-300 relative overflow-hidden p-4`;
  const cardClassNameDark = `group flex flex-col gap-6 pb-6 rounded-lg shadow-round shadow-gray-800 hover:shadow-gray-700 bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-300 relative overflow-hidden p-4`;
  const primaryBtnClassName = isLight
    ? btnClassPrimary
    : btnClassPrimaryDarkBlue;
  return (
    <>
      <div className={`flex flex-col items-center min-h-screen`}>
        {/* Welcome screen */}
        <div
          className={`w-full bg-gradient-to-r to-[50%] py-6 shadow-lg 
          ${
            isLight
              ? "from-[#86b817] to-[#0064d2] text-white shadow-gray-300"
              : "from-[#a3d85f] to-[#1e85e6] text-black shadow-gray-700"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="text-4xl font-bold">
              Welcome to Your Task Manager
            </div>
            <div className="mt-2 text-lg">
              Track and analyze your tasks and improve your task management
              skills.
            </div>
          </div>
        </div>
        {/* Tour section */}
        <div
          className="max-w-7xl mx-auto px-6 py-12 text-center"
          style={{
            transition: "all 0.5s ease-in-out",
            opacity: animate ? "100%" : "0%",
            transform: animate ? "translateY(0)" : "translateY(50px)",
            transitionDelay: animate ? `0ms` : "0ms",
          }}
        >
          <h2 className="text-3xl font-bold mb-6">Take a Tour</h2>
          <div className="mt-3">
            Ready to take your task management skills to the next level?
          </div>
          <div className="mt-1 mb-4">
            Start by taking a quick tour to learn more.
          </div>
          <button
            className={primaryBtnClassName + ` w-full`}
            onClick={(e) => {
              rippleAnimation(e, isLight, 1300);
              setOpen(true);
            }}
          >
            Begin Tour
          </button>
        </div>
        {/* Features section */}
        <div
          className="max-w-7xl mx-auto px-6 py-12"
          style={{
            transition: "all 0.5s ease-in-out",
            opacity: animate ? "100%" : "0%",
            transform: animate ? "translateY(0)" : "translateY(50px)",
            transitionDelay: animate ? `400ms` : "0ms",
          }}
        >
          <h2 className="text-3xl font-bold mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={isLight ? cardClassNameLight : cardClassNameDark}>
              <h3 className="text-xl font-semibold mb-2">
                Create and Manage Tasks
              </h3>
              <p>
                Create tasks, manage them, update them, and delete them with
                ease.
              </p>
            </div>
            <div className={isLight ? cardClassNameLight : cardClassNameDark}>
              <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
              <p>
                View upcoming tasks, completed tasks, and recently added tasks.
                Sort tasks by multiple criteria.
              </p>
            </div>
            <div className={isLight ? cardClassNameLight : cardClassNameDark}>
              <h3 className="text-xl font-semibold mb-2">Top Users</h3>
              <p>
                See the top users with the most tasks and track their
                performance and task completion.
              </p>
            </div>
            <div className={isLight ? cardClassNameLight : cardClassNameDark}>
              <h3 className="text-xl font-semibold mb-2">Settings</h3>
              <p>Update your user details and customize your experience.</p>
            </div>
            <div className={isLight ? cardClassNameLight : cardClassNameDark}>
              <h3 className="text-xl font-semibold mb-2">Dark Theme</h3>
              <p>
                Switch between light and dark themes to suit your preference.
              </p>
            </div>
            <div className={isLight ? cardClassNameLight : cardClassNameDark}>
              <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
              <p>
                Enjoy a seamless experience on both desktop and mobile devices.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        gap={{ offset: 14, radius: 25 }}
        mask={
          isLight
            ? {}
            : {
                style: {
                  boxShadow: "inset 0 0 15px #333",
                },
                color: "#2932369e",
              }
        }
      />
    </>
  );
};
export default AppNavbar;
