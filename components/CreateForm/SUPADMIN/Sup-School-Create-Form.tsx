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
import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";
import { createSchool_action } from "@/actions/Create-School";
import { SupSchool_Create_Schema } from "@/actions/supadmin/Create-School/schema";

const School_Create_Form_bysupadmin = () => {

                const param = useParams();
            console.log("param :",  param ,"--end --"  )
            const supadminid = param?.supadminid as string;
            console.log("supadminid :", supadminid);
    const [isPending , startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");


    const school_register_form = useForm<z.infer<typeof SupSchool_Create_Schema>>({
        resolver:zodResolver(SupSchool_Create_Schema),
        defaultValues:{
            supadminid: supadminid,
            school_name: "",
        }
    })

const school_register_form_onSubmit = (values: z.infer<typeof SupSchool_Create_Schema>) => {
  console.log("-- school register輸入 -- : ", values, "-- End --");
  setError("");
  setSuccess("");
  startTransition(() => {
    createSchool_action(values).then((data) => {
      setError(data?.error);
      setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "學校創建成功" : undefined);
    });
  });
};
    
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

<FormError message={error} />
    <FormSuccess
      message={typeof success === "string" ? success : success ? "學校創建成功" : undefined}
    />
                    <Button disabled={isPending} type="submit" >
                        建立
                    </Button>

                </form>

            </Form>

        </>
    )
}

export default School_Create_Form_bysupadmin