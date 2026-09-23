import assert from "node:assert/strict";
import test from "node:test";
import {
  CASH_FIELD_PROMPTS,
  buildStoredRole,
  cashFieldRows,
  describeCashFields,
  mapPayerToPaymentPath,
} from "./transformation-cash-fields";

test("PIPE A prompts stay on the copy Rob needs to sign off", () => {
  assert.equal(CASH_FIELD_PROMPTS.employer, "Which district or organization do you support?");
  assert.equal(CASH_FIELD_PROMPTS.role, "Are you a school-based BCBA, clinic-based BCBA, or other?");
  assert.equal(
    CASH_FIELD_PROMPTS.payment,
    "How do you expect to cover the $1,997 program — self-pay, district PO, or district card?",
  );
  assert.equal(
    CASH_FIELD_PROMPTS.urgency,
    "When do you need to decide — this month, this quarter, this year, or still exploring?",
  );
});

test("maps legacy payer values onto canonical payment_path", () => {
  assert.equal(mapPayerToPaymentPath("self"), "self_pay");
  assert.equal(mapPayerToPaymentPath("district_po"), "district_po");
  assert.equal(mapPayerToPaymentPath("district_card"), "district_card");
  assert.equal(mapPayerToPaymentPath("unsure"), "unknown");
  assert.equal(mapPayerToPaymentPath("self_pay"), "self_pay");
  assert.equal(mapPayerToPaymentPath("not-a-path"), null);
});

test("keeps a free-text role title and falls back to the enum label", () => {
  assert.equal(buildStoredRole("school_bcba", "Lead district BCBA"), "Lead district BCBA");
  assert.equal(buildStoredRole("clinic_bcba", "  "), "Clinic-based BCBA");
});

test("admin cash rows show canonical enums without inventing a role title", () => {
  assert.deepEqual(
    cashFieldRows({
      employer: "Springfield USD",
      role: "School-based BCBA",
      roleCategory: "school_bcba",
      paymentPath: "district_po",
      urgencyWindow: "this_quarter",
    }),
    [
      { label: "Employer", value: "Springfield USD" },
      { label: "Role", value: "School-based BCBA (school_bcba)" },
      { label: "Payment path", value: "District PO (district_po)" },
      { label: "Urgency", value: "This quarter (this_quarter)" },
    ],
  );

  assert.deepEqual(
    describeCashFields({
      employer: "Springfield USD",
      roleCategory: "other",
      roleTitle: "Program specialist",
      paymentPath: "unknown",
      urgencyWindow: "exploring",
    }),
    [
      "Employer: Springfield USD",
      "Role: Other (other)",
      "Role title: Program specialist",
      "Payment path: Not sure yet (unknown)",
      "Decision window: Still exploring (exploring)",
    ],
  );
});
