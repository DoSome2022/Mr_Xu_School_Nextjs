// import bcrypt from "bcryptjs";
// import credentials from "next-auth/providers/credentials";
// import type { NextAuthConfig } from "next-auth";
// import { Login_Schema, staffUser_Login_Schema } from "./schemas"; 
// import { getStaffUserByUserName, getUserByUserName } from "./data/user";

// //authjsＶ５　的自定登入設定
// export default{providers: [
//     credentials({
        
//         async authorize(credentials , req) {
//             console.log("-- credentials -- : ",credentials ,"-- end --")

//             console.log(credentials)
//                         //普通用戶登入
//            if(credentials.role === "PARENT") {
//             console.log('testmessage :  is work')
//             const login_form_validatedFields = Login_Schema.safeParse(credentials);
//                 if (login_form_validatedFields.success) {
//                 const { username , password } = login_form_validatedFields.data;
//                 //用戶檢查
//                 const user = await getUserByUserName(username);
//                 //username / password 錯會
//                 if (!user || !user.password) return console.error("no user or no pw (user)");;
//                 //PW解碼
//                 const passwordsMatch = await bcrypt.compare(
//                     password,
//                     user.password,
//                 );
//                 //PW ＆＆　username 沒問題　在DB 最user 資料
//                         console.log('is work')
//                     if(passwordsMatch) return user

               
//                 } else {
//                 //輸入form 錯誤
//                 console.error("form have wrong (user) : ", login_form_validatedFields.error)
//                 return null
//                 }

//            } 


//            if(credentials.role === "SUPADMIN") {

//             console.log('testmessage :  is work')
//             const login_form_validatedFields = Login_Schema.safeParse(credentials);
//                 if (login_form_validatedFields.success) {
//                 const { username , password } = login_form_validatedFields.data;
//                 //用戶檢查
//                 const user = await getUserByUserName(username);
//                 //username / password 錯會
//                 if (!user || !user.password) return console.error("no user or no pw (supadmin)");;
//                 //PW解碼
//                 const passwordsMatch = await bcrypt.compare(
//                     password,
//                     user.password,
//                 );
//                 //PW ＆＆　username 沒問題　在DB 最user 資料
//                         console.log('is work')
//                     if(passwordsMatch) return user

               
//                 } else {
//                 //輸入form 錯誤
//                 console.error("form have wrong (supadmin) : ", login_form_validatedFields.error)
//                 return null
//                 }

//            }


//             //職員用戶登入
            
//                 const login_form_validatedFields = staffUser_Login_Schema.safeParse(credentials);
//                 if (login_form_validatedFields.success) {
//                 const { username , password } = login_form_validatedFields.data;
//                 //用戶檢查
//                 const user = await getStaffUserByUserName(username);
//                 //username / password 錯會
//                 if (!user || !user.password) return console.error("no user or no pw (staff)");
//                 //PW解碼
//                 const passwordsMatch = await bcrypt.compare(
//                     password,
//                     user.password,
//                 );
//                 //PW ＆＆　username 沒問題　在DB 最user 資料
//                     if(passwordsMatch) return user

               
//                 } else {
//                 //輸入form 錯誤
//                 console.error("form have wrong (admin) : ",login_form_validatedFields.error)
//                 return null
//                 }


//             // else {}

              

            
//         }
//     }),
// ],
// } satisfies NextAuthConfig


// 13-08-2025 原本

// auth.config.ts
// import bcrypt from "bcryptjs";
// import CredentialsProvider from "next-auth/providers/credentials";
// import type { NextAuthConfig } from "next-auth";
// import { Login_Schema, staffUser_Login_Schema } from "./schemas";
// import { getStaffUserByUserName, getUserByUserName } from "./data/user";
// import { db } from "./lib/db";

// export default {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//         staff: { label: "Staff", type: "checkbox" },
//         isadmin: { label: "IsAdmin", type: "checkbox" },
//       },
//       async authorize(credentials) {
//         console.log("-- authorize credentials -- : ", credentials);

//         if (!credentials?.username || !credentials?.password) {
//           console.log("-- Missing credentials -- : ", credentials);
//           return null;
//         }

//         // 職員用戶登錄
//         const staffValidatedFields = staffUser_Login_Schema.safeParse(credentials);
//         if (staffValidatedFields.success) {
//           const { username, password, staff, isadmin } = staffValidatedFields.data;
//           console.log("-- Staff login attempt -- : ", { username, staff, isadmin });

//           const user = await getStaffUserByUserName(username);
//           console.log("-- Staff user fetched -- : ", user);

//           if (!user || !user.password) {
//             console.log("-- Staff user not found or no password -- : ", { username });
//             return null;
//           }

//           const passwordsMatch = await bcrypt.compare(password, user.password);
//           if (!passwordsMatch) {
//             console.log("-- Staff password mismatch -- : ", { username });
//             return null;
//           }

//           // 將字符串轉為布林值進行比較
//           const staffBool = credentials.staff === "true" || credentials.staff === true;
//           const isadminBool = credentials.isadmin === "true" || credentials.isadmin === true;

//           if (staffBool !== user.Staff || isadminBool !== user.ISADMIN) {
//             console.log("-- Staff permissions mismatch -- : ", {
//               inputStaff: staffBool,
//               dbStaff: user.Staff,
//               inputIsAdmin: isadminBool,
//               dbIsAdmin: user.ISADMIN,
//             });
//             return null;
//           }

//           // 同步到 User 表
//           const syncedUser = await db.user.upsert({
//             where: { id: user.id },
//             update: {
//               username: user.username,
//               email: user.email,
//               nickname: user.nickname ?? user.username ?? "Unknown",
//               role: user.role,
//               phone: user.phone,
//               password: user.password, // 同步加密密碼
//             },
//             create: {
//               id: user.id,
//               username: user.username,
//               email: user.email,
//               nickname: user.nickname ?? user.username ?? "Unknown",
//               role: user.role,
//               phone: user.phone,
//               password: user.password, // 同步加密密碼
//             },
//           });

//           console.log("-- Staff user synced to User table -- : ", syncedUser);

//           console.log("-- Staff login success -- : ", { username });
//           return {
//             id: syncedUser.id,
//             username: syncedUser.username,
//             email: syncedUser.email,
//             role: syncedUser.role,
//             staff: user.Staff,
//             isAdmin: user.ISADMIN,
//           };
//         }

//         // 普通用戶登錄（PARENT 或 SUPADMIN）
//         const userValidatedFields = Login_Schema.safeParse(credentials);
//         if (userValidatedFields.success) {
//           const { username, password } = userValidatedFields.data;
//           console.log("-- User login attempt -- : ", { username });

//           const user = await getUserByUserName(username);
//           console.log("-- User fetched -- : ", user);

//           if (!user || !user.password) {
//             console.log("-- User not found or no password -- : ", { username });
//             return null;
//           }

//           const passwordsMatch = await bcrypt.compare(password, user.password);
//           if (!passwordsMatch) {
//             console.log("-- User password mismatch -- : ", { username });
//             return null;
//           }

//           console.log("-- User login success -- : ", { username });
//           return {
//             id: user.id,
//             name: user.username ?? user.nickname ?? "Unknown",
//             email: user.email,
//             role: user.role,
//             staff: false,
//             isAdmin: user.role === "SUPADMIN" || user.role === "ADMIN",
//           };
//         }

//         console.error("-- Form validation failed -- : ", {
//           staffErrors: staffValidatedFields.error?.issues,
//           userErrors: userValidatedFields.error?.issues,
//         });
//         return null;
//       },
//     }),
//   ],
// } satisfies NextAuthConfig;



// auth.config.ts
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { Login_Schema, staffUser_Login_Schema } from "./schemas";
import { getStaffUserByUserName, getUserByUserName } from "./data/user";
import { db } from "./lib/db";

export default {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        staff: { label: "Staff", type: "checkbox" },
        isadmin: { label: "IsAdmin", type: "checkbox" },
      },
      async authorize(credentials) {
        console.log("-- authorize credentials -- : ", credentials);

        if (!credentials?.username || !credentials?.password) {
          console.log("-- Missing credentials -- : ", credentials);
          return null;
        }

        // 職員用戶登錄
        const staffValidatedFields = staffUser_Login_Schema.safeParse(credentials);
        if (staffValidatedFields.success) {
          const { username, password, staff, isadmin } = staffValidatedFields.data;
          console.log("-- Staff login attempt -- : ", { username, staff, isadmin });

          const user = await getStaffUserByUserName(username);
          console.log("-- Staff user fetched -- : ", user);

          if (!user || !user.password) {
            console.log("-- Staff user not found or no password -- : ", { username });
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            console.log("-- Staff password mismatch -- : ", { username });
            return null;
          }

          const staffBool = credentials.staff === "true" || credentials.staff === true;
          const isadminBool = credentials.isadmin === "true" || credentials.isadmin === true;

          if (staffBool !== user.Staff || isadminBool !== user.ISADMIN) {
            console.log("-- Staff permissions mismatch -- : ", {
              inputStaff: staffBool,
              dbStaff: user.Staff,
              inputIsAdmin: isadminBool,
              dbIsAdmin: user.ISADMIN,
            });
            return null;
          }

          // 同步到 User 表
          const syncedUser = await db.user.upsert({
            where: { id: user.id },
            update: {
              username: user.username,
              email: user.email,
              nickname: user.nickname ?? user.username ?? "Unknown",
              role: user.role,
              phone: user.phone,
              password: user.password,
            },
            create: {
              id: user.id,
              username: user.username,
              email: user.email,
              nickname: user.nickname ?? user.username ?? "Unknown",
              role: user.role,
              phone: user.phone,
              password: user.password,
            },
          });

          console.log("-- Staff user synced to User table -- : ", syncedUser);

          return {
            id: syncedUser.id,
            username: syncedUser.username,
            email: syncedUser.email,
            role: syncedUser.role,
            staff: user.Staff,
            isAdmin: user.ISADMIN,
          };
        }

        // 普通用戶登錄（PARENT 或 USER）
        const userValidatedFields = Login_Schema.safeParse(credentials);
        if (userValidatedFields.success) {
          const { username, password } = userValidatedFields.data;
          console.log("-- User login attempt -- : ", { username });

          const user = await getUserByUserName(username);
          console.log("-- User fetched -- : ", user);

          if (!user || !user.password) {
            console.log("-- User not found or no password -- : ", { username });
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            console.log("-- User password mismatch -- : ", { username });
            return null;
          }

          return {
            id: user.id,
            username: user.username ?? user.nickname ?? "Unknown",
            email: user.email,
            role: user.role,
            staff: false,
            isAdmin: user.role === "SUPADMIN" || user.role === "ADMIN",
          };
        }

        console.error("-- Form validation failed -- : ", {
          staffErrors: staffValidatedFields.error?.issues,
          userErrors: userValidatedFields.error?.issues,
        });
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;