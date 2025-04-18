"use client";


import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input"; 

import { Button } from "@/components/ui/button";

import Image from "next/image"; 

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


import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { Score_Create_Schema } from "@/actions/Create-Score/schema";

interface StudentID {
    studentId : string;
}

interface StudentData{
    id : string;
    name : string;
    grade : number;
    school : string;
}

interface Score_Create_FormProps{
    studentId : StudentID;
    data : StudentData
}


const Score_Create_Form = ({ studentId , data }: Score_Create_FormProps) =>{
    //上傳圖片
    // const [uploadedImageUrl, setUploadedImageUrl ] = useState();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");
    const [isPending , startTransition] = useTransition();

    const score_create_form = useForm<z.infer<typeof Score_Create_Schema>>({
        resolver : zodResolver(Score_Create_Schema),
        defaultValues:{
            subject: "",
            school_name:"",
            school_score_id:studentId,
            grade:0,
            quarter:0,
            score:0
        }
    })

    useEffect(()=>{
        if(data && data[0] && data[0].name){
            student_booklist_create_form.setValue('student_name', data[0]?.name)
        }

    },[data[0]])

    // const handleImageUpload = async (event) => {
    //     const file = event.target.files[0]
    //     const formData = new FormData();
    //     formData.append("file",file);
    //     formData.append("upload_preset", "test_upLoad_img")


    //     console.log("-- 已選的圖片 --",file,"--end--")

    //     const uploadResponse = await fetch(
    //         "https://api.cloudinary.com/v1_1/dlullfqaw/image/upload",
    //         {
    //             method:"POST",
    //             body:formData,
    //         }
    //     );

    //     const uploadedImageData = await uploadResponse.json();
    //     const imageUrl = uploadedImageData.secure_url;
    //     setUploadedImageUrl(imageUrl);
    //     score_create_form.setValue("img",imageUrl)
    //     console.log("--上傳後--",imageUrl,"-- end --")


    // }


    const score_create_form_onSubmit = (values : z.infer<typeof Score_Create_Schema>) => {
        console.log("--  create score -- : ", values ,"-- End --");
        setError("");
        setSuccess("");

    }


    return(
        <>
<Form {...score_create_form}>
                <form
                    onSubmit={score_create_form.handleSubmit(score_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={score_create_form.control}
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
                    control={score_create_form.control}
                    name="school_name"
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


                <div className="space-y-4">
                <FormField
                    control={score_create_form.control}
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
                    control={score_create_form.control}
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
                    control={score_create_form.control}
                    name="score"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 上傳成積 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="上傳圖片"
                type="file"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 
                
                <button disabled={isPending} type="submit">
                    建立
                </button>

                </form>
            </Form>
        </>
    )
}
export default Score_Create_Form
