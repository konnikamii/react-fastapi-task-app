import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const MODE = import.meta.env.MODE?.trim();

export interface MyRouterContext {
  queryClient: QueryClient;
  deviceInfo: {
    isMobileDevice: boolean;
    isiPhone: boolean;
    hasTouchEvents: boolean;
  };
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
      {MODE === "development" ? <TanStackRouterDevtools /> : null}
    </>
  );
}
