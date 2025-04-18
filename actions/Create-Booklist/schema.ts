import { z } from "zod";

function checkFileType(file: File) {
    if (file?.name) {
        const fileType = file.name.split(".").pop();
        if (fileType === "docx" || fileType === "pdf" || fileType === "jpg") return true;
    }
    return false;
}


export const Booklist_Create_Schema = z.object({
    name : z.string(),
    // img : z.any().refine((file: File) => file?.length !== 0, "一定要有圖片／檔案"),
    img : z.string().url(),
    school_booklist_id : z.string(),
    school_name : z.string(),
    grade : z.number(),
    year : z.string()
})