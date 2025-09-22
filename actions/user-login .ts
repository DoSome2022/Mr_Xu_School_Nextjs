//13-08-2025 原本

// "use server";
// import { auth, signIn } from "@/auth"; 
// import {  getUserByUserName} from "@/data/user";
// import { Login_Schema } from "@/schemas"; 
// import { AuthError } from "next-auth";
// import { z } from "zod";
// import bcrypt from 'bcryptjs';
// import { getToken } from "next-auth/jwt";



// export const User_login_action = async (values:z.infer<typeof Login_Schema>) => {
//     console.log("--login_values-- : ", values , " -- end --")

//     // 驗證字段
//     const validatedFields = Login_Schema.safeParse(values);
//     if(!validatedFields.success) return {error: "Invalid fields"};
//     const {username , password ,staff } = validatedFields.data;


  

//     // 獲取用戶數據
//     const existingUserName = await getUserByUserName(username)
//     if(!existingUserName || !existingUserName.username) {
//         return { error: "這username是沒有" }
//     }

//     console.log( " server side : ", existingUserName)


//     // 驗證密碼
//     const passwordMatch = await bcrypt.compare(password, existingUserName.password);
//     if (!passwordMatch) {
//     return { error: "帳號/密碼有誤！", status: "error" };
//     }


//     const role = existingUserName.role;
//     try {

//     await signIn("credentials", {
//         username,
//         password,
//         staff,
//         role,
//         redirectTo: `/parent/${existingUserName.id}`
//     })


//     } catch (error) {
//         if(error instanceof AuthError) {
//             switch (error.type) {
//                 case "CredentialsSignin":
//                     return { error: "帳號/密碼有誤！" , status:"error"};
//             default:
//                 return { error: "出了問題！" , status:"error"}
//                 }
//         }
//         throw error
//     }

// }

// actions/user-login.ts
"use server";
import { signIn } from "@/auth";
import { Login_Schema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import { getUserByUserName } from "@/data/user";
import bcrypt from "bcryptjs";

export interface LoginResponse {
  error?: string;
  success?: string;
  status?: string;
  role?: string;
  id?: string;
}

export const User_login_action = async (
  values: z.infer<typeof Login_Schema>
): Promise<LoginResponse> => {
  console.log("-- user_login_values -- : ", values, " -- end --");

  // 驗證字段
  const validatedFields = Login_Schema.safeParse(values);
  if (!validatedFields.success) {
    console.error("-- Validation failed -- : ", validatedFields.error.issues);
    return { error: "無效的字段，請檢查輸入", status: "error" };
  }

  const { username, password } = validatedFields.data;

  // 獲取用戶數據
  const existingUser = await getUserByUserName(username);
  if (!existingUser || !existingUser.username || !existingUser.password) {
    console.log("-- User not found or no password -- : ", { username });
    return { error: "用戶名不存在或無密碼", status: "error" };
  }

  console.log("-- server side user -- : ", existingUser);

  // 驗證密碼
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    console.log("-- Password mismatch -- : ", { username });
    return { error: "帳號或密碼錯誤", status: "error" };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      staff: "false", // 普通用戶，staff 為 false
      isadmin: "false", // 普通用戶，isadmin 為 false
      redirect: false, // 禁用服務端重定向
    });

    console.log("-- Login success -- : ", { username, role: existingUser.role });
    return {
      success: "登錄成功！",
      status: "success",
      role: existingUser.role,
      id: existingUser.id,
    };
  } catch (error) {
    console.error("-- Login error -- : ", error);
    if (error instanceof AuthError) {
      console.error("-- AuthError -- : ", error.type, error.message);
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "帳號或密碼錯誤", status: "error" };
        default:
          return { error: "登錄時發生錯誤", status: "error" };
      }
    }
    return { error: "未知錯誤，請稍後重試", status: "error" };
  }
};