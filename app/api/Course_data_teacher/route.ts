import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all teacher data list
export async function GET (req : Request) {
    if(req.method === "GET") {
    const res = await db.staffUser.findMany();
    return NextResponse.json(res)
    }

}

