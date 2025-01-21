import { createLazyFileRoute, Link } from "@tanstack/react-router";
import TopNavbar from "../components/app/TopNavbar";
import "../css/index.css";
import CookiesFC from "../components/app/Cookies";
import useTheme from "../hooks/useTheme";
import useMediaQueries from "../hooks/useMediaQueries";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
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
          className={`flex flex-col  ${dims.plus768 ? "w-[730px]" : "w-auto"} px-10 py-4 rounded-xl border shadow-lg transition-all duration-300 ${isLight ? "border-gray-400 bg-gray-200/40 shadow-gray-200 hover:shadow-gray-300" : "border-gray-600 bg-white/65 shadow-gray-500/40"} backdrop-blur-sm relative overflow-hidden`}
        >
          <div
            className={`grow-left absolute top-0 left-0 translate-x-[-45%] -translate-y-[95%] w-[200%] aspect-square bg-[#0064d2] rounded-full mix-blend-multiply filter blur-3xl ${isLight ? "opacity-40" : "opacity-60"} pointer-events-none`}
          />
          <div
            className={`scaling-up absolute bottom-0 left-0 translate-y-[90%] w-[400%] aspect-square bg-[#f5af02] rounded-full mix-blend-multiply filter blur-3xl ${isLight ? "opacity-40" : "opacity-60"} pointer-events-none`}
          />
          <div className="w-full flex flex-col items-center py-6 font-bold text-3xl">
            Home page
          </div>
          <div className="flex flex-col gap-3 mb-6">Hello there!</div>
          <div className="flex flex-col gap-3 mb-6">
            This is an application that manages and generates tasks and
            deadlines for individual users.
          </div>
          <div className="flex flex-col gap-3 mb-6">
            **Key Features of the Application:**
            <ul className="list-disc pl-5">
              <li>
                <strong>Task Creation:</strong> Easily create tasks by providing
                a name, description, and deadline.
              </li>
              <li>
                <strong>Task Management:</strong> Edit, update, or delete tasks
                as your priorities change.
              </li>
              <li>
                <strong>Automatic Deadlines:</strong> Generate deadlines based
                on predefined rules to save time.
              </li>
              <li>
                <strong>Reminders:</strong> Stay on top of your tasks with
                automated reminders and notifications.
              </li>
              <li>
                <strong>Progress Tracking:</strong> Visualize your task
                completion rate and identify areas for improvement.
              </li>
              <li>
                <strong>Priority System:</strong> Assign priority levels to
                tasks to focus on what matters most.
              </li>
              <li>
                <strong>User-Friendly Interface:</strong> Navigate the app
                easily with an intuitive and responsive design.
              </li>
              <li>
                <strong>Secure Login:</strong> Keep your tasks and data secure
                with account-based access.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            The application is ideal for individuals who want to organize their
            day-to-day activities or manage project-based deadlines. Whether
            you're a student, a professional, or someone who simply enjoys
            staying productive, this tool is tailored to help you succeed.
          </div>
          <div className={`text-sm text-gray-900 text-center mb-6`}>
            Don&apos;t have an account? -----{" "}
            <Link to="/register">
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
