export const ROLE_CATEGORIES = ["school_bcba", "clinic_bcba", "other"] as const;
export const PAYMENT_PATHS = ["self_pay", "district_po", "district_card", "unknown"] as const;
export const URGENCY_WINDOWS = ["this_month", "this_quarter", "this_year", "exploring"] as const;

export type RoleCategory = (typeof ROLE_CATEGORIES)[number];
export type PaymentPath = (typeof PAYMENT_PATHS)[number];
export type UrgencyWindow = (typeof URGENCY_WINDOWS)[number];

/** Exact apply-form prompts. Rob signs off on these before merge. */
export const CASH_FIELD_PROMPTS = {
  employer: "Which district or organization do you support?",
  role: "Are you a school-based BCBA, clinic-based BCBA, or other?",
  payment: "How do you expect to cover the $1,997 program — self-pay, district PO, or district card?",
  urgency: "When do you need to decide — this month, this quarter, this year, or still exploring?",
} as const;

export const ROLE_CATEGORY_LABELS: Record<RoleCategory, string> = {
  school_bcba: "School-based BCBA",
  clinic_bcba: "Clinic-based BCBA",
  other: "Other",
};

export const PAYMENT_PATH_LABELS: Record<PaymentPath, string> = {
  self_pay: "Self-pay",
  district_po: "District PO",
  district_card: "District card",
  unknown: "Not sure yet",
};

export const URGENCY_WINDOW_LABELS: Record<UrgencyWindow, string> = {
  this_month: "This month",
  this_quarter: "This quarter",
  this_year: "This year",
  exploring: "Still exploring",
};

export const ROLE_CATEGORY_OPTIONS = ROLE_CATEGORIES.map((value) => ({
  value,
  label: ROLE_CATEGORY_LABELS[value],
}));

export const PAYMENT_PATH_OPTIONS = PAYMENT_PATHS.map((value) => ({
  value,
  label: PAYMENT_PATH_LABELS[value],
}));

export const URGENCY_WINDOW_OPTIONS = URGENCY_WINDOWS.map((value) => ({
  value,
  label: URGENCY_WINDOW_LABELS[value],
}));

const LEGACY_PAYER_TO_PAYMENT_PATH: Record<string, PaymentPath> = {
  self: "self_pay",
  self_pay: "self_pay",
  district_po: "district_po",
  district_card: "district_card",
  unsure: "unknown",
  unknown: "unknown",
};

export function isRoleCategory(value: string): value is RoleCategory {
  return (ROLE_CATEGORIES as readonly string[]).includes(value);
}

export function isPaymentPath(value: string): value is PaymentPath {
  return (PAYMENT_PATHS as readonly string[]).includes(value);
}

export function isUrgencyWindow(value: string): value is UrgencyWindow {
  return (URGENCY_WINDOWS as readonly string[]).includes(value);
}

/** Maps the existing payer control, including legacy option values, onto payment_path. */
export function mapPayerToPaymentPath(value: string): PaymentPath | null {
  return LEGACY_PAYER_TO_PAYMENT_PATH[value] ?? null;
}

/** Keeps the free-text role column populated when a title was not provided. */
export function buildStoredRole(roleCategory: RoleCategory, roleTitle: string): string {
  const title = roleTitle.trim();
  if (title) return title;
  return ROLE_CATEGORY_LABELS[roleCategory];
}

export function describeCashFields(args: {
  employer: string;
  roleCategory: RoleCategory;
  roleTitle?: string;
  paymentPath: PaymentPath;
  urgencyWindow: UrgencyWindow;
}): string[] {
  const categoryLabel = ROLE_CATEGORY_LABELS[args.roleCategory];
  const title = args.roleTitle?.trim() ?? "";
  const lines = [
    `Employer: ${args.employer}`,
    `Role: ${categoryLabel} (${args.roleCategory})`,
  ];
  if (title && title !== categoryLabel) {
    lines.push(`Role title: ${title}`);
  }
  lines.push(`Payment path: ${PAYMENT_PATH_LABELS[args.paymentPath]} (${args.paymentPath})`);
  lines.push(`Decision window: ${URGENCY_WINDOW_LABELS[args.urgencyWindow]} (${args.urgencyWindow})`);
  return lines;
}

export type CashFieldSnapshot = {
  employer?: string | null;
  role?: string | null;
  roleCategory?: string | null;
  paymentPath?: string | null;
  urgencyWindow?: string | null;
};

export function hasCashFields(input: CashFieldSnapshot): boolean {
  return Boolean(
    input.employer?.trim() ||
      (input.roleCategory && isRoleCategory(input.roleCategory)) ||
      (input.paymentPath && isPaymentPath(input.paymentPath)) ||
      (input.urgencyWindow && isUrgencyWindow(input.urgencyWindow)),
  );
}

export function cashFieldRows(input: CashFieldSnapshot): Array<{ label: string; value: string }> {
  if (!hasCashFields(input)) return [];

  const rows: Array<{ label: string; value: string }> = [];
  const employer = input.employer?.trim();
  if (employer) rows.push({ label: "Employer", value: employer });

  const categoryLabel =
    input.roleCategory && isRoleCategory(input.roleCategory)
      ? ROLE_CATEGORY_LABELS[input.roleCategory]
      : null;
  if (input.roleCategory && isRoleCategory(input.roleCategory)) {
    rows.push({
      label: "Role",
      value: `${ROLE_CATEGORY_LABELS[input.roleCategory]} (${input.roleCategory})`,
    });
  }

  const title = input.role?.trim();
  if (title && title !== categoryLabel) {
    rows.push({ label: "Role title", value: title });
  }

  if (input.paymentPath && isPaymentPath(input.paymentPath)) {
    rows.push({
      label: "Payment path",
      value: `${PAYMENT_PATH_LABELS[input.paymentPath]} (${input.paymentPath})`,
    });
  }

  if (input.urgencyWindow && isUrgencyWindow(input.urgencyWindow)) {
    rows.push({
      label: "Urgency",
      value: `${URGENCY_WINDOW_LABELS[input.urgencyWindow]} (${input.urgencyWindow})`,
    });
  }

  return rows;
}
