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

import { Switch } from "@/components/ui/switch"
import { AttenDance_Create_Schema } from "@/actions/Create-AttenDance/schema";

const AttenDance_Create_Form_Button = () => {

    const [isPending , startTransition] = useTransition();

    const AddClass_create_form = useForm<z.infer<typeof AttenDance_Create_Schema >>({
        resolver : zodResolver(AttenDance_Create_Schema),
        defaultValues:{
            classroomId: "",
            studentId:"",
            isPresent:false,
            isLate:false,
            
        }
    })

    const  AddClass_create_form_onSubmit = (values : z.infer<typeof AttenDance_Create_Schema>) =>{
        console.log("--  create AddClass -- : ", values ,"-- End --")
    }


    return(
        <>
             <Form {...AddClass_create_form}>
                <form
                    onSubmit={AddClass_create_form.handleSubmit(AddClass_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={AddClass_create_form.control}
                    name="isPresent"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 出席 </FormLabel>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={AddClass_create_form.control}
                    name="isLate"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 遲到 </FormLabel>
                    <FormControl>
                    <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

               


                </form>
            </Form>
        </>
    )
}

export default AttenDance_Create_Form_Button