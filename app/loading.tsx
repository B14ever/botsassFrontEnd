import { Spokes } from "@/components/loading-ui/spokes";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Spokes className="size-16" />
    </div>
  );
}
