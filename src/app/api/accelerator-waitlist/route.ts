import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { name, email, role } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "accelerator-waitlist.json");

    await fs.mkdir(dataDir, { recursive: true });

    let current: any[] = [];
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      current = JSON.parse(existing);
      if (!Array.isArray(current)) current = [];
    } catch (e) {
      current = [];
    }

    const entry = {
      name: name || "",
      email,
      role: role || "",
      source: "transformation-program",
      createdAt: new Date().toISOString(),
    };

    current.unshift(entry);
    await fs.writeFile(filePath, JSON.stringify(current, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
