import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all school
export async function GET (req : Request , {params}:{params:{id:string},},) {

    const { id } = params;
    if(req.method === "GET") {
    const res = await db.school.findMany({
        where:{
            id:String(id)
        },include:{
                school_EX_Day: true,
                school_booklist: true,
                school_ex_pager: true,
                school_ex_scope: true,
                school_ex_timetable: true,
                school_timetable: true,
                school_score:true,
                school_subject:true,
            }
    });
    return NextResponse.json(res)
    }

}