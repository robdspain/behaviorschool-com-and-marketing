import { v } from "convex/values";

export const roleCategory = v.union(
  v.literal("school_bcba"),
  v.literal("clinic_bcba"),
  v.literal("other"),
);

export const paymentPath = v.union(
  v.literal("self_pay"),
  v.literal("district_po"),
  v.literal("district_card"),
  v.literal("unknown"),
);

export const urgencyWindow = v.union(
  v.literal("this_month"),
  v.literal("this_quarter"),
  v.literal("this_year"),
  v.literal("exploring"),
);
