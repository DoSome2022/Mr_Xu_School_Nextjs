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
import { Parent_Register_Schema } from "@/schemas";
import { parent_register_action } from "@/actions/register";


const CreateParent = () => {

    const [isPending , startTransition] = useTransition();

    const parent_register_form = useForm<z.infer<typeof Parent_Register_Schema>>({
        resolver: zodResolver(Parent_Register_Schema),
        defaultValues:{
            username: "",
            nickname: "",
            email: "",
            phone: "",
            password: "",
        }
    })

    const parent_register_form_onSubmit = (values:z.infer<typeof Parent_Register_Schema>) =>{
        console.log("-- 普通用戶register輸入 -- : ",values,"-- End --")
        startTransition(() => {
            parent_register_action(values)
        } )
    }

    return(
        <>
        <p>
            建立家長用戶
        </p>

        <Form {...parent_register_form} >

        <form 
            onSubmit={parent_register_form.handleSubmit(parent_register_form_onSubmit)}
        className="space-y-6">

            <div className="space-y-4">
                <FormField
                    control={parent_register_form.control}
                    name="username"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> username </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入username"
                            type="text"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>
            <div className="space-y-4">
                <FormField
                    control={parent_register_form.control}
                    name="nickname"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> nickname </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入nickname"
                            type="text"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>
            <div className="space-y-4">
                <FormField
                    control={parent_register_form.control}
                    name="email"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> email </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入email"
                            type="text"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>
            <div className="space-y-4">
                <FormField
                    control={parent_register_form.control}
                    name="phone"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> phone </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入phone"
                            type="number"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>
            <div className="space-y-4">
                <FormField
                    control={parent_register_form.control}
                    name="password"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> password </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入password"
                            type="text"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>

            <Button disabled={isPending} type="submit" >

                    Create
                    </Button>

        </form>

        </Form>


        </>
    )
}

export default CreateParent