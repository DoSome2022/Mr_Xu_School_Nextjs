import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';  // 強制動態渲染，等同於每個 fetch 使用 no-store 和 revalidate: 0
export const fetchCache = 'force-no-store';  // 強制禁用所有 fetch 快取
export const revalidate = 0;  // 設定重新驗證時間為 0 秒，確保每次請求動態執行

// parents detail by id
export async function GET (req : Request, {params}:{params:{id:string}}) {
    
    const { id } = params;
    
    if(req.method === "GET") {
    const res = await db.user.findMany({
        where:{
            id:String(id)
        },include:{
            Student:{
                include:{
                    course:true,
                    apply:true
                }
            },
            Message:true,
            Price_record:true,
            Receipt:true,
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
 return NextResponse.json({ error: 'Method Not Allowed! 方法不允許!' }, { status: 405 });
}