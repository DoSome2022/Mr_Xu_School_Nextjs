"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage 
} from "@/components/ui/form";
import { staffUser_Login_Schema } from "@/schemas"; 
import { useSearchParams } from "next/navigation";
import { StaffUser_login_action } from "@/actions/staffuser-login";
import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";



const Staff_User_login = () => {
    
    const searchParams = useSearchParams();
    const [ isPending, startTransition ] = useTransition(); 

    const urlError = searchParams.get("error") === "AccountNotLinked" ? "username already in use with different provider!" : "";

    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");

    const login_form = useForm<z.infer<typeof staffUser_Login_Schema>>({
        resolver: zodResolver(staffUser_Login_Schema),
        defaultValues:{
            username: "",
            password: "",
            staff: false,
            isadmin: false,
        }
    })

    const login_form_onSubmit = (values:z.infer<typeof staffUser_Login_Schema>) => {
        console.log("-- 職員用戶輸入 -- : ",values,"-- End --")
            setError("");
            setSuccess("");

        startTransition(() => {

            StaffUser_login_action(values)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        } )
    }

    return(
        <>
            職員登入頁面

            <Form {...login_form} >

                <form 
                    onSubmit={login_form.handleSubmit(login_form_onSubmit)}
                 className="space-y-6">
                    <div className="space-y-4">
                        <FormField 
                            control={login_form.control}
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
                            control={login_form.control}
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

                    <div className="space-y-4">
                        <FormField 
                            control={login_form.control}
                            name="staff"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> 職員 </FormLabel>
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}  
                        />
                    </div>
                    <div className="space-y-4">
                        <FormField 
                            control={login_form.control}
                            name="isadmin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Admin </FormLabel>
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}  
                        />
                    </div>

                    

            <FormError message={error || urlError}/>
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit">
                登入
            </Button>

                </form>


            </Form>


        </>
    )
}

export default Staff_User_login