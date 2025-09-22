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
import { Message_Create_Schema } from "@/actions/Create-Message/schema";


const Message_Create_Form = () => {

    const [isPending , startTransition] = useTransition();

    const message_create_form = useForm<z.infer<typeof Message_Create_Schema>>({
        resolver : zodResolver(Message_Create_Schema),
        defaultValues:{
            message_content : "",
            receiver : "",
            sender : ""
        }
    })

    const message_create_form_onSubmit = (values : z.infer<typeof Message_Create_Schema>) => {
        console.log("-- create message -- : ", values ,"--  End  --")
    }

    return(
        <>
            <Form {...message_create_form}>
                <form
                    onSubmit={message_create_form.handleSubmit(message_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={message_create_form.control}
                    name="message_content"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 訊息內容 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="訊息內容"
                type="text"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={message_create_form.control}
                    name="receiver"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 接收者 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="接收者"
                type="text"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 


                <div className="space-y-4">
                <FormField
                    control={message_create_form.control}
                    name="sender"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 寄件者 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="寄件者"
                type="text"
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

export default Message_Create_Form