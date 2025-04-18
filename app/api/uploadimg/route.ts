// /api/upload/route.ts
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const data = await request.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(process.cwd(), "public/uploads", `${Date.now()}-${file.name}`);
  await writeFile(filePath, buffer);

  const relativePath = `/uploads/${path.basename(filePath)}`;
  return NextResponse.json({ path: relativePath });
}