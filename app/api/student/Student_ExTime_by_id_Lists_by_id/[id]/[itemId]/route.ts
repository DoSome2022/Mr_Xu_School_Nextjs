import { db } from "@/lib/db";
import { NextResponse } from "next/server"; 

// student_ExScope_List
export async function GET (
    req : Request ,
    {params} : {params:{
        id:string
        itemid: string
    }}
) {
console.log(" API__ :  ",params,"__  END __")
const { id, itemid } = params;
if(req.method === "GET"){
    const res = await db.student_ex_timetable.findMany({
        where:{
            AND:[
                {student_ex_timetable_id :String(id)},
                {id:itemid}

            ]
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