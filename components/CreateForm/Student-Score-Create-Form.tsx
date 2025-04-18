"use client";


import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input"; 

import { Button } from "@/components/ui/button";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { student_score_Create_Schema } from "@/actions/Create-Student_Score/schema";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { createStudentScore } from "@/actions/Create-Student_Score";
import { SWR_School_Year } from "../fatchdata/swrschool_year";
import Image from "next/image";

interface StudentID {
    studentId : string;
}

interface StudentData{
    id : string;
    name : string;
    grade : number;
    school : string;
}

interface Student_Score_Create_FormProps{
    studentId : StudentID;
    data : StudentData
}



const Student_Score_Create_Form = ({studentId , data}:Student_Score_Create_FormProps) =>{

        //上傳圖片
        const [uploadedImageUrl, setUploadedImageUrl ] = useState();
        const [ error, setError ] = useState<string | undefined>("");
        const [ success, setSuccess  ] = useState<string | undefined>("");
        
    const [isPending , startTransition] = useTransition();

    const student_score_create_form = useForm<z.infer<typeof student_score_Create_Schema>>({
        resolver : zodResolver(student_score_Create_Schema),
        defaultValues:{
            subject: "",
            student_name:"",
            student_score_id: studentId,
            grade:0,
            quarter:0,
            score:0,
            year: "",
            school:"",
            name:"",
        }
    })

    useEffect(()=>{
        if(data && data[0] && data[0].name){
            student_score_create_form.setValue('student_name', data[0]?.name)
        }
        if(data && data[0] && data[0].school){
            student_score_create_form.setValue('school', data[0]?.school)
        }
    },[data[0]])

    const handleImageUpload = async (event) => {
        const file = event.target.files[0]
        const formData = new FormData();
        formData.append("file",file);
        formData.append("upload_preset", "test_upLoad_img")


        console.log("-- 已選的圖片 --",file,"--end--")

        const uploadResponse = await fetch(
            "https://api.cloudinary.com/v1_1/dlullfqaw/image/upload",
            {
                method:"POST",
                body:formData,
            }
        );

        const uploadedImageData = await uploadResponse.json();
        const imageUrl = uploadedImageData.secure_url;
        setUploadedImageUrl(imageUrl);
        student_score_create_form.setValue("img",imageUrl)
        console.log("--上傳後--",imageUrl,"-- end --")


    }


    const student_score_create_form_onSubmit = (values : z.infer<typeof student_score_Create_Schema>) => {
        console.log("--  create student_score -- : ", values ,"-- End --")
        setError("");
        setSuccess("");
        startTransition(() => {
            createStudentScore(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }


    return(
        <>
<Form {...student_score_create_form}>
                <form
                    onSubmit={student_score_create_form.handleSubmit(student_score_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={student_score_create_form.control}
                    name="name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 檔案名稱 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="檔案名稱"
                type="text"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 


                <div className="space-y-4">
                <FormField
                    control={student_score_create_form.control}
                    name="subject"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 科目 </FormLabel>
                    <FormControl>
                        <SWR_School_Subject field={field} />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={student_score_create_form.control}
                    name="student_name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 學生名字 </FormLabel>
                    <FormControl>
                    <Input 
                        {...field}
                        disabled={isPending}
                        placeholder="學生名字"
                        type="text"
                    />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 
                <div className="space-y-4" 
                //hidden
                >
                <FormField
                    control={student_score_create_form.control}
                    name="student_score_id"
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input 
                            {...field}
                            type="text"
                            value={studentId}
                            
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 
            <div className="space-y-4">
                <FormField
                    control={student_score_create_form.control}
                    name="school"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 學校 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="學校"
                value={data[0]?.school}
                type="text"
                />
                    </FormControl>
                    <FormMessage />
                    
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={student_score_create_form.control}
                    name="grade"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年級 </FormLabel>
                    <FormControl>
                        <SWR_School_Grade field={field} />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

            <div className="space-y-4">
                <FormField
                    control={student_score_create_form.control}
                    name="year"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年份 </FormLabel>
                    <FormControl>
                        <SWR_School_Year field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={student_score_create_form.control}
                    name="grade"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年級 </FormLabel>
                    <FormControl>
                        <SWR_School_Grade field={field} />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={student_score_create_form.control}
                    name="quarter"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 季度 </FormLabel>
                    <FormControl>
                        <SWR_School_Quarter field={field} />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={student_score_create_form.control}
                    name="img"
                    render={({ field }) => (
                        <>
                <FormItem> 
            <FormLabel>上傳圖片</FormLabel> 
            <FormControl>

                   <Input 
                {...field}
                disabled={isPending}
                
                type="hidden"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
            </FormControl> 
            </FormItem>
        <FormItem> 

            <FormControl>

                   <Input 

                disabled={isPending}
                onChange={handleImageUpload}
                type="file"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
        </FormControl> 
        <FormMessage />
        </FormItem>
                        </>
                    )}
                />

                </div> 
                
                <button disabled={isPending} type="submit">
                    建立
                </button>

                </form>
                {uploadedImageUrl && (
                    <Image 
                    width={500}
                    height={500}
                    src={uploadedImageUrl}
                    alt=""
                    />
                )}
            </Form>
        </>
    )
}
export default Student_Score_Create_Form
