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
import { School_Create_Schema } from "@/actions/Create-School/schema";
import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";
import { createSchool_action } from "@/actions/Create-School";

const School_Create_Form = () => {

    const [isPending , startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");


    const school_register_form = useForm<z.infer<typeof School_Create_Schema>>({
        resolver:zodResolver(School_Create_Schema),
        defaultValues:{
            school_name: "",
        }
    })

    const school_register_form_onSubmit = (values:z.infer<typeof School_Create_Schema>)=>{
        console.log("-- school register輸入 -- : ",values,"-- End --");
        setError("");
        setSuccess("");

        startTransition(() => {
            createSchool_action(values)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success);                
            } )
        })

    }
    
    return(
        <>
            <Form {...school_register_form} >
                <form 
                    onSubmit={school_register_form.handleSubmit(school_register_form_onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                    <FormField
                    control={school_register_form.control}
                    name="school_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> 學校 </FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    disabled={isPending}
                                    placeholder="輸入學校"
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

export default School_Create_Form