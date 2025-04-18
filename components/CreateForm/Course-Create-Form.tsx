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

import { Course_Create_Schema } from "@/actions/Create-Course/schema"; 
import { create_Course } from "@/actions/Create-Course";
import { SWR_Course_Level } from "../fatchdata/swrcourse_level";
import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_Class_Room } from "../fatchdata/swrclass_room";

// 定義年級對應對象
const gradeMapping = {
    1: "小學1年級",
    2: "小學2年級",
    3: "小學3年級",
    4: "小學4年級",
    5: "小學5年級",
    6: "小學6年級",
    7: "初中1年級",
    8: "初中2年級",
    9: "初中3年級",
    10: "高中1年級",
    11: "高中2年級",
    12: "高中3年級",
  };
  


const Course_Create_Form = () => {
    const searchParams = useSearchParams();
    const [isPending , startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");
    //為了拿老師data
    const [ GetTeacherData , setgetTeacherData ] = useState([]);    
    //拿老師的id來做course裹老師的定點
    const [ GetSelectedTeacherID , setGetSelectedTeacherID ] = useState([]);
    //為了拿 TimeTemplate data
    const [ GetTimeTemplateData , setGetTimeTemplateData ] = useState([]);

    const [ selectedLCSData , setSelectedLCSData ] = useState(null); 

    const handleLCSChange = (value:any) => {
        const selectedData = GetTimeTemplateData.find((data:any)=> {
            const LCS = gradeMapping[data.grade] + " 科目: " +  data.subject;
            return LCS === value;
        });
        setSelectedLCSData(selectedData);
        course_create_form.setValue('TimeTemplateID', selectedData ? selectedData.id : '');
    }



    //拿老師data
    useEffect(() => {
        const getTeacherData = async () =>{
            //在app/api/Course_data/route.ts
            const res = await fetch('/api/Course_data_teacher');
            if(!res){
                throw new Error("斷線！")
            }  
           const result = await res.json()
           setgetTeacherData(result)
        }
        getTeacherData()
    },[])

    useEffect(()=>{
        const getTTdata = async () =>{
            //在app/api/TimeTemplate_Lists/route.ts
            const res = await fetch('/api/TimeTemplate_Lists');
            if(!res){
                throw new Error("斷線！")
            }  
           const result = await res.json()
           setGetTimeTemplateData(result)
        }
        getTTdata()
    },[])

    console.log('GetTimeTemplateData : , ',GetTimeTemplateData,"-- END --")

    const course_create_form = useForm<z.infer<typeof Course_Create_Schema>>({
        resolver: zodResolver(Course_Create_Schema),
        defaultValues:{
            course_name: "",
            course_subject: "",
            persons: 0,
            grade: 0,
            teacher: "",
            course_teacher_data_id: GetSelectedTeacherID,
            TimeTemplateID : "",
            publicholiday: [],
            weekdays: [],
            days: [],
            classroom:"",
        }
    }) 

// 在 handleTimeTemplateChange 中移除 TimeTemplate
const handleTimeTemplateChange = (value: string) => {
    const selectedData = GetTimeTemplateData.find((data) => data.title === value);
    setSelectedLCSData(selectedData);
    if (selectedData) {
        course_create_form.setValue("TimeTemplateID", selectedData.id);
        course_create_form.setValue("day_start", selectedData.day_start);
        course_create_form.setValue("day_end", selectedData.day_end);
        course_create_form.setValue("start_time", selectedData.start_time);
        course_create_form.setValue("end_time", selectedData.end_time);
        course_create_form.setValue("days", selectedData.days);
        course_create_form.setValue("weekdays", selectedData.weekdays);
        course_create_form.setValue("publicholiday", selectedData.publicholiday_model);
        course_create_form.setValue("grade", selectedData.grade);
    }
};
    const course_create_form_onSubmit = (values: z.infer<typeof Course_Create_Schema>) => {
        console.log("-- create course輸入 -- : ",values,"-- End --")
        setError("");
        setSuccess("");

        startTransition(() => {
            create_Course(values)
        })
    }

    console.log("-- bug -- : ", course_create_form.formState.errors ,"-- END --")

    return(
        <>
            <Form {...course_create_form} >
                <form 
                onSubmit={course_create_form.handleSubmit(course_create_form_onSubmit)}
                className="space-y-6">
                   <div className="space-y-4">
                <FormField
                    control={course_create_form.control}
                    name="course_name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 課程名稱/課程ID </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入課程名稱/課程ID"
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
                    control={course_create_form.control}
                    name="TimeTemplateID"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> TimeTemplateID </FormLabel>
                    <FormControl>
                    <Input
                                        {...field}
                                        disabled={true} // 自動填充，禁用手動輸入
                                        value={selectedLCSData ? selectedLCSData.id : ""}
                                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 

            <div className="space-y-4">
                    <FormField
                        control={course_create_form.control}
                        name="TimeTemplate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>時間模組</FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => {
                                        field.onChange(value);
                                        handleTimeTemplateChange(value);
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="選擇" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GetTimeTemplateData.map((data) => (
                                                <SelectItem value={data.title} key={data.id}>
                                                    標題: {data.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>



            <div className="space-y-4"
            
            >
                <FormField
                    control={course_create_form.control}
                    name="course_subject"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 課程科目 </FormLabel>
                    <FormControl>
                        <SWR_School_Subject field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 


            
            <div className="space-y-4">
                <FormField
                    control={course_create_form.control}
                    name="teacher"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 老師 </FormLabel>
                    <FormControl>
                        <Select 
                        defaultValue={field.value}
                        onValueChange={(value) => {
                            field.onChange(value);
                            const SelectedTeacherID = GetTeacherData.find((data) => data.username === value);
                            // setGetSelectedTeacherID(SelectedTeacherID?.id || "");
                            // course_create_form.setValue("course_teacher_data_id",SelectedTeacherID?.id || "" )
                            if(SelectedTeacherID?.id) {
                                const updatedIDs = [...GetSelectedTeacherID, SelectedTeacherID.id ];
                                setGetSelectedTeacherID(updatedIDs);
                                course_create_form.setValue("course_teacher_data_id",updatedIDs)
                            }
                        }}
                        >
                            <SelectTrigger>
                            <SelectValue placeholder="選擇老師"/>
                            </SelectTrigger>
                            <SelectContent>
                            {GetTeacherData.map((data)=>{
                                if( data.role === "TEACHER" )
                                    {
                                        return(
                                            <>
                                            <SelectItem value={data.username} key={data.id} >
                                            名：{data.username}
                                            </SelectItem>
                                            </>
                                        )
                                    }

                            })}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 


            <div className="space-y-4"
            hidden>
                <FormField
                    control={course_create_form.control}
                    name="course_teacher_data_id"
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input 
                            {...field}
                            type="text"
                            value={GetSelectedTeacherID.join(", ")}
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
                    control={course_create_form.control}
                    name="persons"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 人數 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入人數"
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 


            <div className="space-y-4">
                <FormField
                    control={course_create_form.control}
                    name="grade"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 學生 </FormLabel>
                    <FormControl>
                        
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div>

                        <div className="space-y-4">
                <FormField
                    control={course_create_form.control}
                    name="classroom"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 課室 </FormLabel>
                    <FormControl>
                        <SWR_Class_Room  field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div>  


{/* 隱藏欄位，僅用於傳遞數據 */}
<FormField
                    control={course_create_form.control}
                    name="day_start"
                    render={({ field }) => (
                        <FormItem hidden>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={course_create_form.control}
                    name="day_end"
                    render={({ field }) => (
                        <FormItem hidden>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={course_create_form.control}
                    name="start_time"
                    render={({ field }) => (
                        <FormItem hidden>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={course_create_form.control}
                    name="end_time"
                    render={({ field }) => (
                        <FormItem hidden>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={course_create_form.control}
                    name="days"
                    render={({ field }) => (
                        <FormItem hidden>
                            <FormControl>
                                <Input {...field} value={JSON.stringify(field.value)} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={course_create_form.control}
                    name="weekdays"
                    render={({ field }) => (
                        <FormItem hidden>
                            <FormControl>
                                <Input {...field} value={JSON.stringify(field.value)} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={course_create_form.control}
                    name="publicholiday"
                    render={({ field }) => (
                        <FormItem hidden>
                            <FormControl>
                                <Input {...field} value={JSON.stringify(field.value)} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={course_create_form.control}
                    name="grade"
                    render={({ field }) => (
                        <FormItem hidden>
                            <FormControl>
                                <Input {...field} type="number" />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormError message={error} />
                <FormSuccess message={success} />
                <Button disabled={isPending} type="submit">
                    建立
                </Button>


                </form>

            </Form>
        </>
    )
}

export default Course_Create_Form