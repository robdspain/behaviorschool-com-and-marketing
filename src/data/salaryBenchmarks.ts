import salaryBenchmarksJson from "../../public/data/salary-benchmarks.json";

export const SALARY_BENCHMARKS = salaryBenchmarksJson;

export function formatSalaryReviewDate(
  isoDate: string = SALARY_BENCHMARKS.updatedAt,
): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) {
    return isoDate;
  }
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const SALARY_REVIEW_POLICY =
  "We refresh this snapshot quarterly if the page is getting search traffic. Always verify with local district HR.";
