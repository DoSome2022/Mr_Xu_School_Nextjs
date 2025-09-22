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
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        session.user.staff = token.staff as boolean;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      // 優先檢查 StaffUser
      const existingStaffUser = await getStaffUserById(token.sub);
      if (existingStaffUser) {
        token.role = existingStaffUser.role;
        token.staff = existingStaffUser.Staff ?? false;
        token.isAdmin = existingStaffUser.ISADMIN ?? false;
        return token;
      }

      // 檢查 User
      const existingUser = await getUserById(token.sub);
      if (existingUser) {
        token.role = existingUser.role;
        token.staff = false;
        token.isAdmin = existingUser.role === "ADMIN" || existingUser.role === "SUPADMIN";
        return token;
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/", // 職員登錄頁面
    error: "/auth/error",
  },
  ...authConfig,
});

// // auth.ts
// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "./lib/db";
// import { UserRole } from "@prisma/client";
// import { getStaffUserById, getUserById } from "./data/user";
// import authConfig from "./auth.config";

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   callbacks: {
// async session({ token, session }) {

//   console.log("-- Session token -- : ", { sessionToken: token });
//   if (token.sub && session.user) {
//     session.user.id = token.sub;
//     session.user.role = token.role as UserRole;
//     session.user.staff = token.staff as boolean;
//     session.user.isAdmin = token.isAdmin as boolean;
//   }
//   if (session.user && token.role) {
//     session.user.role = token.role as UserRole;
//   }
//   if (session.user && typeof token.staff === "boolean") {
//     session.user.staff = token.staff;
//   }
//   if (session.user && typeof token.isAdmin === "boolean") {
//     session.user.isAdmin = token.isAdmin;
//   }
//   return session;
// },
//     async jwt({ token }) {
//       if (!token.sub) return token;

//       // 優先檢查 StaffUser
//       const existingStaffUser = await getStaffUserById(token.sub);
//       if (existingStaffUser) {
//         token.role = existingStaffUser.role;
//         token.staff = existingStaffUser.Staff ?? false; // 確保是 boolean
//         token.isAdmin = existingStaffUser.ISADMIN ?? false; // 確保是 boolean
//         return token;
//       }

//       // 檢查 User
//       const existingUser = await getUserById(token.sub);
//       if (existingUser) {
//         token.role = existingUser.role;
//         token.staff = false; // User 模型的用戶不是職員
//         token.isAdmin = existingUser.role === "ADMIN" || existingUser.role === "SUPADMIN";
//         return token;
//       }

//       return token;
//     },
//   },
//   adapter: PrismaAdapter(db),
//   session: { strategy: "jwt" },
//   pages: {
//     signIn: "/stafflogin", // StaffUser 登錄頁面
//     error: "/auth/error",
//   },
//   ...authConfig,
// });