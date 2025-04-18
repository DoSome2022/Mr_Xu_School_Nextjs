import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// all Course 
export async function GET (req : Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query") || "" ;
        const searchField = searchParams.get("field") || "all" ;

        const whereClauses = {
            OR:[
                ...(searchField === "all" || searchField === "course_name" ? [{  course_name: { contains: query , mode:"insensitive" } }] : []),
                ...(searchField === "all" || searchField === "course_subject" ? [{  course_subject: { contains: query , mode:"insensitive" } }] : []),
                ...(searchField === "all" || searchField === "persons" ? [{  persons: { contains: query , mode:"insensitive" } }] : []),
                ...(searchField === "all" || searchField === "teacher" ? [{  teacher: { contains: query , mode:"insensitive" } }] : []),
                ...(searchField === "all" || searchField === "grade" ? [{  grade: { contains: query , mode:"insensitive" } }] : []),
            ]
        }
        
        const publicholidays = await db.course.findMany({
            where:{
                ...whereClauses,
            },
        })
        return NextResponse.json(publicholidays)
    } catch (error) {
        console.error("搜尋失敗:", error);
        return NextResponse.json({ message: "內部服務器錯誤"}, { status: 500 });
    }

}