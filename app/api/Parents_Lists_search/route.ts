import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all parents 
export async function GET (req : Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query") || "" ;
        const searchField = searchParams.get("field") || "all" ;

        const whereClauses = {
            OR:[
                ...(searchField === "all" || searchField === "username" ? [{  name: { contains: query , mode:"insensitive" } }] : []),
                ...(searchField === "all" || searchField === "nickname" ? [{  nickname: { contains: query , mode:"insensitive" } }] : []),
                ...(searchField === "all" || searchField === "email" ? [{  email: { contains: query , mode:"insensitive" } }] : []),
                ...(searchField === "all" || searchField === "phone" ? [{  phone: { contains: query , mode:"insensitive" } }] : []),
            ]
        }

        const publicholidays = await db.user.findMany({
            where:{
                ...whereClauses,
                role:"PARENT"
            },
        })
        return NextResponse.json(publicholidays)
    } catch (error) {
        console.error("搜尋失敗:", error);
        return NextResponse.json({ message: "內部服務器錯誤"}, { status: 500 });
    }

}