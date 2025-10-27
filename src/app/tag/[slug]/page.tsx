import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function TagPage() {
  // Redirect all tag pages to blog
  redirect("/blog");
}
