import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// parents detail by id
export async function GET (req : Request, {params}:{params:{id:string}}) {
    
    const { id } = params;
    
    if(req.method === "GET") {
    const res = await db.user.findMany({
        where:{
            id:String(id)
        },include:{
            Student:{
                include:{
                    course:true,
                    apply:true
                }
            },
            Message:true,
            Price_record:true,
            Receipt:true,
        }

    });
    return NextResponse.json(res)
    }

}