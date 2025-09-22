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
import { Teacher_time_work_Create_Schema } from "@/actions/Create-TeacherTimeWork/schema";

const TeacherTimeWork_Create_Form = () => {

    const [isPending , startTransition] = useTransition();

    const teacher_time_work_create_form = useForm<z.infer<typeof Teacher_time_work_Create_Schema>>({
        resolver: zodResolver(Teacher_time_work_Create_Schema),
        defaultValues:{
            P_HR : 0,
            JHS_HR : 0,
            HS_HR: 0,
            P_number: 0,
            JHS_number: 0,
            HS_number: 0,
        }
    })

    const teacher_time_work_create_form_onSubmit = (values : z.infer<typeof Teacher_time_work_Create_Schema>) =>{
        console.log("--  create teacher_time_work -- : ", values ,"-- End --")
    }


    return(
        <>
            <Form {...teacher_time_work_create_form}>
                <form
                    onSubmit={teacher_time_work_create_form.handleSubmit(teacher_time_work_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={teacher_time_work_create_form.control}
                    name="P_HR"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 小學時數 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="小學時數"
                type="number"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={teacher_time_work_create_form.control}
                    name="JHS_HR"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 初中時數 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="初中時數"
                type="number"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 


                <div className="space-y-4">
                <FormField
                    control={teacher_time_work_create_form.control}
                    name="HS_HR"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 高中時數 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="高中時數"
                type="number"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={teacher_time_work_create_form.control}
                    name="P_number"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 小學人數 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="小學人數"
                type="number"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={teacher_time_work_create_form.control}
                    name="JHS_number"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 初中人數 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="初中人數"
                type="number"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 


                <div className="space-y-4">
                <FormField
                    control={teacher_time_work_create_form.control}
                    name="HS_number"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 高中人數 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="高中人數"
                type="number"
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

export default TeacherTimeWork_Create_Form