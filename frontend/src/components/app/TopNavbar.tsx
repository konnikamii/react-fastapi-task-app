import { FC } from "react";
import Logo from "../svgs/navbar/logo";
import ThemeToggleLight from "../svgs/themeToggleLight";
import ThemeToggleDark from "../svgs/themeToggleDark";
import { Link } from "@tanstack/react-router";

interface TopNavbarProps {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
  dims: {
    isLandscape: boolean;
    plus500h: boolean;
    plus768h: boolean;
    plus1080h: boolean;
    plus375: boolean;
    plus425: boolean;
    plus768: boolean;
    plus1024: boolean;
    plus1440: boolean;
    plus550: boolean;
  };
}

export const TopNavbar: FC<TopNavbarProps> = ({ theme, setTheme, dims }) => {
  const isLight = theme === "light";
  return (
    <>
      <div
        className={`fixed w-full h-[80px] transition-all duration-300 border-b ${isLight ? "text-black bg-gray-300/60 shadow-lg shadow-gray-400/40 border-gray-400/80" : "text-white bg-black/80 shadow-2xl shadow-gray-700/60 border-gray-600/80"} flex justify-between items-center gap-2 ${dims.plus1024 ? "pl-[150px] pr-[40px]" : "pl-[25px] pr-[25px]"} backdrop-blur z-10`}
      >
        <a className="flex gap-4 items-center cursor-pointer" href="/">
          <Logo
            className={`${dims.plus1440 ? "size-12" : dims.plus1024 ? "size-11" : "size-10"} transition-all duration-300 active:scale-90`}
            isLight={isLight}
          />
          {dims.plus375 ? (
            <div
              className={`font-bold transition-all duration-300 ${isLight ? "text-black" : "text-white"} ${dims.plus1440 ? "text-3xl" : dims.plus1024 ? "text-2xl" : "text-xl"}`}
              style={{ fontFamily: "" }}
            >
              Taskify
            </div>
          ) : null}
        </a>

        <div className="flex items-center gap-6">
          <div
            className="w-12 h-6 px-[6px] py-[3px] bg-gray-400 shadow-inner shadow-gray-700 border border-gray-400 rounded-full cursor-pointer relative"
            onClick={() => {
              const newTheme = isLight ? "dark" : "light";
              setTheme(newTheme);
              localStorage.setItem("theme", newTheme);
            }}
          >
            <ThemeToggleLight
              className={`absolute left-1 size-4 bg-white fill-yellow-500 rounded-full transition-all duration-300 ${isLight ? "opacity-100 rotate-[-360deg] translate-x-0" : "translate-x-6 opacity-0 rotate-0"}`}
            />
            <ThemeToggleDark
              className={`absolute left-1 size-4 bg-white fill-black rounded-full transition-all duration-300 ${isLight ? "opacity-0 rotate-[-360deg] translate-x-0" : "translate-x-6 opacity-100 rotate-0"}`}
            />
          </div>

          <div className="group-fast">
            <Link
              to="/contact"
              className="relative underline-animation font-medium text-lg hover:text-blue-500 transition duration-300"
              draggable="false"
              >
              Contact Us
            </Link>
              </div>
          <div className="group-fast">
            <Link
              to="/login"
              className="relative underline-animation font-medium text-lg hover:text-blue-500 transition duration-300"
              draggable="false"
            >
              Login
            </Link>
          </div>
          <Link
            to="/register"
            className="popup-button bg-gradient-to-r from-[#6ccf54] via-[#1c8ecf] to-[#322fff] from-[10%] to-[90%] text-white font-bold text-center uppercase rounded-lg py-[10px] px-6 shadow-lg cursor-pointer hover:scale-[102%]"
            draggable="false"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
