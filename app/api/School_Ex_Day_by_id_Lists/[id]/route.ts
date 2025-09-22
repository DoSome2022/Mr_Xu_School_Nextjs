import { db } from "@/lib/db"; 
import { NextResponse } from "next/server";

export async function GET (req : Request,  {params}:{params:{id:string}}) {
    const { id } = params;

    if(req.method === "GET"){
        const res = await db.school_EX_Day.findMany({
            where:{
                school_ex_day_id: String(id)
            }
        });
        return NextResponse.json(res)
    }

}