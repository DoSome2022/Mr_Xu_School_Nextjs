
"use client"


import * as z from "zod";
import { useState, useTransition } from "react";
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
import { Teacher_Data_Create_Schema } from "@/actions/Create-TeacherData/schema";
import { SWR_School_Subject_checkbox } from "../fatchdata/swrschool_subject_checkbox";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { create_Teacher_Data } from "@/actions/Create-TeacherData";


interface TeacherDataCreateFormProps{
    TeacherId:
    {teacherdetailbyID:string}
}


const Teacher_Data_Create_Form = ({TeacherId} : TeacherDataCreateFormProps) => {


    const searchParams = useSearchParams();
    const [isPending , startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");



    const teacher_data_register_form = useForm<z.infer<typeof Teacher_Data_Create_Schema>>({
        resolver: zodResolver(Teacher_Data_Create_Schema),
        defaultValues:{
            subject: [],
            cram: "",
            teacher_time_work_id: "",
            teacher_node_id: "",
            teacher_upload_node_id: "",
            teacher_user_id:TeacherId.teacherdetailbyID,
        }
    })

    const teacher_data_register_form_onSubmit = (values:z.infer<typeof Teacher_Data_Create_Schema>) =>{

         console.log("-- teacher data register輸入 -- : ",values,"-- End --")
        setError("");
        setSuccess("");

        startTransition(() => {
             create_Teacher_Data(values)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        } )
    }




    return(
        <>
        <p>
            建立老師數據用戶表單
        </p>

        

        <Form {...teacher_data_register_form} >

    <form 
        onSubmit={teacher_data_register_form.handleSubmit(teacher_data_register_form_onSubmit)}
        className="space-y-6"
        >

    <div className="space-y-4">

                <SWR_School_Subject_checkbox  teacher_data={teacher_data_register_form}  />
                <FormMessage />

    </div>
    <div className="space-y-4">
        <FormField
            control={teacher_data_register_form.control}
            name="cram"
            render={({ field }) => (
        <FormItem>
            <FormLabel> 分校 </FormLabel>
            <FormControl>
                <Input 
                    {...field}
                    disabled={isPending}
                    placeholder="分校"
                    type="text"
                    />
            </FormControl>
            <FormMessage />
        </FormItem>
            )}
        />
    </div>

    <div className="space-y-4" hidden>
        <FormField
            control={teacher_data_register_form.control}
            name="teacher_user_id"
            render={({ field }) => (
        <FormItem>

            <FormControl>
                <Input 
                    {...field}
                    hidden
                    disabled
                    value={TeacherId.teacherdetailbyID}
                    placeholder="teacher_user_id"
                    type="text"
                    />
            </FormControl>
            <FormMessage />
        </FormItem>
            )}
        />
    </div>


    <FormError message={error }/>
    <FormSuccess message={success} />
    <Button disabled={isPending} type="submit" >

        建立
    </Button>

</form>

</Form>

        </>
    )
}

export default Teacher_Data_Create_Form