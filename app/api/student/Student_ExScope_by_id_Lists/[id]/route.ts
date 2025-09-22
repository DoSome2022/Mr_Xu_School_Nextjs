import { db } from "@/lib/db";
import { NextResponse } from "next/server"; 

// student_ExScope_List
export async function GET (
    req : Request ,
    {params} : {params:{id:string}}
) {
console.log(" API__ :  ",params,"__  END __")
const { id } = params;
if(req.method === "GET"){
    const res = await db.student_ex_scope.findMany({
        where:{
            student_ex_scope_id :String(id)
        }
    });
    return NextResponse.json(res)
    }
}