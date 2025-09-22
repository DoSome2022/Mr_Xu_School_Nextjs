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
    const res = await db.student_school_timetable.findMany({
        where:{
            student_school_timetable_id :String(id)
        }
    });
    return NextResponse.json(res)
    }
}