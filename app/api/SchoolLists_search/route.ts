import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (req : Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query") || "" ;
        const searchField = searchParams.get("field") || "all" ;

        const whereClauses = {
            OR:[
                ...(searchField === "all" || searchField === "school_name" ? [{  school_name: { contains: query , mode:"insensitive" } }] : []),
            ]
        }

        const publicholidays = await db.school.findMany({
            where:{
                ...whereClauses
            },
        })
        return NextResponse.json(publicholidays)
    } catch (error) {
        console.error("搜尋失敗:", error);
        return NextResponse.json({ message: "內部服務器錯誤"}, { status: 500 });
    }

}