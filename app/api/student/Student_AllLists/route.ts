import { db } from "@/lib/db";
import { NextResponse } from "next/server"; 


export async function GET (req : Request) {

    console.log("server is coming");
    if(req.method === "GET") {
    const res = await db.student.findMany({
        include:{
            student_class: true,
            Parent_data:true
        }
    });
    return NextResponse.json(res)
    }

}