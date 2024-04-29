import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExpiredPage() {
  return (
    <>
      <h1>Download link expired</h1>
      <Button asChild size="lg">
        <Link href="/orders">Get new link</Link>
      </Button>
    </>
  );
}
