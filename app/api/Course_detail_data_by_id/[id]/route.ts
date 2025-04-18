import { db } from "@/lib/db";
import { NextResponse } from "next/server";

//  Course by id
export async function GET (req : Request , {params}:{params:{id:string}}) {
    const { id } = params;
    if(req.method === "GET") {
    const res = await db.course.findUnique({
        where:{ id: String(id) },
        include:{
            class: {
                include:{
                    student:true
                }
            },
            student: true,
            Teacher_data: true
        }
    });
    return NextResponse.json(res)
    }

}