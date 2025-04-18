"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Score_Create_Schema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        school_name,
        school_score_id,
        subject,
        grade,
        score,
        quarter
        } = data;

    let score_Data;

    try {
        score_Data = await db.score.create({
            data:{
                school_name : school_name,
                school_score_id : school_score_id,
                subject : subject,
                grade : grade,
                score : score,
                quarter : quarter
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- score_Data -- : " , score_Data , " -- End -- ")
    return { data: score_Data }
}

export const createScore = CreateSafeAction(Score_Create_Schema, handler)