"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Student_Update_Schema } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    name,
    school,
    grade,
    studentId,
    student_id,
    student_parent_data_id,
    pay = false,
    chine_ex_day,
    math_ex_day,
    eng_ex_day,
  } = data;

  console.log("-- Student_Data -- : ", data, " -- End -- ");

  try {
    // 檢查學生記錄是否存在
    const existingStudent = await db.student.findUnique({
      where: { id: studentId },
    });

    if (!existingStudent) {
      return { error: "學生記錄不存在" };
    }

    const Student_data = await db.student.update({
      where: { id: studentId },
      data: {
        name,
        school,
        grade,
        student_id,
        student_parent_data_id,
        pay,
        chine_ex_day,
        math_ex_day,
        eng_ex_day,
        ismember: false,
        issurvive: false,
      },
    });

    // 確保在 try 塊中僅執行數據庫操作
    revalidatePath(`/admin/userLists/parentsLists/${student_parent_data_id}/studentLists/${studentId}`);
    return { data: Student_data };
  } catch (error) {
    console.error("更新學生數據失敗:", error);
    return { error: error instanceof Error ? error.message : "更新學生數據失敗" };
  }
};

export const Update_Student = CreateSafeAction(Student_Update_Schema, async (data: InputType) => {
  const result = await handler(data);
  if (result.data) {
    redirect(`/admin/userLists/parentsLists/${data.student_parent_data_id}/studentLists/${data.studentId}`);
  }
  return result;
});