import { db } from "@/lib/db";
import { NextResponse } from "next/server";


//  (DB.user)teacher data by id (detail get teacher data)
export async function GET (req : Request , {params}: {params:{id:string}}) {
    const { id } = params;
    if(req.method === "GET") {
    const res = await db.user.findUnique({
        where: {id: String(id)},
        include:{
            teacher_data: true,
            lC: true
        }
    });
    return NextResponse.json(res)
    }

}

