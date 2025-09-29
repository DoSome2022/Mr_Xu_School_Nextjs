import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';  // 強制動態渲染，等同於每個 fetch 使用 no-store 和 revalidate: 0
export const fetchCache = 'force-no-store';  // 強制禁用所有 fetch 快取
export const revalidate = 0;  // 設定重新驗證時間為 0 秒，確保每次請求動態執行
export async function GET(req: Request, {params}: { params: { id: string } }){
    const { id } = params;

    console.log("-- API params value -- : ",params,"-- end --")

    try {
        if(req.method === "GET") {
            const res = await db.staffUser.findMany({
                where: {
                    id: String(id)
                },include:{
                    Course: {
                        include: {
                            class: {
                                include: {
                                    student: true
                                }
                            }
                            
                        }
                    },
                    
                    Student: true,
                    teacher_time_work: true,
                    teacher_upload_node:true,
                    teacher_node:true,

                }
            });
            console.log("-- API value -- : ",res,"-- end --")
            return NextResponse.json(res, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',  // 額外添加回應頭部，強化禁用快取
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

        }


    } catch (error) {
        console.error("Error fetching teacher:", error); return NextResponse.json({ error: "Error fetching booklists" }, { status: 500 });
    }


}