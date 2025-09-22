
"use client"


import * as z from "zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams} from "next/navigation";

import { Input } from "@/components/ui/input"; 

import { Button } from "@/components/ui/button";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    
 } from "@/components/ui/form"

import { SupParent_Create_Schema } from "@/actions/supadmin/Create-Parent/schema";
import { SupcreateParent } from "@/actions/supadmin/Create-Parent";

 
const Parent_Create_Formbysupadmin = () => {
    const [isPending , startTransition] = useTransition();
                const param = useParams();
            console.log("param :",  param ,"--end --"  )
            const supadminid = param?.supadminid as string;
            console.log("supadminid :", supadminid);

    const parent_register_form = useForm<z.infer<typeof SupParent_Create_Schema>>({
        resolver: zodResolver(SupParent_Create_Schema),
        defaultValues:{
            supadminid: supadminid,
            username: "",
            nickname: "",
            email: "",
            phone: "",
            role: "PARENT",
            password: "",

        }
        
    })

    const parent_register_form_onSubmit = (values:z.infer<typeof SupParent_Create_Schema>) =>{
        console.log("-- 普通用戶register輸入 -- : ",values,"-- End --")
        startTransition(() => {
            SupcreateParent(values)
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
                    control={parent_register_form.control}
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
                    control={parent_register_form.control}
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
                    control={parent_register_form.control}
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
                    control={parent_register_form.control}
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
            

            <Button disabled={isPending} type="submit" >

            建立
            </Button>

        </form>

        </Form>


        </>
    )
}

export default Parent_Create_Formbysupadmin