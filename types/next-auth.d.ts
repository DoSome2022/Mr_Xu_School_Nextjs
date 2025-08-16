// // types/next-auth.d.ts
// import { User as DefaultUser, Session as DefaultSession } from "next-auth";
// import { UserRole } from "@prisma/client";

// declare module "next-auth" {
//   interface User extends DefaultUser {
//     id: string; // 對應 Prisma StaffUser.id
//     role?: UserRole; // 對應 StaffUser.role
//     staff?: boolean; // 對應 StaffUser.Staff
//     isAdmin?: boolean; // 對應 StaffUser.ISADMIN
//   }

//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       role?: UserRole;
//       staff?: boolean;
//       isAdmin?: boolean;
//     } & DefaultUser;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     role?: UserRole;
//     staff?: boolean;
//     isAdmin?: boolean;
//   }
// }


// types/next-auth.d.ts
import { User as DefaultUser, Session as DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role?: UserRole;
    staff?: boolean;
    isAdmin?: boolean;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: UserRole;
      staff?: boolean;
      isAdmin?: boolean;
    } & DefaultUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    staff?: boolean;
    isAdmin?: boolean;
  }
}