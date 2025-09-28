"use server";
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { School_Update_Schema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            school_id,
            school_name
        } = data;

        console.log(" -- server date -- : ", data ,"-- END --")

    let school_data;

    try {
        school_data = await db.school.update({
            where:{
                id: school_id
            },data:{
                school_name: school_name
            }
        });
        revalidatePath("/admin/schoolLists")
    } catch (error) {
        console.log(error)
    }
    console.log("-- update school_Data -- : " , school_data , " -- End -- ")
    return redirect("/admin/schoolLists");
}

export const update_School_action= CreateSafeAction(School_Update_Schema, handler)