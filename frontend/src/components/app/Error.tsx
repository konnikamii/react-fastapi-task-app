import { useContext } from "react";
import { Link } from "@tanstack/react-router";
import { UserContext } from "../../routes/app/route";
import { email_address } from "../../utils_other/defaults";

function ErrorFC() {
  const theme = useContext(UserContext).theme;
  const isLight = theme === "light";

  return (
    <>
      <div className="absolute top-0 inset-x-0"></div>
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${isLight ? "bg-gray-100 text-black" : "bg-gray-900 text-white/95"}`}
      >
        <div className="text-center max-w-[600px]">
          <div className="text-6xl font-extrabold text-red-600">Error</div>
          <div
            className={`mt-4 text-2xl font-bold ${isLight ? "text-gray-800" : "text-gray-100"}`}
          >
            Opps!
          </div>
          <div
            className={`flex flex-col gap-2 mt-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}
          >
            <div>Something went wrong. Please try again.</div>
            <div>
              If the error persists please contact us with a description of the
              problem at{" "}
              <a
                href={`mailto:${email_address}`}
                className="text-blue-600 hover:underline"
              >
                {email_address}
              </a>
            </div>
            <div>We will be happy to help!</div>
          </div>
          <div className="mt-6">
            <Link
              to="/app"
              className="px-4 py-2 mr-4 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Home Page
            </Link>
            <Link
              to="/app/dashboard"
              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default ErrorFC;
