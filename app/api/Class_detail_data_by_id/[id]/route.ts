import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all class 
export async function GET (req : Request,{params}:{params:{id:string}}) {
    const { id } = params;
    if(req.method === "GET") {
    const res = await db.class.findMany({
        where:{id : String(id)},
        include:{
            student:true,
            addClass:true,
        }
    });
    return NextResponse.json(res)
    }

}