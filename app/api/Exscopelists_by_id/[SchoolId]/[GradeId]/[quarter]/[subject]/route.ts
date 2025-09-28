import { db } from "@/lib/db";
import { NextResponse } from "next/server";


//  ExScopelist data by school id/year/grade

export async function GET (
    req : Request , 
    {params}: {
        params:{ 
            SchoolId:string, 
            quarter:number,
            GradeId:number,
            subject:string,

},
    },
) {

    const { SchoolId , quarter  ,GradeId , subject } = params;

    console.log("-- API params value -- : ",params,"-- end --")
   try {
         if(req.method === "GET") {

        
    const res = await db.ex_scope.findMany({
        where: {
            AND:[
        {school_ex_scope_id: SchoolId} ,
        {quarter: Number(quarter)}  ,
        {grade: Number(GradeId)} ,
        {subject:subject},

            ]

        }
    });

    console.log("-- API value -- : ",res,"-- end --")
          // 提取學校的考試範圍列表

    return NextResponse.json(res, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',  // 額外添加回應頭部，強化禁用快取
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        })
     } 
   }catch (error) {
         console.error("Error fetching booklists:", error); 
         return NextResponse.json({ error: "Error fetching booklists" }, 
        { status: 500 });
    }
}

