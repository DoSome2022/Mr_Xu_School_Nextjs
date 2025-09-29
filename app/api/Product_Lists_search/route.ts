// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// // all product 
// export async function GET (req : Request) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const query = searchParams.get("query") || "" ;
//         const searchField = searchParams.get("field") || "all" ;

//         const whereClauses = {
//             OR:[
//                 ...(searchField === "all" || searchField === "name" ? [{  name: { contains: query , mode:"insensitive" } }] : []),
//                 ...(searchField === "all" || searchField === "description" ? [{ description:{ contains: query, mode:"insensitive" } }] : []),
//                 ...(searchField === "all" || searchField === "price" ? [{  price: { contains: query , mode:"insensitive" } }] : []),
//             ]
//         }

//         const publicholidays = await db.product.findMany({
//             where:{
//                 ...whereClauses
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

    // 驗證價格格式（如果搜索 price）
    let priceValue: number | undefined;
    if (searchField === "all" || searchField === "price") {
      const parsedPrice = parseFloat(query);
      if (isNaN(parsedPrice)) {
        return NextResponse.json({ message: "無效的價格格式" }, { status: 400 });
      }
      priceValue = parsedPrice;
    }

    // 定義 where 條件
    const whereClauses: Prisma.ProductWhereInput = {
      OR: [
        ...(searchField === "all" || searchField === "name"
          ? [{ name: { contains: query, mode: "insensitive" as QueryMode } }]
          : []),
        ...(searchField === "all" || searchField === "description"
          ? [{ description: { contains: query, mode: "insensitive" as QueryMode } }]
          : []),
        ...(searchField === "all" || searchField === "price"
          ? [{ price: { equals: priceValue } }]
          : []),
      ],
    };

    // 如果沒有有效的 where 條件，返回空陣列
    if (whereClauses.OR?.length === 0) {
      return NextResponse.json([]);
    }

    const products = await db.product.findMany({
      where: whereClauses,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
    });

    console.log("搜索條件:", whereClauses);
    console.log("返回產品:", products);

    return NextResponse.json(products, {
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