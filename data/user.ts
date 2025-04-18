import { db } from "@/lib/db";

//在db找staff用戶
export const getStaffUserByUserName = async (username : string) => {
    try {
        const user = await db.staffUser.findUnique({where:{username}})
        return user
    } catch (error) {
        //這裹可以傅送message?
        return null
    }
}
//在db找staff用戶ID
export const getStaffUserById = async (id: string) => {
    try {
        const user = await db.staffUser.findUnique({where:{id}})
        return user
    } catch (error) {
        return null
    }
}


//在db找staff用戶
export const getUserByUserName = async (username : string) => {
    try {
        const user = await db.user.findUnique({where:{username}})
        return user
    } catch (error) {
        //這裹可以傅送message?
        return null
    }
}
//在db找staff用戶ID
export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({where:{id}})
        return user
    } catch (error) {
        return null
    }
}