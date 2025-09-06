"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupAddClass_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            studentId,
            targetclassId,
            currentclassId,
            class_date,
            name,
            student_class_date,
            courseId
        } = data;

    let addClass_data;

    try {
        const result = await db.$transaction(async (prisma) => {
            const AddClass = await prisma.addClass.create({
                data: {
                    studentId,
                    targetclassId,
                    currentclassId,
                    date: class_date,
                    name,
                }
            });


            const currentClass = await prisma.class.findUnique({
                where: { id: currentclassId },
            });

            if (!currentClass) {
                throw new Error(`找不到目標班級 ID: ${currentclassId}`);
              }

              await prisma.class.update({
                where: { id: currentclassId },
                data: {
                  persons: { increment: 1 },
                  node: { increment: 1 },

                },
              });

                // 5. 為學生的 student_class 添加目標班級
                await prisma.student.update({
                    where: { id: studentId },
                    data: {
                    student_class: {
                        connect: { id: currentclassId },
                    },
                    },
                });
              return AddClass;

        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- addClass_Data -- : " , addClass_data , " -- End -- ")
    return redirect(`/admin/courseLists/${courseId}/classLists/${targetclassId}`);
}

export const SupcreateAddClass = CreateSafeAction(SupAddClass_Create_Schema, handler)