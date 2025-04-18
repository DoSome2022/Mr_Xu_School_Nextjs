import { db } from "@/lib/db";
import { NextResponse } from "next/server";


//  Ex_pager data by schoolid/year/grade/quarter/subject/id

export async function GET (
    req : Request , 
    {params}: {
        params:{ 
            SchoolId:string , 
            yearId:string,
            GradeId:number,
            quarter:number,
            subject:string,
            id:string
},
    },
) {

    const { SchoolId , yearId  ,GradeId ,quarter ,subject ,id} = params;

    console.log("-- API params value -- : ",params,"-- end --")
   try {
         if(req.method === "GET") {

        
    const res = await db.ex_pager.findMany({
        where: {
            AND:[
        {school_ex_pager_id: SchoolId} ,
        {year: yearId}  ,
        {grade: Number(GradeId)},
        {quarter: Number(quarter)},
        {subject: subject},
        {id: id}

            ]

        }
    });

    console.log("-- API value -- : ",res,"-- end --")
          // 提取學校的考試卷列表

    return NextResponse.json(res)
     } 
   }catch (error) {
         console.error("Error fetching booklists:", error); return NextResponse.json({ error: "Error fetching booklists" }, { status: 500 });
    }
}

