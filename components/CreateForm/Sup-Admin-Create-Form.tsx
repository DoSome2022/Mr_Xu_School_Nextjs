
"use client"


import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

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
 } from "@/components/ui/form"
import { createAdmin } from "@/actions/Create-Admin";
import { Admin_Create_Schema } from "@/actions/Create-Admin/schema";


const Admin_Create_Form = () => {

    const [isPending , startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined >("");

    const admin_register_form = useForm<z.infer<typeof Admin_Create_Schema>>({
        resolver: zodResolver(Admin_Create_Schema),
        defaultValues:{
            username: "",
            nickname: "",
            password: "",
            cram:"",
            email: "",
            phone: "",
            role: "SUPADMIN",
            staff: true,
            isadmin: true,
        }
    })

    const admin_register_form_onSubmit = (values:z.infer<typeof Admin_Create_Schema>) =>{
        console.log("-- admin register輸入 -- : ",values,"-- End --")
        startTransition( async () => {
          const result = await createAdmin(values);
          if (result.error) {
            setError(result.error);
          } else {
            setError("")
          }
        } )
    }


    return(
        <>
        <p>
            建立ADMIN
        </p>
        {error && <p className="error-message" >{error}</p>}
        <br />
        <br />
        <Form {...admin_register_form} >

        <form 
            onSubmit={admin_register_form.handleSubmit(admin_register_form_onSubmit)}
        className="space-y-6">

            <div className="space-y-4">
                <FormField
                    control={admin_register_form.control}
                    name="username"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 用戶名稱 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入用戶名稱"
                            type="text"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>
            <div className="space-y-4">
                <FormField
                    control={admin_register_form.control}
                    name="nickname"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 暱稱 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入暱稱"
                            type="text"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>
            <div className="space-y-4">
                <FormField
                    control={admin_register_form.control}
                    name="email"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 電郵 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入電郵"
                            type="text"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>
            <div className="space-y-4">
                <FormField
                    control={admin_register_form.control}
                    name="phone"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 電話 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入電話"
                            type="number"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>

            <div className="space-y-4">
                <FormField
                    control={admin_register_form.control}
                    name="cram"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 分校 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入用戶名稱"
                            type="text"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>

            <div className="space-y-4">
                <FormField
                    control={admin_register_form.control}
                    name="password"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 密碼 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder="輸入密碼"
                            type="text"
                            />
                    </FormControl>
                </FormItem>
                    )}
                />
            </div>
            <div className="space-y-4"
                        hidden
                    >
                        <FormField 
                            control={admin_register_form.control}
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

                    <div className="space-y-4"
                        hidden
                    >
                        <FormField 
                            control={admin_register_form.control}
                            name="isadmin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> 是否ADMIN </FormLabel>
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
            <Button disabled={isPending} type="submit" >

                    建立
                    </Button>

        </form>

        </Form>


        </>
    )
}

export default Admin_Create_Form