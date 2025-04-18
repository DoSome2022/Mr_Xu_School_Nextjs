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
                student_class: true,
                BookList:true,
                EX_Paper:true,
                EX_scope:true,
                EX_Time:true,
                SC_Timetable:true,
                Score:true,
                course:true,
                dailyreview:true
            }
        });
        return NextResponse.json(res)
    }
}