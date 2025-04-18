"use client";


import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams } from "next/navigation";

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


import { SWR_Course_Level } from "../fatchdata/swrcourse_level";
import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { Course_Update_Schema } from "@/actions/Update-Course/schema";
import { update_Course } from "@/actions/Update-Course";



const Course_Update_Form = () => {

    const params = useParams();
    const CourseID = params?.coursedetailbyID as string

    const [isPending , startTransition] = useTransition();

    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");




    //為了拿老師data
    const [ GetTeacherData , setgetTeacherData ] = useState([]);

    
    //拿老師的id來做course裹老師的定點
    const [ GetSelectedTeacherID , setGetSelectedTeacherID ] = useState([]);

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

    const [ GetCourseData , setGetCourseData ] = useState([]);
    useEffect(() => {
        if(CourseID){
        const getcoursedata = async (courseid : string) =>{
            //在app/api/Course_data/route.ts
            const res = await fetch(`/api/Course_detail_data_by_id_findMany/${courseid}`);
            if(!res){
                throw new Error("斷線！")
            }
            
           const result = await res.json()

           setGetCourseData(result)

        }
            getcoursedata(CourseID)
        }


    },[CourseID])

    console.log(GetCourseData)

    const [GetCourseName , setGetCourseName] = useState('')
    const [GetCourseSubject ,setGetCourseSubject] = useState('')
    const [GetCoursePersons , setGetCoursePersons] = useState(0)
    const [GetCourseGrade , setGetCourseGrade] = useState(0)
    const [GetCourseLevel , setGetCourseLevel] = useState('')
    const [GetCourseTeacher , setGetCourseTeacher] = useState('')
    const [GetCourseTeacher_data_id , setGetCourseTeacher_data_id] = useState([])



    const course_create_form = useForm<z.infer<typeof Course_Update_Schema>>({
        resolver: zodResolver(Course_Update_Schema),
        defaultValues:{
            courseId: CourseID,
            course_name: "",
            course_subject: "",
            persons: 0,
            grade: 0,
            course_level: "",
            teacher: "",
            course_teacher_data_id: GetSelectedTeacherID,
        }
    }) 

    useEffect(()=>{
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].course_name){
            setGetCourseName(GetCourseData[0].course_name);
            course_create_form.setValue("course_name", GetCourseData[0].course_name);
        }
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].course_subject){
            setGetCourseSubject(GetCourseData[0].course_subject);
            course_create_form.setValue("course_subject", GetCourseData[0].course_subject);
        }
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].persons){
            setGetCoursePersons(GetCourseData[0].persons);
            course_create_form.setValue("persons", GetCourseData[0].persons);
        }
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].grade){
            setGetCourseGrade(GetCourseData[0].grade);
            course_create_form.setValue("grade", GetCourseData[0].grade);
        }
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].course_level){
            setGetCourseLevel(GetCourseData[0].course_level);
            course_create_form.setValue("course_level", GetCourseData[0].course_level);
        }
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].teacher){
            setGetCourseTeacher(GetCourseData[0].teacher);
            course_create_form.setValue("teacher", GetCourseData[0].teacher);
        }
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].course_teacher_data_id
        ){
            setGetCourseTeacher_data_id(GetCourseData[0].course_teacher_data_id
            );
            course_create_form.setValue("course_teacher_data_id", GetCourseData[0].course_teacher_data_id
            );
        }
    },[GetCourseData])

    const course_create_form_onSubmit = (values: z.infer<typeof Course_Update_Schema>) => {
        console.log("-- create course輸入 -- : ",values,"-- End --")
        setError("");
        setSuccess("");

        startTransition(() => {
            update_Course(values)
        })
    }

    return(
        <>
            <Form {...course_create_form} >
                <form 
                onSubmit={course_create_form.handleSubmit(course_create_form_onSubmit)}
                className="space-y-6">

            {GetCourseData.map((d)=>{
                return(
                    <>
            <div className="space-y-4">
                <FormField
                    control={course_create_form.control}
                    name="courseId"
                    render={({ field }) => (
                <FormItem>

                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder={CourseID}
                            defaultValue={CourseID}
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
                    control={course_create_form.control}
                    name="course_name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 課程名稱 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder={d.course_name}
                            defaultValue={d.course_name}
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
                    control={course_create_form.control}
                    name="course_subject"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 課程科目 : {d.course_subject}，下面更改</FormLabel>
                    <FormControl>
                        <SWR_School_Subject  field={field} />
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
                    <FormLabel> 人數 : {d.persons} ，下面更改</FormLabel>
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
                    <FormLabel> 年級 : {d.grade} ，下面更改</FormLabel>
                    <FormControl>
                        <SWR_School_Grade  field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 


            <div className="space-y-4">
                <FormField
                    control={course_create_form.control}
                    name="course_level"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 課程難度 :{d.course_level} ，下面更改 </FormLabel>
                    <FormControl>
                  
                        <SWR_Course_Level field={field} />
                

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
                    <FormLabel> 老師 : {d.teacher}  ，下面更改 </FormLabel>
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
                    </>
                )
            })}

            


            <FormError message={error }/>
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit">
                   更改
            </Button>


                </form>

            </Form>
        </>
    )
}

export default Course_Update_Form