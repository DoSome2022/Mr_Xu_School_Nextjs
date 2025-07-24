"use client";


import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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




import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { student_ex_scope_Create_Schema } from "@/actions/Create-Student_Ex_scope /schema";
import Image from "next/image";
import { createStudentExScope } from "@/actions/Create-Student_Ex_scope ";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { useParams } from "next/navigation";


interface StudentData{
    id : string;
    name : string;
    grade : number;
    school : string;
}

interface Student_BookList_Create_FormProps{
    studentId : string;
    data : StudentData[]
}


const Student_EX_Scope_Create_Form = ({studentId , data}:Student_BookList_Create_FormProps) =>{

    const [isPending , startTransition] = useTransition();
    //上傳圖片
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");
    const param = useParams();
    const parentId = param.parentdetailbyID as string;

    console.log("param : ",param)

    
    const student_ex_scope_create_form = useForm<z.infer<typeof student_ex_scope_Create_Schema>>({
        resolver : zodResolver(student_ex_scope_Create_Schema),
        defaultValues:{
            name : "",
            student_name : "",
            grade : 0,
            quarter : 0 ,
            student_ex_scope_id : studentId,
            img : "" ,
            school: "",
            subject : "",
            parentId:parentId
        }
    })

    useEffect(()=>{
        if(data && data[0] && data[0].name){
            student_ex_scope_create_form.setValue('student_name', data[0]?.name)
        }
        if(data && data[0] && data[0].school){
            student_ex_scope_create_form.setValue('school', data[0]?.school)
        }
    },[data[0]])

  // 處理圖片上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        student_ex_scope_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };



    const student_ex_scope_create_form_onSubmit = (values : z.infer<typeof student_ex_scope_Create_Schema>) => {
        console.log("--  create ex scope -- : ", values ,"-- End --")
        setError("");
        setSuccess("");
        startTransition(() => {
            createStudentExScope(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }


    return(
        <>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
<Form {...student_ex_scope_create_form}>
                <form
                    onSubmit={student_ex_scope_create_form.handleSubmit(student_ex_scope_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={student_ex_scope_create_form.control}
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
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 
                <div className="space-y-4">
                <FormField
                    control={student_ex_scope_create_form.control}
                    name="student_name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 學生名稱 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                 disabled={isPending}
                placeholder="學生名稱"
                type="text"
                />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 
                <div className="space-y-4" 
                hidden
                >
                <FormField
                    control={student_ex_scope_create_form.control}
                    name="student_ex_scope_id"
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
                    control={student_ex_scope_create_form.control}
                    name="school"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 學校名稱 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="學校名稱"
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
                    control={student_ex_scope_create_form.control}
                    name="grade"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年級 </FormLabel>
                    <FormControl>
                        <SWR_School_Grade field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 


                <div className="space-y-4">
                <FormField
                    control={student_ex_scope_create_form.control}
                    name="quarter"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 季度 </FormLabel>
                    <FormControl>
                        <SWR_School_Quarter field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 
                <div className="space-y-4">
                <FormField
                    control={student_ex_scope_create_form.control}
                    name="subject"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 科目 </FormLabel>
                    <FormControl>
                        <SWR_School_Subject  field={field} />
                    </FormControl>
                    <FormMessage /><FormMessage />
                </FormItem>
                    )}
                />
                </div> 
                <div className="space-y-4">
            <FormField
              control={student_ex_scope_create_form.control}
              name="img"
              render={() => (
                <FormItem>
                  <FormLabel>上傳圖片</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      onChange={handleImageUpload}
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
                
                <Button disabled={isPending} type="submit">
                    建立
                </Button>

                </form>
                {previewImage && (
          <Image
            width={500}
            height={500}
            src={previewImage}
            alt="預覽圖片"
            className="mt-4"
          />
        )}
            </Form>
        </>
    )
}
export default Student_EX_Scope_Create_Form