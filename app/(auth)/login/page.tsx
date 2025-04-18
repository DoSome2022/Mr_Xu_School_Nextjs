"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
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
} from "@/components/ui/form";
import { useSearchParams } from "next/navigation";
import { Login_Schema } from "@/schemas"; 
import { User_login_action } from "@/actions/user-login ";
import { Checkbox } from "@/components/ui/checkbox";

const userlogin = () => {

    const searchParams = useSearchParams();
    const [ isPending, startTransition ] = useTransition(); 

    const stafflogin_form = useForm<z.infer<typeof Login_Schema>>({
        resolver: zodResolver(Login_Schema),
        defaultValues:{
            username: "",
            password: "",
        }
    })

    const login_form_onSubmit = (values:z.infer<typeof Login_Schema>) => {
        console.log("-- 用家輸入 -- : ",values,"-- End --")

        startTransition(() => {
            User_login_action(values)
        })

    }

    return (
        <>
            登入頁面
            <Form {...stafflogin_form} >

                <form 
                    onSubmit={stafflogin_form.handleSubmit(login_form_onSubmit)}
                className="space-y-6">
                    <div className="space-y-4">
                        <FormField 
                            control={stafflogin_form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> username </FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder=" 輸入username "
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
                            control={stafflogin_form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> password </FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder=" 輸入password "
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}  
                        />
                    </div>

                            <Button disabled={isPending} type="submit">
                                登入
                            </Button>

                </form>
            
                </Form>
        </>
    )
}

export default userlogin