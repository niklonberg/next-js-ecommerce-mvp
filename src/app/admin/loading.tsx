import { Loader } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex justify-center">
      <Loader className="size-24 animation-spin" />
    </div>
  );
}
