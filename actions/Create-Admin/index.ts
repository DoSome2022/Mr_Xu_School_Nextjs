"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Admin_Create_Schema } from "./schema";
import { UserRole } from "@prisma/client";
import { getStaffUserByUserName} from "@/data/user";
import bcrypt from "bcryptjs";
import { redirect } from 'next/navigation';


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
        cram,
        } = data;

    let Admin_data;

    const hashedPassword = await bcrypt.hash(password,10);

    const existingUser = await getStaffUserByUserName(username);

    if(existingUser) {
        return {
            error:" 用戶名已用 "
        }
    }


    try {
        Admin_data = await db.staffUser.create({
            data:{
                username : username,
                nickname : nickname,
                email : email,
                phone : phone,
                Staff: staff,
                ISADMIN: isadmin,
                role : role as UserRole,
                password : hashedPassword,
                cram: "",
                subject: [],
                teacher_time_work_id: "",
                teacher_upload_node_id: "",
                teacher_node_id: "",
            }
        });
        revalidatePath(`/`)
    } catch (error) {
        console.log(error)
    }
    console.log("-- Admin_Data -- : " , Admin_data , " -- End -- ")
    return redirect('/')
    
}

export const createAdmin = CreateSafeAction(Admin_Create_Schema, handler)