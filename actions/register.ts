// "use server";
// import { db } from "@/lib/db";
// import {  Parent_Register_Schema } from "@/schemas";
// import { z } from "zod";
// import { redirect } from 'next/navigation';
// import bcrypt from "bcryptjs";
// import { getUserByUserName } from "@/data/user";
// import { UserRole } from "@prisma/client";

// export const parent_register_action = async (values: z.infer<typeof Parent_Register_Schema>) => {
//     console.log("--parent_register_values-- : ", values , " -- end --")

//     const validatedFields = Parent_Register_Schema.safeParse(values);

//     if (!validatedFields.success ) { 
//         return { error: "-- error! --" }
//     }


//     const {
//         username,
//         nickname,
//         email,
//         phone,
//         password,
//         role,
//     } = validatedFields.data; 

//     const hashedPassword = await bcrypt.hash(password,10);

//     const existingUser = await getUserByUserName(username);

//     if(existingUser) {
//         return {
//             error:" 用戶名已用 "
//         }
//     }
//     try {
//         const Parent_data = await db.user.create({
//         data:{
//             username : username,
//             nickname : nickname,
//             email : email,
//             phone:  phone,
//             role : role as UserRole,
//             password : hashedPassword
//         }
//     })
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- Parent_data -- : " , Parent_data , " -- End -- ")
//     // return { data: Admin_data }

//     return redirect('/login')
// }