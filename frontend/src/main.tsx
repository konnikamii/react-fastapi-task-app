import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./main.css";

import { routeTree } from "./routeTree.gen";
import { StrictMode } from "react";
import NotFoundFC from "./components/app/NotFound";
import ErrorFC from "./components/app/Error";

const MODE = import.meta.env.VITE_MODE?.trim();
const PROD_DEBUG = import.meta.env.VITE_PROD_DEBUG?.trim();
const isProd = MODE === "production";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient(/*{
  defaultOptions: { queries: { staleTime: 3000 } },
}*/);

const router = createRouter({
  routeTree,
  context: {
    queryClient:
      queryClient /* add more context as needed, user: { id: 123, name: "Ivancho" } */,
    deviceInfo: {
      isMobileDevice:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      isiPhone: /iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
      hasTouchEvents: "ontouchstart" in window,
    },
  },
  defaultPreload: "intent",
  defaultPreloadDelay: 200,
  defaultPreloadStaleTime: 0,
  notFoundMode: "root",
  defaultNotFoundComponent: NotFoundFC,
  defaultErrorComponent: ErrorFC,
});

// Ignores specific warning from antd should delete later
const originalErr = console.error;
console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    message.includes("Accessing element.ref was removed in React 19")
  ) {
    // Ignore this specific err
    return;
  }
  originalErr(...args);
};
// turn off logs for production
if (isProd && PROD_DEBUG !== "on") {
  console.log = function () {};
  console.info = function () {};
  console.warn = function () {};
  console.error = function () {};
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  const app = (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {!isProd ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
  root.render(!isProd ? <StrictMode>{app}</StrictMode> : app);
}
