"use server";
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Student_ExDay_Update_Schema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {

    const { parentid , studentid , chine_ex , math_ex , eng_ex } =data;

    let Student_ExDay_Update;

    try {
        Student_ExDay_Update = await db.student.update({
            where:{
                id:studentid,
            },
            data:{
                chine_ex:chine_ex,
                math_ex:math_ex,
                eng_ex:eng_ex,
            }
        });

        revalidatePath(`/parent/${parentid}/profiles/`)
    } catch (error) {
        console.log(error)
    }
    console.log("-- Student_ExDay_Update -- : " , Student_ExDay_Update , " -- End -- ")

    return redirect(`/parent/${parentid}/profiles/`);
}

export const Student_ExDay_Update_Action = CreateSafeAction(Student_ExDay_Update_Schema , handler);