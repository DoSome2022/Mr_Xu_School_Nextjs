import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';  // 強制動態渲染，等同於每個 fetch 使用 no-store 和 revalidate: 0
export const fetchCache = 'force-no-store';  // 強制禁用所有 fetch 快取
export const revalidate = 0;  // 設定重新驗證時間為 0 秒，確保每次請求動態執行

//  Ex_pager data by schoolid/year/grade/quarter/subject

export async function GET (
    req : Request , 
    {params}: {
        params:{ 
            SchoolId:string , 
            yearId:string,
            GradeId:number,
            quarter:number,
            subject:string,
},
    },
) {

    const { SchoolId , yearId  ,GradeId ,quarter ,subject } = params;

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

            ]

        }
    });

    console.log("-- API value -- : ",res,"-- end --")
          // 提取學校的考試卷列表

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
    
return NextResponse.json({ error: 'Method Not Allowed! 方法不允許!' }, { status: 405 });
}

