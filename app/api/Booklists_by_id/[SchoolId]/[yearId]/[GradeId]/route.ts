import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export const dynamic = 'force-dynamic';  // 強制動態渲染，等同於每個 fetch 使用 no-store 和 revalidate: 0
export const fetchCache = 'force-no-store';  // 強制禁用所有 fetch 快取
export const revalidate = 0;  // 設定重新驗證時間為 0 秒，確保每次請求動態執行

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

