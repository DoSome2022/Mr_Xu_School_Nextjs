import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// news detail by id 
export async function GET (req : Request,  {params}:{params:{id:string}}) {
    
    const { id } = params;
    
    if(req.method === "GET") {
    const res = await db.news.findMany({    
        where:{
        id: String(id)
    }}
    );
    return NextResponse.json(res)
    }

}