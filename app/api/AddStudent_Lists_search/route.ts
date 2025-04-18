import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const searchField = searchParams.get("field") || "all";

    // 如果 query 為空，返回空陣列
    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const whereClauses = {
      OR: [
        ...(searchField === "all" || searchField === "student"
          ? [{ name: { contains: query, mode: "insensitive" } }]
          : []),
      ],
    };

    // 如果沒有有效的 where 條件，返回空陣列
    if (whereClauses.OR.length === 0) {
      return NextResponse.json([]);
    }

    const students = await db.student.findMany({
      where: whereClauses,
    });

    console.log("搜索條件:", whereClauses);
    console.log("返回學生:", students);

    return NextResponse.json(students);
  } catch (error) {
    console.error("搜尋失敗:", error);
    return NextResponse.json({ message: "內部服務器錯誤" }, { status: 500 });
  }
}