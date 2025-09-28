import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all timetemplate 
export async function GET (req : Request) {
    if(req.method === "GET") {
    const res = await db.timetemplate.findMany();
    return NextResponse.json(res, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',  // 額外添加回應頭部，強化禁用快取
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        })
    }
    return NextResponse.json({ error: 'Method Not Allowed! 方法不允許!' }, { status: 405 });
}