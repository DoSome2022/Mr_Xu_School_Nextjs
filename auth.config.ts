// // auth.config.ts
// import bcrypt from "bcryptjs";
// import CredentialsProvider from "next-auth/providers/credentials";
// import type { NextAuthConfig } from "next-auth";
// import { staffUser_Login_Schema } from "./schemas";
// import { getStaffUserByUserName } from "./data/user";
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

//           // 添加类型转换
//         if (typeof credentials.staff === 'string') {
//           credentials.staff = credentials.staff === 'true';
//         }
//         if (typeof credentials.isadmin === 'string') {
//           credentials.isadmin = credentials.isadmin === 'true';
//         }

//         // 驗證憑證格式
//         const validatedFields = staffUser_Login_Schema.safeParse(credentials);
//         if (!validatedFields.success) {
//           console.error("-- Form validation failed -- : ", validatedFields.error.issues);
//           return null;
//         }

//         const { username, password, staff, isadmin } = validatedFields.data;
//         console.log("-- Parsed credentials -- : ", { username, staff, isadmin });

//         // 檢查 staff 和 isadmin 是否至少有一個為 true
//         if (!staff && !isadmin) {
//           console.error("-- Invalid staff/isadmin selection -- : ", { staff, isadmin });
//           return null;
//         }

//         // 查詢用戶
//         const user = await getStaffUserByUserName(username);
//         console.log("-- Staff user fetched -- : ", user);

//         if (!user) {
//           console.log("-- Staff user not found -- : ", { username });
//           return null;
//         }

//         if (!user.password) {
//           console.log("-- No password set for user -- : ", { username });
//           return null;
//         }

//         // 驗證密碼
//         const passwordsMatch = await bcrypt.compare(password, user.password);
//         console.log("-- Password match result -- : ", passwordsMatch);
//         if (!passwordsMatch) {
//           console.log("-- Staff password mismatch -- : ", { username });
//           return null;
//         }

//         // 檢查 staff 和 isadmin 是否與資料庫匹配
//         console.log("-- Comparing staff/isadmin -- : ", {
//           inputStaff: staff,
//           dbStaff: user.Staff,
//           inputIsAdmin: isadmin,
//           dbIsAdmin: user.ISADMIN,
//         });
//         if (user.Staff !== staff || user.ISADMIN !== isadmin) {
//           console.error("-- Staff or isadmin mismatch -- : ", {
//             inputStaff: staff,
//             dbStaff: user.Staff,
//             inputIsAdmin: isadmin,
//             dbIsAdmin: user.ISADMIN,
//           });
//           return null;
//         }

//         // 驗證角色邏輯
//         console.log("-- Validating role -- : ", { role: user.role });
//         if (user.Staff && user.ISADMIN) {
//           if (user.role !== "ADMIN" && user.role !== "SUPADMIN") {
//             console.error("-- Role mismatch for admin -- : ", { role: user.role });
//             return null;
//           }
//         } else if (user.Staff && !user.ISADMIN) {
//           if (user.role !== "TEACHER") {
//             console.error("-- Role mismatch for teacher -- : ", { role: user.role });
//             return null;
//           }
//         } else {
//           console.error("-- Invalid staff/isadmin combination -- : ", { staff, isadmin });
//           return null;
//         }

//         // 同步到 User 表
//         try {
//           const syncedUser = await db.user.upsert({
//             where: { id: user.id },
//             update: {
//               username: user.username,
//               email: user.email,
//               nickname: user.nickname ?? user.username ?? "Unknown",
//               role: user.role,
//               phone: user.phone,
//               password: user.password,
//             },
//             create: {
//               id: user.id,
//               username: user.username,
//               email: user.email,
//               nickname: user.nickname ?? user.username ?? "Unknown",
//               role: user.role,
//               phone: user.phone,
//               password: user.password,
//             },
//           });
//           console.log("-- Staff user synced to User table -- : ", syncedUser);

//           return {
//             id: syncedUser.id,
//             username: syncedUser.username,
//             email: syncedUser.email,
//             role: syncedUser.role,
//             staff: user.Staff,
//             isAdmin: user.ISADMIN,
//           };
//         } catch (error) {
//           console.error("-- Error syncing user to User table -- : ", error);
//           return null;
//         }
//       },
//     }),
//   ],
// } satisfies NextAuthConfig;

// auth.config.ts
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { staffUser_Login_Schema, Login_Schema } from "./schemas";
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

        // 先轉換 staff 和 isadmin 為布林值（處理字符串情況）
        const convertedCredentials = {
          username: credentials.username as string,
          password: credentials.password as string,
          staff: credentials.staff === "true" || credentials.staff === true,
          isadmin: credentials.isadmin === "true" || credentials.isadmin === true,
        };

        // 將字串轉換為布林值（已整合到 convertedCredentials）
        const staff = convertedCredentials.staff;
        const isadmin = convertedCredentials.isadmin;

        // 驗證憑證格式（使用轉換後的物件）
        const validatedFields = staff || isadmin 
          ? staffUser_Login_Schema.safeParse(convertedCredentials) 
          : Login_Schema.safeParse(convertedCredentials);
        if (!validatedFields.success) {
          console.error("-- Form validation failed -- : ", validatedFields.error.issues);
          return null;
        }

        const { username, password } = validatedFields.data;

        if (staff || isadmin) {
          // 職員或管理員登錄，檢查 StaffUser 表
          const user = await getStaffUserByUserName(username);
          console.log("-- Staff user fetched -- : ", user);

          if (!user || !user.password) {
            console.log("-- Staff user not found or no password -- : ", { username });
            return null;
          }

          // 驗證密碼
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log("-- Password match result -- : ", passwordsMatch);
          if (!passwordsMatch) {
            console.log("-- Staff password mismatch -- : ", { username });
            return null;
          }

          // 檢查 staff 和 isadmin 是否與資料庫匹配
          console.log("-- Comparing staff/isadmin -- : ", {
            inputStaff: staff,
            dbStaff: user.Staff,
            inputIsAdmin: isadmin,
            dbIsAdmin: user.ISADMIN,
          });
          if (user.Staff !== staff || user.ISADMIN !== isadmin) {
            console.error("-- Staff or isadmin mismatch -- : ", {
              inputStaff: staff,
              dbStaff: user.Staff,
              inputIsAdmin: isadmin,
              dbIsAdmin: user.ISADMIN,
            });
            return null;
          }

          // 驗證角色邏輯
          console.log("-- Validating role -- : ", { role: user.role });
          if (user.Staff && user.ISADMIN) {
            if (user.role !== "ADMIN" && user.role !== "SUPADMIN") {
              console.error("-- Role mismatch for admin -- : ", { role: user.role });
              return null;
            }
          } else if (user.Staff && !user.ISADMIN) {
            if (user.role !== "TEACHER") {
              console.error("-- Role mismatch for teacher -- : ", { role: user.role });
              return null;
            }
          } else {
            console.error("-- Invalid staff/isadmin combination -- : ", { staff, isadmin });
            return null;
          }

          // 同步到 User 表
          try {
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
          } catch (error) {
            console.error("-- Error syncing user to User table -- : ", error);
            return null;
          }
        } else {
          // 普通用戶登錄，檢查 User 表
          const user = await getUserByUserName(username);
          console.log("-- User fetched -- : ", user);

          if (!user || !user.password) {
            console.log("-- User not found or no password -- : ", { username });
            return null;
          }

          // 驗證密碼
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log("-- Password match result -- : ", passwordsMatch);
          if (!passwordsMatch) {
            console.log("-- User password mismatch -- : ", { username });
            return null;
          }

          // 驗證角色邏輯
          console.log("-- Validating role -- : ", { role: user.role });
          if (user.role !== "PARENT" && user.role !== "USER") {
            console.error("-- Role mismatch for user -- : ", { role: user.role });
            return null;
          }

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            staff: false,
            isAdmin: false, // 普通用戶始終不是管理員
          };
        }
      },
    }),
  ],
} satisfies NextAuthConfig;


// 18-08-2025 原本
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
//               password: user.password,
//             },
//             create: {
//               id: user.id,
//               username: user.username,
//               email: user.email,
//               nickname: user.nickname ?? user.username ?? "Unknown",
//               role: user.role,
//               phone: user.phone,
//               password: user.password,
//             },
//           });

//           console.log("-- Staff user synced to User table -- : ", syncedUser);

//           return {
//             id: syncedUser.id,
//             username: syncedUser.username,
//             email: syncedUser.email,
//             role: syncedUser.role,
//             staff: user.Staff,
//             isAdmin: user.ISADMIN,
//           };
//         }

//         // 普通用戶登錄（PARENT 或 USER）
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

//           return {
//             id: user.id,
//             username: user.username ?? user.nickname ?? "Unknown",
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