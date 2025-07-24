"use client";


import * as z from "zod";
import { useState ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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



import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";
import { createNews_action } from "@/actions/Create-New";
import { SupNews_Create_Schema } from "@/actions/supadmin/Create-New/schema";
import { useParams } from "next/navigation";
import { SupcreateNews_action } from "@/actions/supadmin/Create-New";

const New_Create_Form_bysupadmin = () => {
          const param = useParams();
        console.log("param :",  param ,"--end --"  )
        const supadminid = param?.supadminid as string;
        console.log("supadminid :", supadminid);
    const [isPending , startTransition] = useTransition();

    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");


    const new_create_form = useForm<z.infer<typeof SupNews_Create_Schema>>({
        resolver: zodResolver(SupNews_Create_Schema),
        defaultValues:{
            supadminid:supadminid,
            title: "",
            content: "",
            date: "",
        }
    })

    const new_create_form_onSubmit = (values : z.infer<typeof SupNews_Create_Schema>) => {
        console.log("--  create news -- : ", values ,"-- End --");
        setError("");
        setSuccess("");

        startTransition(() => {
            SupcreateNews_action(values)
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

export default New_Create_Form_bysupadmin