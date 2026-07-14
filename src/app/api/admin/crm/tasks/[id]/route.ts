export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await getConvexClient().mutation(api.crm.updateTask, {
      id,
      title: body.title,
      description: body.description,
      dueDate: body.due_date ?? body.dueDate,
      priority: body.priority,
      status: body.status,
      taskType: body.task_type ?? body.taskType,
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ message: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await getConvexClient().mutation(api.crm.deleteTask, { id });
    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ message: "Failed to delete task" }, { status: 500 });
  }
}
