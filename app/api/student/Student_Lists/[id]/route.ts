import { db } from "@/lib/db";
import { NextResponse } from "next/server"; 

// all students
export async function GET (
    req : Request ,
    {params} : {params:{id:string}}
) {
console.log(params)
const { id } = params;
if(req.method === "GET"){
    const res = await db.student.findMany({
        where:{
            student_parent_data_id :String(id)
        },include:{
            Parent_data: true,
            student_class: true,
            course: {
                include:{
                    class:true,
                }
            },
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