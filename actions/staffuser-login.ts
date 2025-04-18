"use server";
import { auth, signIn } from "@/auth"; 
import { getStaffUserByUserName} from "@/data/user";
import { Login_Schema, staffUser_Login_Schema } from "@/schemas"; 
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import { getToken } from "next-auth/jwt";



export const StaffUser_login_action = async (values:z.infer<typeof staffUser_Login_Schema>) => {
    console.log("--staffuser_login_values-- : ", values , " -- end --");

    // 驗證字段
    const validatedFields = staffUser_Login_Schema.safeParse(values);
    if(!validatedFields.success) return {error: "Invalid fields"};
    const {username , password ,staff , isadmin} = validatedFields.data;


  

    // 獲取用戶數據
    const existingUserName = await getStaffUserByUserName(username)
    if(!existingUserName || !existingUserName.username) {
        return { error: "這username是沒有" }
    }

    if(staff !== existingUserName.Staff || isadmin !== existingUserName.ISADMIN){
        return { error: "此用戶不在權限" }
    }

    // 驗證密碼
    const passwordMatch = await bcrypt.compare(password, existingUserName.password);
    if (!passwordMatch) {
    return { error: "帳號/密碼有誤！", status: "error" };
    }



    try {

    await signIn("credentials", {
        username,
        password,
        // staff,
        redirectTo: "/publicpage"
    })


    } catch (error) {
        if(error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: error.message , status:"error"};
            default:
                return { error: "出了問題！" , status:"error"}
                }
        }
        throw error
    }

}