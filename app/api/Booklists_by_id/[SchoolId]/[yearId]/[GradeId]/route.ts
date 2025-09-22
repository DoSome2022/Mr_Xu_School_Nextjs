import { db } from "@/lib/db";
import { NextResponse } from "next/server";


//  booklist data by school id/year/grade
export async function GET (
    req : Request , 
    {params}: {
        params:{ 
            SchoolId:string , 
            yearId:string,
            GradeId:number
},
    },
) {

    const { SchoolId , yearId  ,GradeId} = params;

    console.log("-- API params value -- : ",params,"-- end --")
   try {
         if(req.method === "GET") {

        
    const res = await db.booklist.findMany({
        where: {
            AND:[
           {school_booklist_id: SchoolId} ,
          {year: yearId}  ,
          {grade: Number(GradeId)}
            ]

        }
    });

    console.log("-- API value -- : ",res,"-- end --")
          // 提取學校的書單列表

    return NextResponse.json(res)
     } 
   }catch (error) {
         console.error("Error fetching booklists:", error); return NextResponse.json({ error: "Error fetching booklists" }, { status: 500 });
    }
}

//  booklist data by school id
// export async function GET (
//     req : Request , 
//     {params}: {
//         params:{ 
//             SchoolId:string 
// }}) {

//     const { SchoolId } = params;

//     console.log("-- API params value -- : ",params,"-- end --")
//    try {
//          if(req.method === "GET") {
//      const res = await db.booklist.findMany({
//         where: {
//             school_booklist_id: String(SchoolId),

//         }
//     });
         


//     console.log("-- API value -- : ",res,"-- end --")
//           // 提取學校的書單列表

//     return NextResponse.json(res)
//     } 
//    }catch (error) {
//          console.error("Error fetching booklists:", error); return NextResponse.json({ error: "Error fetching booklists" }, { status: 500 });
//     }
// }

