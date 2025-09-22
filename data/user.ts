// import { db } from "@/lib/db";

// //在db找staff用戶
// export const getStaffUserByUserName = async (username : string) => {
//     try {
//         const user = await db.staffUser.findUnique({where:{username}})
//         return user
//     } catch (error) {
//         //這裹可以傅送message?
//         return null
//     }
// }
// //在db找staff用戶ID
// export const getStaffUserById = async (id: string) => {
//     try {
//         const user = await db.staffUser.findUnique({where:{id}})
//         return user
//     } catch (error) {
//         return null
//     }
// }


// //在db找staff用戶
// export const getUserByUserName = async (username : string) => {
//     try {
//         const user = await db.user.findUnique({where:{username}})
//         return user
//     } catch (error) {
//         //這裹可以傅送message?
//         return null
//     }
// }
// //在db找staff用戶ID
// export const getUserById = async (id: string) => {
//     try {
//         const user = await db.user.findUnique({where:{id}})
//         return user
//     } catch (error) {
//         return null
//     }
// }

// data/user.ts
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export interface StaffUser {
  id: string;
  username: string | null;
  nickname: string;
  email: string;
  phone: string;
  password: string;
  Staff: boolean;
  ISADMIN: boolean;
  role: UserRole;
}

export interface User {
  id: string;
  username: string | null;
  nickname: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export const getStaffUserByUserName = async (username: string): Promise<StaffUser | null> => {
  try {
    const user = await db.staffUser.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phone: true,
        password: true,
        Staff: true,
        ISADMIN: true,
        role: true,
      },
    });
    if (!user) {
      console.log(`-- Staff user not found for username: ${username} --`);
    }
    return user as StaffUser | null;
  } catch (error) {
    console.error(`-- Error fetching staff user by username: ${username} --`, error);
    return null;
  }
};

export const getStaffUserById = async (id: string): Promise<StaffUser | null> => {
  try {
    const user = await db.staffUser.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phone: true,
        password: true,
        Staff: true,
        ISADMIN: true,
        role: true,
      },
    });
    if (!user) {
      console.log(`-- Staff user not found for id: ${id} --`);
    }
    return user as StaffUser | null;
  } catch (error) {
    console.error(`-- Error fetching staff user by id: ${id} --`, error);
    return null;
  }
};

export const getUserByUserName = async (username: string): Promise<User | null> => {
  try {
    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phone: true,
        password: true,
        role: true,
      },
    });
    if (!user) {
      console.log(`-- User not found for username: ${username} --`);
    }
    return user as User | null;
  } catch (error) {
    console.error(`-- Error fetching user by username: ${username} --`, error);
    return null;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phone: true,
        password: true,
        role: true,
      },
    });
    if (!user) {
      console.log(`-- User not found for id: ${id} --`);
    }
    return user as User | null;
  } catch (error) {
    console.error(`-- Error fetching user by id: ${id} --`, error);
    return null;
  }
};