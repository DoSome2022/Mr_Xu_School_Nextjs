import { db } from "@/lib/db";
import { NextResponse } from "next/server";


//  booklist data by schoolid/year/grade/id
export async function GET (
    req : Request , 
    {params}: {
        params:{ 
            SchoolId:string , 
            yearId:string,
            GradeId:number,
            id:string
},
    },
) {


    const { SchoolId , yearId  ,GradeId , id} = params;

    console.log("-- API params value -- : ",params,"-- end --")
   try {
         if(req.method === "GET") {

        
    const res = await db.booklist.findMany({
        where: {
            AND:[
        {school_booklist_id: SchoolId} ,
          {year: yearId}  ,
          {grade: Number(GradeId)},
          {id:id}
            ]

        }
    });

    console.log("-- API value -- : ",res,"-- end --")
          // 提取學校的書單列表

    return NextResponse.json(res, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',  // 額外添加回應頭部，強化禁用快取
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        })
     } 
   }catch (error) {
         console.error("Error fetching booklists:", error); return NextResponse.json({ error: "Error fetching booklists" }, { status: 500 });
    }
}

