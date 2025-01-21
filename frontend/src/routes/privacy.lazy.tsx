import { createLazyFileRoute, Link } from "@tanstack/react-router";
import TopNavbar from "../components/app/TopNavbar";
import "../css/index.css";
import CookiesFC from "../components/app/Cookies";
import useMediaQueries from "../hooks/useMediaQueries";
import useTheme from "../hooks/useTheme";

export const Route = createLazyFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
  const dims = useMediaQueries();
  const { theme, setTheme, isLight } = useTheme();

  return (
    <>
      <TopNavbar theme={theme} setTheme={setTheme} dims={dims} />
      <div
        className={`flex flex-col items-center justify-center gap-10 py-[90px] px-2 w-full h-fit min-h-screen ${isLight ? "bg-gray-100" : "bg-gray-800"} transition-colors duration-300  overflow-y-auto relative`}
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
          className={`flex flex-col  ${dims.plus550 ? "w-[430px]" : "w-auto"} px-10 py-4 rounded-xl border shadow-lg transition-all duration-300 ${isLight ? "border-gray-400 bg-gray-200/40 shadow-gray-200 hover:shadow-gray-300" : "border-gray-600 bg-white/65 shadow-gray-500/40"} backdrop-blur-sm relative overflow-hidden`}
        >
          <div className="w-full flex flex-col items-center py-6 font-bold text-3xl">
            Privacy Policy Page
          </div>
          <div className="flex flex-col gap-3 mb-6 text-center">
            Add your Privacy Policy here.
          </div>
          <div className={`text-sm text-gray-900 text-center mb-1`}>
            Back to{" "}
            <Link to="/">
              <span className="text-blue-700 hover:underline underline-offset-2 cursor-pointer">
                Home Page!
              </span>
            </Link>
          </div>
          <div className={`text-sm text-gray-900 text-center mb-4`}>
            Or{" "}
            <Link to="/login">
              <span className="text-blue-700 hover:underline underline-offset-2 cursor-pointer">
                Log In!
              </span>
            </Link>{" "}
            /{" "}
            <Link to="/register">
              <span className="text-blue-700 hover:underline underline-offset-2 cursor-pointer">
                Sign Up!
              </span>
            </Link>
          </div>
        </div>
      </div>
      <CookiesFC theme={theme} />
    </>
  );
}
