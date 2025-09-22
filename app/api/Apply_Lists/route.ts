import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all Apply_lists
export async function GET (req : Request) {
    if(req.method === "GET") {
    const res = await db.apply.findMany({
        include:{
            student: {
                include:{
                    Parent_data: true,
                }
            }
        }
    });
    return NextResponse.json(res)
    }

}