import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all Course 
export async function GET (req : Request) {
    if(req.method === "GET") {
    const res = await db.course.findMany();
    return NextResponse.json(res)
    }
}