import { createLazyFileRoute } from "@tanstack/react-router";
export const Route = createLazyFileRoute("/app/")({
  component: AppIndex,
});

function AppIndex() {
  return <></>;
}
