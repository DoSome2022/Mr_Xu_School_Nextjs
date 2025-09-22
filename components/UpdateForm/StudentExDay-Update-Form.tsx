"use client";


import * as z from "zod";
import { startTransition, useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import DatePicker from "react-multi-date-picker";
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
import { Student_ExDay_Update_Schema } from "@/actions/Update-Student-ExDay/schema";
import { Student_ExDay_Update_Action } from "@/actions/Update-Student-ExDay";

 const StudentExDay_Udate_Form = () => {
    const param = useParams();
    console.log("param :",  param);
    const parentId = param?.parentId as string;
    const studentId = param?.studentid as string;

    const studentexday_update_form = useForm({
        resolver: zodResolver(Student_ExDay_Update_Schema),
        defaultValues: {
            studentid: studentId,
            parentid: parentId,
            chine_ex: "",
            math_ex: "",
            eng_ex: "",
        }
    })

    const studentexday_update_form_onSubmit = (values:z.infer<typeof Student_ExDay_Update_Schema>)=>{
            console.log("-- Student_ExDay_Update輸入 -- : ",values,"-- End --");

            startTransition(()=>{
                Student_ExDay_Update_Action(values)
                
            })

        }


    return(
        <>
        <Form {...studentexday_update_form}>

            <form onSubmit={studentexday_update_form.handleSubmit(studentexday_update_form_onSubmit)}
            className="space-y-8">
          <FormField 
                control={studentexday_update_form.control}
                name="chine_ex"
                render={({ field }) =>(
                    <FormItem>
                        <FormLabel>中文考試時間</FormLabel>
                        <FormControl>
                            <DatePicker
                                value={field.value ? new Date(field.value) : null}
                                format="YYYY-MM-DD"
                                onChange={(date) => {
                                    const isoDate = date ? date.format("YYYY-MM-DD") : "";
                                    field.onChange(isoDate);
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}            
            />

<FormField 
                control={studentexday_update_form.control}
                name="eng_ex"
                render={({ field }) =>(
                    <FormItem>
                        <FormLabel>英文考試時間</FormLabel>
                        <FormControl>
                            <DatePicker
                                value={field.value ? new Date(field.value) : null}
                                format="YYYY-MM-DD"
                                onChange={(date) => {
                                    const isoDate = date ? date.format("YYYY-MM-DD") : "";
                                    field.onChange(isoDate);
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}            
            />

<FormField 
                control={studentexday_update_form.control}
                name="math_ex"
                render={({ field }) =>(
                    <FormItem>
                        <FormLabel>數學考試時間</FormLabel>
                        <FormControl>
                            <DatePicker
                                value={field.value ? new Date(field.value) : null}
                                format="YYYY-MM-DD"
                                onChange={(date) => {
                                    const isoDate = date ? date.format("YYYY-MM-DD") : "";
                                    field.onChange(isoDate);
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}            
            />

                        <Button type="submit">更新</Button>
            </form>

        </Form>
        </>
    )
 }

export default StudentExDay_Udate_Form;