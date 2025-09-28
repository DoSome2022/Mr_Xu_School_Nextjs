"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupTeacher_Create_Schema } from "./schema";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getUserByUserName } from "@/data/user";
import { redirect } from 'next/navigation'
import { revalidatePath } from "next/cache";

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        username,
        nickname,
        email,
        phone,
        role,
        password,
        staff,
        isadmin,
        supadminId
        } = data;

        const hashedPassword = await bcrypt.hash(password,10);

        const existingUser = await getUserByUserName(username);
    
        if(existingUser) {
            return {
                error:" 用戶名已用 "
            }
        }


    let Teacher_user;

    try {
        Teacher_user = await db.staffUser.create({
            data:{
                username : username,
                nickname : nickname,
                email : email,
                phone : phone,
                Staff : staff,
                ISADMIN : isadmin,
                role : role as UserRole,
                password : hashedPassword, 
            }
        });
        revalidatePath(`/supadmin/${supadminId}/userLists/teachersLists`)
    } catch (error) {
        console.log(error)
    }
    console.log("-- teacher_User -- : " , Teacher_user , " -- End -- ")
    return redirect(`/supadmin/${supadminId}/userLists/teachersLists`)
}

export const SupcreateTeacher = CreateSafeAction(SupTeacher_Create_Schema, handler)