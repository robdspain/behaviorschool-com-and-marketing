export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";

function toTaskRow(task: any) {
  return {
    id: task._id,
    title: task.title,
    description: task.description ?? null,
    contact_id: task.contactId,
    contact_name: task.contactName ?? "Unknown Contact",
    due_date: task.dueDate,
    priority: task.priority,
    status: task.status,
    task_type: task.taskType,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
    completed_at: task.completedAt ?? null,
  };
}

export async function GET() {
  try {
    const tasks = await getConvexClient().query(api.crm.listTasks, {});
    return NextResponse.json(tasks.map(toTaskRow), { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      contactId,
      dueDate,
      priority = "medium",
      taskType = "follow_up",
    } = body;

    if (!title || !contactId || !dueDate) {
      return NextResponse.json(
        { message: "Title, contact, and due date are required" },
        { status: 400 }
      );
    }

    const client = getConvexClient();
    const id = await client.mutation(api.crm.createTask, {
      title,
      description: description || undefined,
      contactId,
      dueDate,
      priority,
      taskType,
    });
    const tasks = await client.query(api.crm.listTasks, {});
    const task = tasks.find((row: any) => row._id === id);
    return NextResponse.json(toTaskRow(task), { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ message: "Failed to create task" }, { status: 500 });
  }
}
