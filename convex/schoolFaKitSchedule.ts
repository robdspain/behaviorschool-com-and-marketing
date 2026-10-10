/** Successive Tue/Thu 06:00 Pacific slots, at least 12 hours after signup. */
export function schoolFaKitSlotsIso(signupIso: string, count: number): string[] {
  const signup = Date.parse(signupIso);
  if (!Number.isFinite(signup)) throw new RangeError("Invalid signup timestamp");
  if (!Number.isSafeInteger(count) || count < 0) throw new RangeError("Invalid slot count");

  const hourMs = 60 * 60 * 1000;
  const pacific = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    hour: "2-digit",
    hourCycle: "h23",
  });
  const slots: string[] = [];
  // Walk UTC hours so DST changes never duplicate or omit a local calendar day.
  // Pacific's 06:00 slots fall on whole UTC hours in both PST and PDT.
  let candidate = Math.ceil((signup + 12 * hourMs) / hourMs) * hourMs;
  while (slots.length < count) {
    const parts = pacific.formatToParts(candidate);
    const weekday = parts.find((part) => part.type === "weekday")?.value;
    const hour = parts.find((part) => part.type === "hour")?.value;
    if ((weekday === "Tue" || weekday === "Thu") && hour === "06") {
      slots.push(new Date(candidate).toISOString());
    }
    candidate += hourMs;
  }
  return slots;
}
