import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(
    req : Request,
    {params}:{
        params:{
            id:string
        }
    }
) {

    const { id } = params;



    console.log("-- API params value -- : ",params,"-- end --")

    try {
        
        if(req.method === "GET") {
            const res = await db.staffUser.findMany({
                where:{
                    id :String(id)
                },
                include:{
                    Course:{
                        include:{
                            student:true
                        }
                    }
                }
            });

                console.log("-- API value -- : ",res,"-- end --")
          // 提取學校的考試卷列表

    return NextResponse.json(res)

        }


        
    } catch (error) {
        console.error("Error fetching teacherCourse :", error); return NextResponse.json({ error: "Error fetching teacherCourse" }, { status: 500 });
    }


}