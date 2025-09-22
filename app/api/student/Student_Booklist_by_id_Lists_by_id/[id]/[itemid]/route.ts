import { db } from "@/lib/db";
import { NextResponse } from "next/server"; 

// student_ExScope_List
export async function GET (
    req : Request ,
    {params} : {params:{
        id:string
        itemid: string
    }}
) {
console.log(" API__ :  ",params,"__  END __")
const { id , itemid} = params;
if(req.method === "GET"){
    const res = await db.student_booklist.findMany({
        where:{
            AND:[
             {student_booklist_id :String(id) },
             {id:itemid}  
            ]
            
        }
    });
    return NextResponse.json(res)
    }
}