"use server";


import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { redirect } from "next/navigation";
import { InputType, ReturnType } from "./types";
import { CreateClassRoomSchema } from "./schema";
import { revalidatePath } from "next/cache";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {room} = data;

    let room_data;

    try {
        room_data = await db.classroom.create({
            data:{
                room : room
            }
        });
        revalidatePath('/admin/classroomLists')
    } catch (error) {
        console.log(error)
    }
    console.log("-- room_data -- : " , room_data , " -- End -- ")
    return redirect('/admin/classroomLists');

}

export const CreateClassRoomAction = CreateSafeAction(CreateClassRoomSchema , handler);