"use server";
import { auth, signIn } from "@/auth"; 
import {  getUserByUserName} from "@/data/user";
import { Login_Schema } from "@/schemas"; 
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import { getToken } from "next-auth/jwt";



export const User_login_action = async (values:z.infer<typeof Login_Schema>) => {
    console.log("--login_values-- : ", values , " -- end --")

    // 驗證字段
    const validatedFields = Login_Schema.safeParse(values);
    if(!validatedFields.success) return {error: "Invalid fields"};
    const {username , password ,staff } = validatedFields.data;


  

    // 獲取用戶數據
    const existingUserName = await getUserByUserName(username)
    if(!existingUserName || !existingUserName.username) {
        return { error: "這username是沒有" }
    }

    console.log( " server side : ", existingUserName)


    // 驗證密碼
    const passwordMatch = await bcrypt.compare(password, existingUserName.password);
    if (!passwordMatch) {
    return { error: "帳號/密碼有誤！", status: "error" };
    }


    const role = existingUserName.role;
    try {

    await signIn("credentials", {
        username,
        password,
        staff,
        role,
        redirectTo: `/parent/${existingUserName.id}`
    })


    } catch (error) {
        if(error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "帳號/密碼有誤！" , status:"error"};
            default:
                return { error: "出了問題！" , status:"error"}
                }
        }
        throw error
    }

}