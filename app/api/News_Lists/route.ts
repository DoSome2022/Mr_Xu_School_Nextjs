import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all news 
export async function GET (req : Request) {
    if(req.method === "GET") {
    const res = await db.news.findMany();
    return NextResponse.json(res)
    }

}