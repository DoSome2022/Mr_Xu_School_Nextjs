import { db } from "@/lib/db";
import { NextResponse } from "next/server"; 

//students_detail_data_by_id

export async function GET (
    req: Request , 
    {params} : {params:{id:string}}
){
    console.log(params);
    const { id } = params;
    if(req.method === "GET"){
        const res = await db.student.findMany({
            where:{
                id: String(id)
            },include:{
                BookList:true,
                EX_Paper:true,
                EX_scope:true,
                EX_Time:true,
                SC_Timetable:true,
                Score:true,
                course:true,
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