
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

import { Teacher_Create_Schema } from "@/actions/Create-Teacher/schema";
import { createTeacher } from "@/actions/Create-Teacher";


const Teacher_Create_Form = () => {

    const [isPending , startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined >("");


    const teacher_register_form = useForm<z.infer<typeof Teacher_Create_Schema>>({
        resolver: zodResolver(Teacher_Create_Schema),
        defaultValues:{
            username: "",
            nickname: "",
            email: "",
            phone: "",
            role: "TEACHER",
            password: "",
            staff: true,
            isadmin: false,
        }
    })

    const teacher_register_form_onSubmit =  (values:z.infer<typeof Teacher_Create_Schema>) =>{
        console.log("-- teacher register輸入 -- : ",values,"-- End --")
        startTransition( async () => {
          const result = await createTeacher(values);
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
            建立老師用戶
        </p>
        <br />
        {error && <p className="error-message" >{error}</p>}
<br />
        <Form {...teacher_register_form} >

<form 
    onSubmit={teacher_register_form.handleSubmit(teacher_register_form_onSubmit)}
className="space-y-6">

    <div className="space-y-4">
        <FormField
            control={teacher_register_form.control}
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
            <FormMessage />
        </FormItem>
            )}
        />
    </div>
    <div className="space-y-4">
        <FormField
            control={teacher_register_form.control}
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
            <FormMessage />
        </FormItem>
            )}
        />
    </div>
    <div className="space-y-4">
        <FormField
            control={teacher_register_form.control}
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
            <FormMessage />
        </FormItem>
            )}
        />
    </div>
    <div className="space-y-4">
        <FormField
            control={teacher_register_form.control}
            name="phone"
            render={({ field }) => (
        <FormItem>
            <FormLabel> 電話 </FormLabel>
            <FormControl>
                <Input 
                    {...field}
                    disabled={isPending}
                    placeholder="輸入電話 "
                    type="number"
                    />
            </FormControl>
            <FormMessage />
        </FormItem>
            )}
        />
    </div>
    <div className="space-y-4">
        <FormField
            control={teacher_register_form.control}
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
            <FormMessage />
        </FormItem>
            )}
        />
    </div>


    <div className="space-y-4"
                        hidden
                    >
                        <FormField 
                            control={teacher_register_form.control}
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
                            control={teacher_register_form.control}
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

export default Teacher_Create_Form