import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all timetemplate 
export async function GET (req : Request) {
    if(req.method === "GET") {
    const res = await db.timetemplate.findMany();
    return NextResponse.json(res)
    }
}