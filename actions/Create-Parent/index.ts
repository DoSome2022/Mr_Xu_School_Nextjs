"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Parent_Create_Schema } from "./schema";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getUserByUserName } from "@/data/user";
import { redirect } from "next/navigation";

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        username,
        nickname,
        email,
        phone,
        role,
        password,

        } = data;

    // let Parent_data;
    let user_data;
    const hashedPassword = await bcrypt.hash(password,10);

    const existingUser = await getUserByUserName(username);

    if(existingUser) {
        return {
            error:" 用戶名已用 "
        }
    }
    try {
        user_data = await db.user.create({
            data:{
                username : username,
                nickname : nickname,
                email : email,
                phone : phone,
                role : role as UserRole,
                password : hashedPassword,
                parent_message_id: "",
                parent_price_record_id: "",

            }
        })


    } catch (error) {
        console.log(error)
    }

    console.log("-- Parent_Data -- : " , user_data , " -- End -- ")
    return redirect('/admin/userLists/parentsLists')
}

export const createParent = CreateSafeAction(Parent_Create_Schema, handler)