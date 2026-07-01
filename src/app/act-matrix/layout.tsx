import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACT Matrix for Schools | Free PDF and Examples",
  description: "ACT Matrix guide for school behavior analysts with a free PDF, examples, and steps for values-based student support.",
};

export default function ACTMatrixLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
