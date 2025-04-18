"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Node_Create_Schema } from "./schema";
import { redirect } from "next/navigation";

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            name,
            title,
            subject,
            author,
            img,
            answer,
            node_lesson,
            grade,
            language,
            teacher

        } = data;

    let node_data;

    try {
        node_data = await db.node.create({
            data:{
                name : name,
                title : title,
                subject : subject,
                author : author,
                img : img,
                answer : answer,
                node_lesson : node_lesson,
                grade : grade,
                language : language,
                teacher : teacher
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- node_Data -- : " , node_data , " -- End -- ")
    return { data: node_data }
}

export const createNode = CreateSafeAction(Node_Create_Schema, handler)