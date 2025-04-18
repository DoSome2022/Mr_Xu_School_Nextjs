"use client"
import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
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
import { AddClass_Create_Schema } from "@/actions/Create-AddClass/schema";

const Create_Class_Custom_Form = () => {
    const param = useParams();
    const [isPending , startTransition] = useTransition();

    const class_create_form = useForm<z.infer<typeof AddClass_Create_Schema>>({
        resolver: zodResolver(AddClass_Create_Schema),
        defaultValues: {
            class_course_id: "",
            title: "",
            class_start_time: "",
            class_end_time: "",
            class_time_h: 0,
            classroom: "",
            class_lesson: "",
            persons: 0,
            node: 0,
            teacher: "",
            grade: 0,
            day:"",
        }
    })

    const class_create_form_onSubmit = (values: z.infer<typeof AddClass_Create_Schema>) => {
        console.log("-- create class輸入 -- : ",values,"-- End --")
    }

    return (
        <>
            <span> Create_Class_Custom_Form </span>

            

        </>
    )
}

export default Create_Class_Custom_Form