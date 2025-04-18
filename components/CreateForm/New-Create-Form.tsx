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


import { News_Create_Schema } from "@/actions/Create-New/schema";
import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";
import { createNews_action } from "@/actions/Create-New";

const New_Create_Form = () => {
    const [isPending , startTransition] = useTransition();

    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");


    const new_create_form = useForm<z.infer<typeof News_Create_Schema>>({
        resolver: zodResolver(News_Create_Schema),
        defaultValues:{
            title: "",
            content: "",
            date: "",
        }
    })

    const new_create_form_onSubmit = (values : z.infer<typeof News_Create_Schema>) => {
        console.log("--  create news -- : ", values ,"-- End --");
        setError("");
        setSuccess("");

        startTransition(() => {
            createNews_action(values)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success);   
            })
        })

    }


    return(
        <>
            <Form {...new_create_form}>
                <form
                    onSubmit={new_create_form.handleSubmit(new_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={new_create_form.control}
                    name="title"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 標題 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="標題"
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
                    control={new_create_form.control}
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
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 


                <div className="space-y-4">
                <FormField
                    control={new_create_form.control}
                    name="date"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 日期 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="日期"
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
                <Button disabled={isPending} type="submit">
                    建立
                </Button>

                </form>
            </Form>
        </>
    )
}

export default New_Create_Form