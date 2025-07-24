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
    return NextResponse.json(res)
    }
}