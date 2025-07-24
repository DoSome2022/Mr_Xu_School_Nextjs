"use server";


import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { redirect } from "next/navigation";
import { InputType, ReturnType } from "./types";
import { SupCreateClassRoomSchema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {room , supadminId} = data;

    let room_data;

    try {
        room_data = await db.classroom.create({
            data:{
                room : room
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- room_data -- : " , room_data , " -- End -- ")
    return redirect(`/admin/${supadminId}/classroomLists`);

}

export const SupCreateClassRoomAction = CreateSafeAction(SupCreateClassRoomSchema , handler);