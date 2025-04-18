"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from 'next/navigation';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
import { parent_student_ex_scope_create_schema } from "@/actions/Create-Parent_Student_Ex_scope/schema";
import { createParentStudentExScope } from "@/actions/Create-Parent_Student_Ex_scope";

const Parent_Student_ExscopeLists_Create_Form = () => {
    const [isPending, startTransition] = useTransition();
    const params = useParams();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    
    const [GetStudentData, setGetStudentData] = useState<any[]>([]);
    const [GetSchoolData, setGetSchoolData] = useState<any[]>([]);
    const [fileBase64, setFileBase64] = useState<string>("");
    const [originalFileName, setOriginalFileName] = useState<string>("");

    const parent_student_exscopelists_create_form = useForm<z.infer<typeof parent_student_ex_scope_create_schema>>({
        resolver: zodResolver(parent_student_ex_scope_create_schema),
        defaultValues: {
            parentid: ParentID,
            name: "",
            student_ex_scope_id: StudentID,
            student_name: "",
            grade: 0,
            school: "",
            img: "",
            quarter:0,
            subject:"",
            originalFileName: "" // 添加這一行
        }
    });

    // 文件處理函數
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOriginalFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target?.result as string;
                setFileBase64(base64String);
                parent_student_exscopelists_create_form.setValue("img", base64String);
                parent_student_exscopelists_create_form.setValue("originalFileName", file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const parent_student_exscopelists_create_onSubmit = (values: z.infer<typeof parent_student_ex_scope_create_schema>) => {
        startTransition(async () => {
            try {
                await createParentStudentExScope(values);
                parent_student_exscopelists_create_form.reset();
                setFileBase64("");
                setOriginalFileName("");
            } catch (error) {
                console.error("Upload failed:", error);
                // 這裡可以添加錯誤處理 UI
            }
        });
    };

    useEffect(() => {
        const fetchSchoolData = async () => {
            const res = await fetch(`/api/School_Lists/`);
            if (!res.ok) throw new Error("Network error!");
            const result = await res.json();
            setGetSchoolData(result);
        };
        fetchSchoolData();
    }, []);


    useEffect(() => {
        if (StudentID) {
            const fetchStudentData = async () => {
                const res = await fetch(`/api/Parents_Student/Parents_Student_Lists_detail_data_by_id/${StudentID}`);
                if (!res.ok) throw new Error("Network error!");
                const result = await res.json();
                setGetStudentData(result);
                if (result[0]?.name) {
                    parent_student_exscopelists_create_form.setValue("student_name", result[0].name);
                }
            };
            fetchStudentData();
        }
    }, [StudentID]);

   

    useEffect(()=>{
        const school_name = GetStudentData[0]?.school;
        parent_student_exscopelists_create_form.setValue("school",school_name)
    },[GetStudentData])

    return(
           <>
   <Form {...parent_student_exscopelists_create_form}>
                   <form
                       onSubmit={parent_student_exscopelists_create_form.handleSubmit(parent_student_exscopelists_create_onSubmit)}
                       className="space-y-6"
                   >
                   
                   <div className="space-y-4">
                   <FormField
                       control={parent_student_exscopelists_create_form.control}
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
                       control={parent_student_exscopelists_create_form.control}
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
                   //hidden
                   >

               </div> 
               <div className="space-y-4">
                <FormField
                    control={parent_student_exscopelists_create_form.control}
                    name="school"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>學校</FormLabel>
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
                       control={parent_student_exscopelists_create_form.control}
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
                       control={parent_student_exscopelists_create_form.control}
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
                       control={parent_student_exscopelists_create_form.control}
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
                   <FormField
                    control={parent_student_exscopelists_create_form.control}
                    name="img"
                    render={() => (
                        <FormItem>
                            <FormLabel>文件</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isPending}
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".jpg,.png,.pdf,.rar,.zip" // 可根據需要調整接受的文件類型
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {fileBase64 && (
                    <div className="text-sm text-gray-500">
                        已選擇文件: {originalFileName}
                    </div>
                )}
                   
                   <button disabled={isPending} type="submit">
                       建立
                   </button>
   
                   </form>

               </Form>
           </>
       )
};

export default Parent_Student_ExscopeLists_Create_Form;


