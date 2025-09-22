import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all class 
export async function GET (req : Request) {
    if(req.method === "GET") {
    const res = await db.class.findMany();
    return NextResponse.json(res)
    }

}