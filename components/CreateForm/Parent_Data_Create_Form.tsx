
"use client"


import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams } from "next/navigation";

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
import { Parent_Data_Create_Schema } from "@/actions/Create-ParentData/schema";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { create_Parent_Data } from "@/actions/Create-ParentData";

interface ParentDataCreateFormProps{
    ParentId:
    {parentdetailbyID:string}
}



const Parent_Data_create_Form = ({ParentId}: ParentDataCreateFormProps ) =>{

    const [isPending , startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");
    const params = useParams();
    const parentId = params?.parentdetailbyID as string;

    const parent_data_register_form = useForm<z.infer<typeof Parent_Data_Create_Schema>>({
        resolver: zodResolver(Parent_Data_Create_Schema),
        defaultValues:{
            parent_user_id:parentId,
            parent_message_id:"",
            parent_price_record_id:"", 
            done: true
        }
    })

    const parent_data_register_form_onSubmit = (values: z.infer<typeof Parent_Data_Create_Schema>) => {
        console.log("-- parent data register輸入 -- : ",values,"-- End --")
        setError("");
        setSuccess("");

        parent_data_register_form.setValue('done', true);

        startTransition(() => {
            create_Parent_Data(values)
           .then((data) => {
               setError(data?.error);
               setSuccess(data?.success);
           })
       } )

    }


    return(
        <>
        <Form {...parent_data_register_form}>
            <form onSubmit={parent_data_register_form.handleSubmit(parent_data_register_form_onSubmit)}
            className="space-y-6"
            >
    <div className="space-y-4">
        <FormField
            control={parent_data_register_form.control}
            name="parent_user_id"
            render={({ field }) => (
        <FormItem>

            <FormControl>
                <Input 
                    {...field}
                    hidden
                    disabled
                    value={parentId}
                    placeholder="parent_user_id"
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
            control={parent_data_register_form.control}
            name="parent_message_id"
            render={({ field }) => (
        <FormItem>

            <FormControl>
                <Input 
                    {...field}
                    hidden
                    disabled
                    value={""}
                    placeholder="parent_message_id"
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
            control={parent_data_register_form.control}
            name="parent_price_record_id"
            render={({ field }) => (
        <FormItem>

            <FormControl>
                <Input 
                    {...field}
                    hidden
                    disabled
                    value={""}
                    placeholder="parent_price_record_id"
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

export default Parent_Data_create_Form