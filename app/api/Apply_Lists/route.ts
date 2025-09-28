import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all Apply_lists
export async function GET (req : Request) {
    if(req.method === "GET") {
    const res = await db.apply.findMany({
        include:{
            student: {
                include:{
                    Parent_data: true,
                }
            }
        }
    });
    return NextResponse.json(res, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',  // 額外添加回應頭部，強化禁用快取
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        })
    }
    return NextResponse.json({ message: "內部服務器錯誤" }, { status: 500 });
}