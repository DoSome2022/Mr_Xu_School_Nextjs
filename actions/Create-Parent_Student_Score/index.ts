"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { parent_student_score_create_schema } from "./schema";
import { redirect } from 'next/navigation'
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



const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        student_name,
        student_score_id,
        subject,
        grade,
        score,
        quarter,
        school,
        year,
        name,
        img,
        parentid,
        originalFileName // 添加原始文件名作為參數
        } = data;

    let parent_student_score_Data;
    let filePath;

    try {
        if(img){
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

        parent_student_score_Data = await db.student_score.create({
            data:{
                student_name : student_name,
                student_score_id : student_score_id,
                subject : subject,
                grade : grade,
                score : score,
                quarter : quarter,
                year: year,
                school: school,
                name: name,
                img:relativePath,
            }
        });


        }else{
            parent_student_score_Data = await db.student_score.create({
                data:{
                    student_name : student_name,
                    student_score_id : student_score_id,
                    subject : subject,
                    grade : grade,
                    score : score,
                    quarter : quarter,
                    year: year,
                    school: school,
                    name: name,
                }
            });
        }

        // 刷新緩存
        revalidatePath(`/parent/${parentid}/profiles/${student_score_id}/upload/scoreLists`);


    } catch (error) {
        console.log(error)
    }
    console.log("-- parent_student_score_Data -- : " , parent_student_score_Data , " -- End -- ")
    return redirect(`/parent/${parentid}/profiles/${student_score_id}/upload/scoreLists`);
}

export const createParentStudentScore = CreateSafeAction(parent_student_score_create_schema, handler)