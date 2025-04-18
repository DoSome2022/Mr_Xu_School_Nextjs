import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { date } from "zod";

// Get parent_data
export async function GET (req : Request , {params}:{params:{userId:string}}) {

    const {userId} = params;


    if(req.method === "GET") {
    const res = await db.user.findMany({
        where:{
            id:String(userId)
        },
    });
    return NextResponse.json(res)
    }

}