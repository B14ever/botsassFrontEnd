import { Spokes } from "@/components/loading-ui/spokes";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[70vh] h-full w-full items-center justify-center">
      <Spokes className="size-16" />
    </div>
  );
}
