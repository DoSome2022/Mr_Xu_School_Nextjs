"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from 'next/navigation'; // 导入 useRouter


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
import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { parent_student_ex_timetable_create_schema } from "@/actions/Create-Parent_Student_Ex_timetable/schema";
import { createParentStudentExTimeTable } from "@/actions/Create-Parent_Student_Ex_timetable";

const Parent_Student_ExtimeLists_Create_Form = () => {
    const [isPending, startTransition] = useTransition();
    const params = useParams();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
        const router = useRouter(); // 初始化 router
    
    const [GetStudentData, setGetStudentData] = useState<any[]>([]);
    const [GetSchoolData, setGetSchoolData] = useState<any[]>([]);
    const [fileBase64, setFileBase64] = useState<string>("");
    const [originalFileName, setOriginalFileName] = useState<string>("");
    const [studentname , setstudentname] = useState("");

    const parent_student_extimelists_create_form = useForm<z.infer<typeof parent_student_ex_timetable_create_schema>>({
        resolver: zodResolver(parent_student_ex_timetable_create_schema),
        defaultValues: {
            parentid: ParentID,
            name: "",
            student_ex_timetable_id: StudentID,
            student_name: "",
            grade: 0,
            year: "",
            school: "",
            img: "",
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
                parent_student_extimelists_create_form.setValue("img", base64String);
                parent_student_extimelists_create_form.setValue("originalFileName", file.name);
            };
            reader.readAsDataURL(file);
        }
    };

  const parent_student_extimelists_create_onSubmit = (values: z.infer<typeof parent_student_ex_timetable_create_schema>) => {
        startTransition(async () => {
            try {
                // 调用 Server Action 并获取返回值
                const result = await createParentStudentExTimeTable(values);
                
                if (result?.error) {
                    // 处理错误，例如显示错误提示
                    console.error("Upload failed:", result.error);
                    // toast.error(result.error); // 可以使用 toast 库显示错误
                    return;
                }
                
                if (result?.success) {
                    // 操作成功，在客户端进行重定向
                    parent_student_extimelists_create_form.reset();
                    setFileBase64("");
                    setOriginalFileName("");
                    
                    // 使用 router.push 进行客户端导航
                    router.push(`/parent/${ParentID}/profiles/${StudentID}/upload/extimeLists`);
                    // 或者使用 router.refresh() 如果只需要刷新当前页面而不是跳转
                    // router.refresh();
                }
            } catch (error) {
                console.error("Unexpected error:", error);
                // 处理意外错误
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
                    parent_student_extimelists_create_form.setValue("student_name", result[0].name);
                }
            };
            fetchStudentData();
        }
    }, [StudentID]);

    console.log("GetStudentData : ",GetStudentData)

    useEffect(() => {
    const name = GetStudentData[0]?.name;

    parent_student_extimelists_create_form.setValue("student_name" , name)
    setstudentname(name);
    parent_student_extimelists_create_form.getValues("student_name")

    const school_name = GetStudentData[0]?.school;

    parent_student_extimelists_create_form.setValue("school", school_name);

    },[GetStudentData])


    console.log("bug : ", parent_student_extimelists_create_form.formState.errors , "--end --")


     return(
            <>
    <Form {...parent_student_extimelists_create_form}>
                    <form
                        onSubmit={parent_student_extimelists_create_form.handleSubmit(parent_student_extimelists_create_onSubmit)}
                        className="space-y-6"
                    >
                    
                    <div className="space-y-4">
                    <FormField
                        control={parent_student_extimelists_create_form.control}
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
                    control={parent_student_extimelists_create_form.control}
                    name="school"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>學校</FormLabel>
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
                        control={parent_student_extimelists_create_form.control}
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
                    </FormItem>
                        )}
                    />
                    </div> 

    
                <div className="space-y-4">
                    <FormField
                        control={parent_student_extimelists_create_form.control}
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
                        control={parent_student_extimelists_create_form.control}
                        name="year"
                        render={({ field }) => (
                    <FormItem>
                        <FormLabel> 年份 </FormLabel>
                        <FormControl>
                            <SWR_School_Year field={field} />
                        </FormControl>
                    </FormItem>
                        )}
                    />
                    </div>
    
                    <div className="space-y-4">
                    <FormField
                        control={parent_student_extimelists_create_form.control}
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
                        control={parent_student_extimelists_create_form.control}
                        name="quarter"
                        render={({ field }) => (
                    <FormItem>
                        <FormLabel> 季度 </FormLabel>
                        <FormControl>
                            <SWR_School_Quarter  field={field} />
                        </FormControl>
                    </FormItem>
                        )}
                    />
                    </div> 
    
    
                    <FormField
                    control={parent_student_extimelists_create_form.control}
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
    
                    <Button disabled={isPending} type="submit">
                        建立
                    </Button>
    
                    </form>

                </Form>
            </>
        )
};

export default Parent_Student_ExtimeLists_Create_Form;


