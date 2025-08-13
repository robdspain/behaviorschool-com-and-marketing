import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SubscribeCTA() {
  return (
    <Button asChild className="ml-2 bg-indigo-600 hover:bg-indigo-700">
      <Link href="/subscribe">Subscribe for updates</Link>
    </Button>
  );
}


