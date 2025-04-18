"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Admin_Update_Schema } from "./schema";
import { UserRole } from "@prisma/client";
import { getUserByUserName } from "@/data/user";
import bcrypt from "bcryptjs";

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        userid,
        username,
        nickname,
        email,
        phone,
        staff,
        isadmin,
        cram,
        } = data;




    let Admin_data;


    try {
        Admin_data = await db.staffUser.update({
            where:{
                id:userid
            },
            data:{
                username : username,
                nickname : nickname,
                email : email,
                phone : phone,
                Staff: staff,
                ISADMIN: isadmin,
                cram: cram
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- Admin_update_Data -- : " , Admin_data , " -- End -- ")
    return { data: Admin_data }
}

export const updateAdmin = CreateSafeAction(Admin_Update_Schema, handler)