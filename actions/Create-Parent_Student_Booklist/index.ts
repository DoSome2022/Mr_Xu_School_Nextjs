"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { parent_student_booklist_create_schema } from "./schema";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import { join } from "path";

// 處理不同類型文件的函數
const processUploadedFile = (fileData: string, originalFileName: string) => {
    // 移除 base64 前綴 (data:image/jpeg;base64, 或其他 MIME 類型)
    const base64Content = fileData.split(';base64,').pop();
    if (!base64Content) {
        throw new Error("Invalid file format");
    }

    // 從原始文件名中提取擴展名
    const fileExtension = originalFileName.split('.').pop()?.toLowerCase() || '';
    const buffer = Buffer.from(base64Content, 'base64');
    
    return { buffer, fileExtension };
};

const handler = async (data: InputType): Promise<ReturnType> => {
    const { 
        name, 
        img, // 假設這是一個包含 base64 數據的字符串
        student_booklist_id, 
        student_name, 
        grade, 
        year, 
        school, 
        parentid,
        originalFileName // 添加原始文件名作為參數
    } = data;

    let parent_student_booklist_Data;
    let filePath;

    try {
        // 如果有文件上傳
        if (img) {
            // 生成唯一的文件名
            const timestamp = Date.now();
            const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${year}-${school}`;
            
            // 處理上傳的文件
            const { buffer, fileExtension } = processUploadedFile(img, originalFileName || 'upload');
            
            // 確定文件存儲路徑
            const fileNameWithExt = `${safeFileName}.${fileExtension}`;
            filePath = join(process.cwd(), "public", "uploads", fileNameWithExt);

            // 寫入文件
            await writeFile(filePath, buffer);
            
            // 存儲相對路徑到數據庫
            const relativePath = `/uploads/${fileNameWithExt}`;

            // 創建數據庫記錄
            parent_student_booklist_Data = await db.student_booklist.create({
                data: {
                    name,
                    img: relativePath, // 存儲文件的相對路徑
                    student_booklist_id,
                    student_name,
                    grade,
                    year,
                    school,
                }
            });
        } else {
            // 如果沒有文件上傳
            parent_student_booklist_Data = await db.student_booklist.create({
                data: {
                    name,
                    student_booklist_id,
                    student_name,
                    grade,
                    year,
                    school,
                }
            });
        }

        // 刷新緩存
        revalidatePath(`/parent/${parentid}/profiles/${student_booklist_id}/upload/bookLists`);

    } catch (error) {
        console.error("Error processing upload:", error);
        throw new Error("Failed to process file upload");
    }

    console.log("-- parent_student_booklist_Data -- : ", parent_student_booklist_Data, " -- End -- ");
    return redirect(`/parent/${parentid}/profiles/${student_booklist_id}/upload/bookLists`);
};

export const createparentstudentbooklist = CreateSafeAction(parent_student_booklist_create_schema, handler);