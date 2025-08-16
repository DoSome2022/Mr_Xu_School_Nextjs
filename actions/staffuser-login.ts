// "use server";
// import {  signIn } from "@/auth"; 
// import { getStaffUserByUserName} from "@/data/user";
// import {  staffUser_Login_Schema } from "@/schemas"; 
// import { AuthError } from "next-auth";
// import { z } from "zod";
// import bcrypt from 'bcryptjs';




// export const StaffUser_login_action = async (values:z.infer<typeof staffUser_Login_Schema>) => {
//     console.log("--staffuser_login_values-- : ", values , " -- end --");

//     // 驗證字段
//     const validatedFields = staffUser_Login_Schema.safeParse(values);
//     if(!validatedFields.success) return {error: "Invalid fields"};
//     const {username , password ,staff , isadmin} = validatedFields.data;


  

//     // 獲取用戶數據
//     const existingUserName = await getStaffUserByUserName(username)
//     if(!existingUserName || !existingUserName.username) {
//         return { error: "這username是沒有" }
//     }

//     if(staff !== existingUserName.Staff || isadmin !== existingUserName.ISADMIN){
//         return { error: "此用戶不在權限" }
//     }

//     // 驗證密碼
//     const passwordMatch = await bcrypt.compare(password, existingUserName.password);
//     if (!passwordMatch) {
//     return { error: "帳號/密碼有誤！", status: "error" };
//     }



//     try {

//     await signIn("credentials", {
//         username,
//         password,
//         // staff,
//         redirectTo: "/publicpage"
//     })

//     // 成功登錄時返回 success
//     return { success: "登錄成功！" };

//     } catch (error) {
//         if(error instanceof AuthError) {
//             switch (error.type) {
//                 case "CredentialsSignin":
//                     return { error: error.message , status:"error"};
//             default:
//                 return { error: "出了問題！" , status:"error"}
//                 }
//         }
//         throw error
//     }

// }


// // actions/staffuser-login.ts
// "use server";
// import { signIn } from "@/auth";
// import { getStaffUserByUserName } from "@/data/user";
// import { staffUser_Login_Schema } from "@/schemas";
// import { AuthError } from "next-auth";
// import { z } from "zod";
// import bcrypt from "bcryptjs";

// export interface LoginResponse {
//   error?: string;
//   success?: string;
//   status?: string;
// }

// export const StaffUser_login_action = async (
//   values: z.infer<typeof staffUser_Login_Schema>
// ): Promise<LoginResponse> => {
//   console.log("-- staffuser_login_values -- : ", values);

//   const validatedFields = staffUser_Login_Schema.safeParse(values);
//   if (!validatedFields.success) {
//     console.error("-- Validation failed -- : ", validatedFields.error.issues);
//     return { error: "無效的字段，請檢查輸入", status: "error" };
//   }

//   const { username, password, staff, isadmin } = validatedFields.data;

//   const existingUser = await getStaffUserByUserName(username);
//   console.log("-- Existing user -- : ", existingUser);
//   console.log("-- validatedFields.data -- : ", username);
//   if (!existingUser ) {
//     console.log("-- User not found -- : ", { username });
//     return { error: "用戶名不存在", status: "error" };
//   }

//   if (staff !== existingUser.Staff || isadmin !== existingUser.ISADMIN) {
//     console.log("-- Permissions mismatch -- : ", {
//       inputStaff: staff,
//       dbStaff: existingUser.Staff,
//       inputIsAdmin: isadmin,
//       dbIsAdmin: existingUser.ISADMIN,
//     });
//     return { error: "用戶權限不匹配", status: "error" };
//   }

//   const passwordMatch = await bcrypt.compare(password, existingUser.password);
//   if (!passwordMatch) {
//     console.log("-- Password mismatch -- : ", { username });
//     return { error: "密碼錯誤", status: "error" };
//   }

//   try {
//     await signIn("credentials", {
//       username,
//       password,
//       staff,
//       isadmin,
//       redirect: false,
//     });
//     console.log("-- Login success -- : ", { username });
//     return { success: "登錄成功！", status: "success" };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       console.error("-- AuthError -- : ", error.type, error.message);
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { error: "無效的憑證，請檢查用戶名、密碼或權限", status: "error" };
//         default:
//           return { error: "登錄時發生錯誤", status: "error" };
//       }
//     }
//     console.error("-- Unknown error -- : ", error);
//     return { error: "未知錯誤，請稍後重試", status: "error" };
//   }
// };



//13-08-2025原本

// actions/staffuser-login.ts
// "use server";
// import { signIn } from "@/auth";
// import { staffUser_Login_Schema } from "@/schemas";
// import { AuthError } from "next-auth";
// import { z } from "zod";

// export interface LoginResponse {
//   error?: string;
//   success?: string;
//   status?: string;
// }

// export const StaffUser_login_action = async (
//   values: z.infer<typeof staffUser_Login_Schema>
// ): Promise<LoginResponse> => {
//   console.log("-- staffuser_login_values -- : ", values);

//   const validatedFields = staffUser_Login_Schema.safeParse(values);
//   if (!validatedFields.success) {
//     console.error("-- Validation failed -- : ", validatedFields.error.issues);
//     return { error: "無效的字段，請檢查輸入", status: "error" };
//   }

//   const { username, password, staff, isadmin } = validatedFields.data;

//   try {
//     console.log("-- Attempting signIn -- : ", { username, staff, isadmin });
// await signIn("credentials", {
//   username,
//   password,
//   staff: staff?.toString() ?? "", // 若 staff 为 undefined，则转为 ""
//   isadmin: isadmin?.toString() ?? "", // 同上
//   redirect: false,
// });
//     console.log("-- Login success -- : ", { username });
//     return { success: "登錄成功！", status: "success" };
//   } catch (error) {
//     console.error("-- Login error -- : ", error);
//     if (error instanceof AuthError) {
//       console.error("-- AuthError -- : ", error.type, error.message);
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { error: "無效的憑證，請檢查用戶名、密碼或權限", status: "error" };
//         default:
//           return { error: "登錄時發生錯誤", status: "error" };
//       }
//     }
//     return { error: "未知錯誤，請稍後重試", status: "error" };
//   }
// };


// actions/staffuser-login.ts
"use server";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { staffUser_Login_Schema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export interface LoginResponse {
  error?: string;
  success?: string;
  status?: string;
  role?: string; // 新增 role 欄位
  id?: string; // 新增 id 欄位
}

export const StaffUser_login_action = async (
  values: z.infer<typeof staffUser_Login_Schema>
): Promise<LoginResponse> => {
  console.log("-- staffuser_login_values -- : ", values);

  const validatedFields = staffUser_Login_Schema.safeParse(values);
  if (!validatedFields.success) {
    console.error("-- Validation failed -- : ", validatedFields.error.issues);
    return { error: "無效的字段，請檢查輸入", status: "error" };
  }

  const { username, password, staff, isadmin } = validatedFields.data;

  try {
    console.log("-- Attempting signIn -- : ", { username, staff, isadmin });
    const result = await signIn("credentials", {
      username,
      password,
      staff: staff?.toString() ?? "",
      isadmin: isadmin?.toString() ?? "",
      redirect: false,
    });

    // 獲取用戶資訊
    const user = await db.staffUser.findUnique({
      where: { username },
      select: { id: true, role: true },
    });

    if (!user) {
      console.error("-- User not found after signIn -- : ", { username });
      return { error: "用戶不存在", status: "error" };
    }

    console.log("-- Login success -- : ", { username, role: user.role });
    return {
      success: "登錄成功！",
      status: "success",
      role: user.role,
      id: user.id,
    };
  } catch (error) {
    console.error("-- Login error -- : ", error);
    if (error instanceof AuthError) {
      console.error("-- AuthError -- : ", error.type, error.message);
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "無效的憑證，請檢查用戶名、密碼或權限", status: "error" };
        default:
          return { error: "登錄時發生錯誤", status: "error" };
      }
    }
    return { error: "未知錯誤，請稍後重試", status: "error" };
  }
};