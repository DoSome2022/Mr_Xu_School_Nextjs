"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Teacher_Update_Schema } from "./schema";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getUserByUserName } from "@/data/user";

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        teacherid,
        username,
        nickname,
        email,
        phone,
        staff,
        isadmin,
        } = data;

        const existingUser = await getUserByUserName(username);
    
        if(existingUser) {
            return {
                error:" 用戶名已用 "
            }
        }
        
    let Teacher_user;

    try {
        Teacher_user = await db.staffUser.update({
            where:{
                id: teacherid
            },
            data:{
                username : username,
                nickname : nickname,
                email : email,
                phone : phone,
                Staff : staff,
                ISADMIN : isadmin,

            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- teacher_update_User -- : " , Teacher_user , " -- End -- ")
    return { data: Teacher_user }
}

export const updateTeacher = CreateSafeAction(Teacher_Update_Schema, handler)