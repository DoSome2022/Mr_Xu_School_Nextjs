import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all parents 
export async function GET (req : Request) {
    if(req.method === "GET") {
    const res = await db.user.findMany();
    return NextResponse.json(res)
    }

}