// "use server";

// import { revalidatePath } from "next/cache"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { LessonCal_Update_Schema } from "./schema";
// import { redirect } from "next/navigation";
// import { InputType, ReturnType } from "./types";

// const handler = async (data: InputType) : Promise<ReturnType> => {

//     const {lscId , lesson_date , course_lesson} = data;

//     // const dateString = lesson_date.date;
//     // const courseName = course_lesson.name;

//     const lessonDates = Object.values(lesson_date).map(date => new Date(date).toISOString());
//     const courseLessons = Object.values(course_lesson);

//     let lessondate;

//     try {
//         lessondate = await db.lesson_calendar.update({
//             where:{
//                 id: lscId
//             },
//             data:{
//                 lesson_date: lessonDates.map(date => new Date(date)),
//                 courseLesson : courseLessons
//             }
//         })
        
//     } catch (error) {
//         console.log(error);
//         return {
//             error: "無法更新課程日曆。",
//           };
//     }
//     console.log("-- LCS_Update_Data -- : ", lessondate ,"-- End --")
//     return redirect(`/admin/lessoncalendarsettingLists/${lscId}`)
// }

// export const update_LCS = CreateSafeAction(LessonCal_Update_Schema, handler)