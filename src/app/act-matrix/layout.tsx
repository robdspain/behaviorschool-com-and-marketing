import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACT Matrix for Schools | Free PDF Download & Examples | Behavior School",
  description: "Complete ACT Matrix guide for school-based behavior analysts. Free PDF download with examples, explained step-by-step. Learn how the ACT Matrix improves student values-based interventions in schools.",
  alternates: {
    canonical: "https://behaviorschool.com/act-matrix",
  },
};

export default function ACTMatrixLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}