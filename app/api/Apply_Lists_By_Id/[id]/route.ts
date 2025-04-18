import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all Apply_lists
export async function GET (req : Request , {params} : {params:{id:string}}) {

    const { id } = params;

    if(req.method === "GET") {
    const res = await db.apply.findUnique({
        where:{ id: String(id) },
        include:{
            student: true,
        }
    });
    return NextResponse.json(res)
    }

}