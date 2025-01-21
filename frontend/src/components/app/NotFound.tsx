import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import TopNavbar from "./TopNavbar";

function NotFoundFC() {
  const dims = {
    isLandscape: useMediaQuery({ orientation: "landscape" }),
    plus500h: useMediaQuery({ minHeight: 500 }),
    plus768h: useMediaQuery({ minHeight: 768 }),
    plus1080h: useMediaQuery({ minHeight: 1080 }),
    plus375: useMediaQuery({ minWidth: 375 }),
    plus425: useMediaQuery({ minWidth: 425 }),
    plus768: useMediaQuery({ minWidth: 768 }),
    plus1024: useMediaQuery({ minWidth: 1024 }),
    plus1440: useMediaQuery({ minWidth: 1440 }),
    plus550: useMediaQuery({ minWidth: 550 }),
  };
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    let newTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (!newTheme) {
      newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    } else {
      return newTheme;
    }
  });
  return (
    <>
      <div className="absolute top-0 inset-x-0">
        <TopNavbar theme={theme} setTheme={setTheme} dims={dims} />
      </div>
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${theme === "light" ? "bg-gray-100 text-black" : "bg-gray-900 text-white/95"}`}
      >
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-red-600">404</h1>
          <h2
            className={`mt-4 text-2xl font-bold ${theme === "light" ? "text-gray-800" : "text-gray-100"}`}
          >
            Page Not Found
          </h2>
          <p
            className={`mt-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
          >
            Sorry, we couldn&apos;t find the page you were looking for.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Home Page
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-10">
          <h3
            className={`text-lg font-semibold ${theme === "light" ? "text-black" : "text-gray-100"}`}
          >
            Quick Links
          </h3>
          <div className="flex gap-4 mt-4">
            <a
              href="/login"
              className={`${theme === "light" ? "text-gray-800" : "text-gray-400"} hover:text-red-600`}
            >
              Login
            </a>
            <a
              href="/register"
              className={`${theme === "light" ? "text-gray-800" : "text-gray-400"} hover:text-red-600`}
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
export default NotFoundFC;
