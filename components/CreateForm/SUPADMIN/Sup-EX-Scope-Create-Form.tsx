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

import { Ex_scope_Create_Schema } from "@/actions/Create-Ex_scope/schema";

import Image from "next/image";
import { createExScope } from "@/actions/Create-Ex_scope";
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";




interface SchoolData {
    id: string;
    school_name : string;
}

interface EX_Scope_Create_FormProps{
    SchoolId : string;
    data: SchoolData[]
}


const EX_Scope_Create_Form_bysupadmin = ({ SchoolId , data }:EX_Scope_Create_FormProps) =>{

    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");
    const [isPending , startTransition] = useTransition();
    const [PreviewImage, setPreviewImage] = useState<string | null>(null);

    // //上傳圖片
    // const [uploadedImageUrl, setUploadedImageUrl ] = useState();

    // console.log("-- School Data : --",data[0],"-- end --")

    const [ SchoolName , setSchoolName ] = useState('');

    useEffect(()=>{
        if(data && data[0] && data[0].school_name){
         setSchoolName(data[0].school_name);
         ex_scope_create_form.setValue("school_name", data[0].school_name)
        }
     },[data ])

    const ex_scope_create_form = useForm<z.infer<typeof Ex_scope_Create_Schema>>({
        resolver : zodResolver(Ex_scope_Create_Schema),
        defaultValues:{
            name : "",
            school_name : SchoolName,
            grade : 0,
            quarter : 0 ,
            school_ex_scope_id : SchoolId,
            subject: "",
            img : "" 
        }
    })

  // 處理圖片上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        ex_scope_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);

      setPreviewImage(URL.createObjectURL(file));
    }
  };




    const ex_scope_create_form_onSubmit = (values : z.infer<typeof Ex_scope_Create_Schema>) => {
        console.log("--  create ex scope -- : ", values ,"-- End --");
        setError("");
        setSuccess("");
        startTransition(() => {
            createExScope(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }


    return(
        <>
                      {error && <div className="text-red-500 mb-4">{error}</div>}
                      {success && <div className="text-green-500 mb-4">{success}</div>}


 <Form {...ex_scope_create_form}>
                <form
                    onSubmit={ex_scope_create_form.handleSubmit(ex_scope_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={ex_scope_create_form.control}
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
                    control={ex_scope_create_form.control}

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

<div className="space-y-4" 
    hidden
>
                <FormField
                    control={ex_scope_create_form.control}
                    name="school_ex_scope_id"
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
                    control={ex_scope_create_form.control}
                    name="subject"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 科目 </FormLabel>
                    <FormControl>
                        <SWR_School_Subject  field={field} />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={ex_scope_create_form.control}
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
                    control={ex_scope_create_form.control}
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
                    control={ex_scope_create_form.control}
                    name="img"
                    render={({ field }) => (
                        <>
                <FormItem> 
            <FormLabel>上傳</FormLabel> 
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
                
                <button disabled={isPending} type="submit">
                    建立
                </button>

                </form>
            </Form>


                {PreviewImage && (
          <Image
            width={500}
            height={500}
            src={PreviewImage}
            alt="預覽圖片"
            className="mt-4"
          />
        )}
        </>
    )
}
export default EX_Scope_Create_Form_bysupadmin

