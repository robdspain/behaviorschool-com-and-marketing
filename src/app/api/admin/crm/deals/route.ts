export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";

function toDealRow(deal: any) {
  return {
    id: deal._id,
    title: deal.title,
    contact_id: deal.contactId,
    contact_name: deal.contactName ?? "Unknown Contact",
    value: deal.value,
    stage: deal.stage,
    probability: deal.probability,
    expected_close_date: deal.expectedCloseDate ?? deal.createdAt,
    payment_option: deal.paymentOption ?? null,
    created_at: deal.createdAt,
    updated_at: deal.updatedAt,
  };
}

export async function GET() {
  try {
    const deals = await getConvexClient().query(api.crm.listDeals, {});
    return NextResponse.json(deals.map(toDealRow), { status: 200 });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json({ message: "Failed to fetch deals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      contactId,
      value,
      stage = "qualification",
      probability = 50,
      expectedCloseDate,
    } = body;

    if (!title || !contactId || !value) {
      return NextResponse.json(
        { message: "Title, contact, and value are required" },
        { status: 400 }
      );
    }

    const client = getConvexClient();
    const id = await client.mutation(api.crm.createDeal, {
      title,
      contactId,
      value: Number(value),
      stage,
      probability: Number(probability),
      expectedCloseDate: expectedCloseDate || undefined,
    });
    const deals = await client.query(api.crm.listDeals, {});
    const deal = deals.find((row: any) => row._id === id);
    return NextResponse.json(toDealRow(deal), { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json({ message: "Failed to create deal" }, { status: 500 });
  }
}
