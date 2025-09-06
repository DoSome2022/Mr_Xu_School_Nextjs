// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// // all parents 
// export async function GET (req : Request) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const query = searchParams.get("query") || "" ;
//         const searchField = searchParams.get("field") || "all" ;

//         const whereClauses = {
//             OR:[
//                 ...(searchField === "all" || searchField === "username" ? [{  name: { contains: query , mode:"insensitive" } }] : []),
//                 ...(searchField === "all" || searchField === "nickname" ? [{  nickname: { contains: query , mode:"insensitive" } }] : []),
//                 ...(searchField === "all" || searchField === "email" ? [{  email: { contains: query , mode:"insensitive" } }] : []),
//                 ...(searchField === "all" || searchField === "phone" ? [{  phone: { contains: query , mode:"insensitive" } }] : []),
//             ]
//         }

//         const publicholidays = await db.user.findMany({
//             where:{
//                 ...whereClauses,
//                 role:"PARENT"
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
    const whereClauses: Prisma.UserWhereInput = {
      OR: [
        ...(searchField === "all" || searchField === "username"
          ? [{ username: { contains: query, mode: "insensitive" as QueryMode } }]
          : []),
        ...(searchField === "all" || searchField === "nickname"
          ? [{ nickname: { contains: query, mode: "insensitive" as QueryMode } }]
          : []),
        ...(searchField === "all" || searchField === "email"
          ? [{ email: { contains: query, mode: "insensitive" as QueryMode } }]
          : []),
        ...(searchField === "all" || searchField === "phone"
          ? [{ phone: { contains: query, mode: "insensitive" as QueryMode } }]
          : []),
      ],
      role: "PARENT",
    };

    // 如果沒有有效的 where 條件，返回空陣列
    if (whereClauses.OR?.length === 0) {
      return NextResponse.json([]);
    }

    const parents = await db.user.findMany({
      where: whereClauses,
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    console.log("搜索條件:", whereClauses);
    console.log("返回家長:", parents);

    return NextResponse.json(parents);
  } catch (error) {
    console.error("搜尋失敗:", error);
    return NextResponse.json({ message: "內部服務器錯誤" }, { status: 500 });
  }
}