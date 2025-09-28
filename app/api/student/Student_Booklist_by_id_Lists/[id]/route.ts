import { db } from "@/lib/db";
import { NextResponse } from "next/server"; 

// student_ExScope_List
export async function GET (
    req : Request ,
    {params} : {params:{id:string}}
) {
console.log(" API__ :  ",params,"__  END __")
const { id } = params;
if(req.method === "GET"){
    const res = await db.student_booklist.findMany({
        where:{
            student_booklist_id :String(id)
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