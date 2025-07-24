import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET (req : Request) {
    if(req.method === "GET") {
    const res = await db.classroom.findMany(
        {include:{
            Course: true,
            Class:{include:{
                student:true,
                class_course:true,
                addClass:true,
                change_class:true,
                Leave:true
            }},
        }}
    );
    return NextResponse.json(res)
    }

}