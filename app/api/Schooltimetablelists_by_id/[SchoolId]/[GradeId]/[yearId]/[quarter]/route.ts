import { db } from "@/lib/db";
import { NextResponse } from "next/server";


//  school_timetable data by schoolid/grade/year/quarter/subject/id

export async function GET (
    req : Request , 
    {params}: {
        params:{ 
            SchoolId:string , 
            yearId:string,
            GradeId:number,
            quarter:number,


},
    },
) {

    const { SchoolId , yearId  ,GradeId ,quarter } = params;

    console.log("-- API params value -- : ",params,"-- end --")
   try {
         if(req.method === "GET") {

        
    const res = await db.school_timetable.findMany({
        where: {
            AND:[
           {school_school_timetable_id: SchoolId} ,
          {year: yearId}  ,
          {grade: Number(GradeId)},
          {quarter: Number(quarter)},


            ]

        }
    });

    console.log("-- API value -- : ",res,"-- end --")
          // 提取學校的學校時間表列表

    return NextResponse.json(res)
     } 
   }catch (error) {
         console.error("Error fetching booklists:", error); return NextResponse.json({ error: "Error fetching booklists" }, { status: 500 });
    }
}
