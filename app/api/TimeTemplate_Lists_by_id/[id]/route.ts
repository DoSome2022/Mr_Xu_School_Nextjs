import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all timetemplate 
export async function GET (req : Request, {params}:{params:{id:string}}) {

    const { id } = params;

    if(req.method === "GET") {
    const res = await db.timetemplate.findMany({
        where:{
            id: String(id)

        }
    });
    return NextResponse.json(res)
    }
}