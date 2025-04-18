"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams  } from "next/navigation";

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

import { student_parent_create_Schema } from "@/actions/Create-Student_Parent/schema";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { createStudentParentData } from "@/actions/Create-Student_Parent";

const Student_Create_Parent_Form = () => {

    const param = useParams();
    console.log(param);
    const parentId = param?.parentId as string;
    const [isPending , startTransition] = useTransition();

    const [  getSchoolsData , setgetSchoolsData ] = useState([])

    useEffect(()=>{
        const fetchschoolsData = async () =>{
            //在app/api/Ｎews_Lists/route.ts
            const res = await fetch('/api/School_Lists');
            if(!res){
                throw new Error("斷線！")
            }
            
           const result = await res.json()

           setgetSchoolsData(result)

        }
        fetchschoolsData()
    },[])


    const student_register_parent_form = useForm<z.infer<typeof student_parent_create_Schema>>({
        resolver:zodResolver(student_parent_create_Schema),
        defaultValues:{
            id:parentId,
            name:"",
            school:"",
            grade:0,
        }
    })

    const student_register_parent_form_onSubmit = async (values:z.infer<typeof student_parent_create_Schema>) => {
        console.log("-- student_register_parent 輸入 -- : ",values,"-- End --")

        startTransition(() => {
            createStudentParentData(values)
        })

    }

    return(
        <>
            <Form {...student_register_parent_form}>
                <form 
                    onSubmit={student_register_parent_form.handleSubmit(student_register_parent_form_onSubmit)}
                    className="space-y-4"
                >

                    <div className="space-y-4">
                    <FormField
                    control={student_register_parent_form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> 姓名 </FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    disabled={isPending}
                                    placeholder="輸入姓名"
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
                    control={student_register_parent_form.control}
                    name="school"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> 學校 </FormLabel>
                            <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="請選擇學校" />
                                    <SelectContent>
                                        {getSchoolsData.map((school:any ,index)=>(
                                            <SelectItem key={index} value={school.school_name}>{school.school_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </SelectTrigger>
                            </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    </div>

                    <div className="space-y-4">
                    <FormField
                    control={student_register_parent_form.control}
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

                    <Button type="submit" disabled={isPending}>
                        {isPending ? "loading..." : "新增學生"}
                    </Button>

                </form>
            </Form>
        </>
    )


}

export default Student_Create_Parent_Form