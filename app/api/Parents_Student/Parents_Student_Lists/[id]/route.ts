import { db } from "@/lib/db"; 
import { NextResponse } from "next/server"; 

export async function GET(
    req : Request,
    {params} : {params:{id:string}}
){
    console.log(" API__ :  ",params,"__  END __")
    const { id } = params;
    if(req.method === "GET"){
        const res = await db.student.findMany({
            where:{
                id :String(id)
            },include:{
                BookList:true,
                EX_Paper:true,
                EX_scope:true,
                EX_Time:true,
                SC_Timetable:true,
                Score:true,
                course:true,
            }
        })
        return NextResponse.json(res)
    }
}