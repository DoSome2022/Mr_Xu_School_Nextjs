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
import { School_timetable_Create_Schema } from "@/actions/Create-School_Timetable/schema";
import { SWR_School_Year } from "../fatchdata/swrschool_year";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { createSchoolTimeTable } from "@/actions/Create-School_Timetable";
import Image from "next/image";

interface SchoolID {
    SchoolId : string;
}

interface SchoolData {
    id: string;
    school_name : string;
}

interface SchoolTimeTable_Create_FormProps{
    SchoolId : SchoolID;
    data: SchoolData
}




const SchoolTimeTable_Create_Form = ({SchoolId , data} : SchoolTimeTable_Create_FormProps) =>{
    
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");
    const [isPending , startTransition] = useTransition();

        //上傳圖片
        const [uploadedImageUrl, setUploadedImageUrl ] = useState();

        // console.log("-- School Data : --",data[0],"-- end --")
    
        const [ SchoolName , setSchoolName ] = useState('');

        useEffect(()=>{
            if(data && data[0] && data[0].school_name){
             setSchoolName(data[0].school_name);
             schooltimetable_create_form.setValue("school_name", data[0].school_name)
            }
         },[data ])        

    const schooltimetable_create_form = useForm<z.infer<typeof School_timetable_Create_Schema>>({
        resolver : zodResolver(School_timetable_Create_Schema),
        defaultValues:{
            name: "",
            school_name: SchoolName ,
            year:"",
            school_school_timetable_id: SchoolId ,
            img:"",
            grade: 0,
            quarter: 0,
        }
    })

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
        schooltimetable_create_form.setValue("img",imageUrl)
        console.log("--上傳後--",imageUrl,"-- end --")


    }


    const schooltimetable_create_form_onSubmit = (values : z.infer<typeof School_timetable_Create_Schema>) => {
        console.log("--  create schooltimetable -- : ", values ,"-- End --")
        setError("");
        setSuccess("");
        startTransition(() => {
            createSchoolTimeTable(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })


    }

    return(
        <>
            <Form {...schooltimetable_create_form}>
                <form
                    onSubmit={schooltimetable_create_form.handleSubmit(schooltimetable_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={schooltimetable_create_form.control}
                    name="name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 標題 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="標題"
                type="text"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                {data.map((d)=>{
            
            return(
                
                <>
            
            <div className="space-y-4">
                <FormField
                    control={schooltimetable_create_form.control}

                    name="school_name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 學校名稱 </FormLabel>
                    <FormControl>

                <Input 
                {...field}
                placeholder={d.school_name}
                defaultValue={d.school_name}
                type="text"
                />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 
                </>
            )
})}

<div className="space-y-4" >
                <FormField
                    control={schooltimetable_create_form.control}
                    name="school_booklist_id"
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input 
                            {...field}
                            type="text"
                            value={
                                SchoolId
                            }
                            disabled
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 





                <div className="space-y-4">
                <FormField
                    control={schooltimetable_create_form.control}
                    name="year"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年份 </FormLabel>
                    <FormControl>
                        <SWR_School_Year  field={field} />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 
                
                <div className="space-y-4">
                <FormField
                    control={schooltimetable_create_form.control}
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
                    control={schooltimetable_create_form.control}
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
                    control={schooltimetable_create_form.control}
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
        </FormItem>
                        </>
                    )}
                />
                </div> 
                
                <Button disabled={isPending} type="submit">
                    建立
                </Button>

                </form>
            </Form>

            {
                uploadedImageUrl && (
                    <Image
                    width={500}
                    height={500}
                    src={uploadedImageUrl}
                    alt=""
                    />
                )
            }

        </>
    )
}
export default SchoolTimeTable_Create_Form
