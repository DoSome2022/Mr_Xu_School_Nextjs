// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// // all Course 
// export async function GET (req : Request) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const query = searchParams.get("query") || "" ;
//         const searchField = searchParams.get("field") || "all" ;

//         const whereClauses = {
//             OR:[
//                 ...(searchField === "all" || searchField === "course_name" ? [{  course_name: { contains: query , mode:"insensitive" } }] : []),
//                 ...(searchField === "all" || searchField === "course_subject" ? [{  course_subject: { contains: query , mode:"insensitive" } }] : []),
//                 ...(searchField === "all" || searchField === "persons" ? [{  persons: { contains: query , mode:"insensitive" } }] : []),
//                 ...(searchField === "all" || searchField === "teacher" ? [{  teacher: { contains: query , mode:"insensitive" } }] : []),
//                 ...(searchField === "all" || searchField === "grade" ? [{  grade: { contains: query , mode:"insensitive" } }] : []),
//             ]
//         }
        
//         const publicholidays = await db.course.findMany({
//             where:{
//                 ...whereClauses,
//             },
//         })
//         return NextResponse.json(publicholidays)
//     } catch (error) {
//         console.error("搜尋失敗:", error);
//         return NextResponse.json({ message: "內部服務器錯誤"}, { status: 500 });
//     }

// }


import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';  // 強制動態渲染，等同於每個 fetch 使用 no-store 和 revalidate: 0
export const fetchCache = 'force-no-store';  // 強制禁用所有 fetch 快取
export const revalidate = 0;  // 設定重新驗證時間為 0 秒，確保每次請求動態執行

// 定義型別
type QueryMode = "default" | "insensitive";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim() || "";
    const searchField = searchParams.get("field") || "all";

    // 如果 query 為空，返回空陣列
    if (!query) {
      return NextResponse.json([]);
    }

    // 定義 where 條件
    const whereClauses: Prisma.CourseWhereInput = {
      OR: [
        ...(searchField === "all" || searchField === "course_name"
          ? [{ course_name: { contains: query, mode: "insensitive" as QueryMode } }]
          : []),
        ...(searchField === "all" || searchField === "course_subject"
          ? [{ course_subject: { contains: query, mode: "insensitive" as QueryMode } }]
          : []),
        ...(searchField === "all" || searchField === "teacher"
          ? [{ teacher: { contains: query, mode: "insensitive" as QueryMode } }]
          : []),
        ...(searchField === "all" || searchField === "persons"
          ? [{ persons: { equals: parseInt(query) || undefined } }]
          : []),
        ...(searchField === "all" || searchField === "grade"
          ? [{ grade: { equals: parseInt(query) || undefined } }]
          : []),
      ],
    };

    // 如果沒有有效的 where 條件，返回空陣列
    if (whereClauses.OR?.length === 0) {
      return NextResponse.json([]);
    }

    const courses = await db.course.findMany({
      where: whereClauses,
      select: {
        id: true,
        course_name: true,
        course_subject: true,
        grade: true,
        persons: true,
        teacher: true,
        craetedAt: true,
      },
    });

    console.log("搜索條件:", whereClauses);
    console.log("返回課程:", courses);

    return NextResponse.json(courses, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',  // 額外添加回應頭部，強化禁用快取
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
  } catch (error) {
    console.error("搜尋失敗:", error);
    return NextResponse.json({ message: "內部服務器錯誤" }, { status: 500 });
  }
}