"use server";

import { InputType, ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { redirect } from "next/navigation"; 
import { Create_Color_Schema } from "./schema";

const handler = async (data: InputType) : Promise<ReturnType> => {

    const {color_name  } = data;

    let color_data;

    try {
        color_data = await db.color.create({
            data: {
                color_name: color_name,
            },
        });

    } catch (error) {
       console.log(error);
       return { error: "Failed to create color" };
    }
    console.log("-- color_Data -- : ",color_data,"-- End --")
    return redirect(`/admin/colorLists`);
}

export const Create_Color_Action = CreateSafeAction(Create_Color_Schema,handler)
