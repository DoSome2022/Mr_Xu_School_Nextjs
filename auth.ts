// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "./lib/db";

// import { UserRole } from "@prisma/client";
// import { getStaffUserById } from "./data/user";
// import authConfig from "./auth.config";

// export const {
//     handlers: {GET, POST},
//     auth,
//     signIn,
//     signOut,
    
// } = NextAuth({
//     callbacks:{
//         async session({token , session}) {
//             console.log("-- Session token -- : " , { sessionToken: token.staff } ," -- End --")

//             if(session.user && token.sub) {
//                 session.user.id = token.sub;
//             }
//             //session自定Field
//             // session.user.customField = "自定Field"

//             if(token.role && session.user) {
//                 session.user.role = token.role as UserRole
//             }

//             if(typeof token.staff !== "undefined" && session.user){
//                 session.user.staff = token.staff
//             }

//             if(typeof token.isadmin !== "undefined" && session.user){
//                 session.user.isadmin = token.isadmin
//             }


//             return session

//         },
    
//         async jwt({token}){
//             if(!token.sub) return token

//             const existingUser = await getStaffUserById(token.sub);
//             if ( !existingUser ) return token;

//             token.role = existingUser.role;

//             // 將 staff 和 isadmin 添加到 token 
//             token.staff = existingUser.Staff; 
//             token.isadmin = existingUser.ISADMIN;

//             return token

//         },



    
// },
//     adapter: PrismaAdapter(db),
//     session:{strategy:"jwt"},
//     ...authConfig,

// })



// auth.ts
// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "./lib/db";
// import { UserRole } from "@prisma/client";
// import { getStaffUserById } from "./data/user";
// import authConfig from "./auth.config";

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   callbacks: {
//     async session({ token, session }) {
//       console.log("-- Session token -- : ", { sessionToken: token }, " -- End --");

//       if (session.user && token.sub) {
//         session.user.id = token.sub;
//       }

//       if (token.role && session.user) {
//         session.user.role = token.role as UserRole;
//       }

//       if (typeof token.staff !== "undefined" && session.user) {
//         session.user.staff = token.staff;
//       }

//       if (typeof token.isAdmin !== "undefined" && session.user) {
//         session.user.isAdmin = token.isAdmin; // 統一為 isAdmin
//       }

//       return session;
//     },

//     async jwt({ token }) {
//       if (!token.sub) return token;

//       const existingUser = await getStaffUserById(token.sub);
//       if (!existingUser) return token;

//       token.role = existingUser.role;
//       token.staff = existingUser.Staff;
//       token.isAdmin = existingUser.ISADMIN; // 統一為 isAdmin

//       return token;
//     },
//   },
//   adapter: PrismaAdapter(db),
//   session: { strategy: "jwt" },
//   ...authConfig,
// });





//13-08-2025 原本

// auth.ts
// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "./lib/db";
// import { UserRole } from "@prisma/client";
// import { getStaffUserById } from "./data/user";
// import authConfig from "./auth.config";

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   callbacks: {
//     async session({ token, session }) {
//       console.log("-- Session token -- : ", { sessionToken: token });
//       if (session.user && token.sub) {
//         session.user.id = token.sub;
//       }
//       if (token.role && session.user) {
//         session.user.role = token.role as UserRole;
//       }
//       if (typeof token.staff !== "undefined" && session.user) {
//         session.user.staff = token.staff;
//       }
//       if (typeof token.isAdmin !== "undefined" && session.user) {
//         session.user.isAdmin = token.isAdmin;
//       }
//       return session;
//     },
//     async jwt({ token }) {
//       if (!token.sub) return token;
//       const existingUser = await getStaffUserById(token.sub);
//       if (!existingUser) return token;
//       token.role = existingUser.role;
//       token.staff = existingUser.Staff;
//       token.isAdmin = existingUser.ISADMIN;
//       return token;
//     },
//   },
//   adapter: PrismaAdapter(db),
//   session: { strategy: "jwt" },
//   pages: {
//     signIn: "/stafflogin",
//     error: "/auth/error",
//   },
//   ...authConfig,
// });


// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { UserRole } from "@prisma/client";
import { getStaffUserById, getUserById } from "./data/user";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
async session({ token, session }) {

  console.log("-- Session token -- : ", { sessionToken: token });
  if (session.user && token.sub) {
    session.user.id = token.sub;
  }
  if (session.user && token.role) {
    session.user.role = token.role as UserRole;
  }
  if (session.user && typeof token.staff === "boolean") {
    session.user.staff = token.staff;
  }
  if (session.user && typeof token.isAdmin === "boolean") {
    session.user.isAdmin = token.isAdmin;
  }
  return session;
},
    async jwt({ token }) {
      if (!token.sub) return token;

      // 優先檢查 StaffUser
      const existingStaffUser = await getStaffUserById(token.sub);
      if (existingStaffUser) {
        token.role = existingStaffUser.role;
        token.staff = existingStaffUser.Staff ?? false; // 確保是 boolean
        token.isAdmin = existingStaffUser.ISADMIN ?? false; // 確保是 boolean
        return token;
      }

      // 檢查 User
      const existingUser = await getUserById(token.sub);
      if (existingUser) {
        token.role = existingUser.role;
        token.staff = false; // User 模型的用戶不是職員
        token.isAdmin = existingUser.role === "ADMIN" || existingUser.role === "SUPADMIN";
        return token;
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/stafflogin", // StaffUser 登錄頁面
    error: "/auth/error",
  },
  ...authConfig,
});