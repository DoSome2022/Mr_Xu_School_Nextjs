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


import { Comment_Create_Schema } from "@/actions/Create-Comment/schema";


const Comment_Create_Form = () => {

    const [isPending , startTransition] = useTransition();

    const comment_create_form = useForm<z.infer<typeof Comment_Create_Schema>>({
        resolver: zodResolver(Comment_Create_Schema),
        defaultValues:{
            content: "",
            author: "",
            student_id: "",
        }
    })

    const comment_create_form_onSubmit = (values : z.infer<typeof Comment_Create_Schema>) => {
        console.log("-- create comments -- : ", values ,"-- End --")
    }


    return(
        <>
            <Form {...comment_create_form}>
                <form
                    onSubmit={comment_create_form.handleSubmit(comment_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={comment_create_form.control}
                    name="content"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 內容 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="內容"
                type="text"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={comment_create_form.control}
                    name="author"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 作者 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="作者"
                type="text"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 



                
                <Button disabled={isPending} type="submit">
                    建立
                </Button>

                </form>
            </Form>
            
        </>
    )
}

export default Comment_Create_Form