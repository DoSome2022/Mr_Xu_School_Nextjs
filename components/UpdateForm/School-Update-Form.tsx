"use client"


import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
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

import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";
import { School_Update_Schema } from "@/actions/Update-School/schema";
import { useParams } from 'next/navigation';
import { update_School_action } from "@/actions/Update-School";

const School_Update_Form = () =>{


    const params = useParams<{schooldetailbyID : string}>();//plz use console.log check params name
    const SchoolId = params?.schooldetailbyID as string;

    const [isPending , startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");

        // 為了拿school data by id
        const [GetSchoolDataById, setGetSchoolDataById] = useState([]);


            // 拿school data by id
            useEffect(() =>{
                if(SchoolId) {
                    const fetchSchoolDetail = async (id: string) => {
                        try {
                        const res = await fetch(`/api/School_detail_data_by_id/${id}`);
                        if(!res.ok) {
                            throw new Error("斷線！");
                        }
                        const result = await res.json();
                        
    
                        setGetSchoolDataById(result);                    
                        } catch (error) {
                            console.error(error);
                        }
                    };
                    fetchSchoolDetail(SchoolId);
                }
            },[SchoolId] )
    
console.log(GetSchoolDataById)

        

    const [ SchoolName , setSchoolName ] = useState('');
    useEffect(()=>{
        if(GetSchoolDataById && GetSchoolDataById[0] && GetSchoolDataById[0].school_name){
         setSchoolName(GetSchoolDataById[0].school_name);
         school_update_form.setValue("school_name", GetSchoolDataById[0].school_name)
        }
     },[GetSchoolDataById ])
    
    const school_update_form = useForm<z.infer<typeof School_Update_Schema>>({
        resolver:zodResolver(School_Update_Schema),
        defaultValues:{
            school_name: SchoolName,
            school_id: SchoolId,
            chine_date: "",
            eng_date:"",
            math_date: "",
        }
    })


    const school_update_form_onSubmit = (values:z.infer<typeof School_Update_Schema>)=>{
        console.log("-- school register輸入 -- : ",values,"-- End --");
        setError("");
        setSuccess("");

        startTransition(() => {
            update_School_action(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })

    }



    return(
        <>
        {GetSchoolDataById.map((d)=>{
    return(
        <>
        <Form {...school_update_form} >
                <form 
                    onSubmit={school_update_form.handleSubmit(school_update_form_onSubmit)}
                    className="space-y-6"
                >

                <div className="space-y-4">
                    <FormField
                    control={school_update_form.control}
                    name="school_id"
                    render={({ field }) => (
                        <FormItem>

                            <FormControl>
                                <Input 
                                    {...field}
                                    value={SchoolId}
                                    placeholder="輸入學校"
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
                    control={school_update_form.control}
                    name="school_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> 學校 </FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    disabled={isPending}
                                    placeholder={d.school_name}
                                    defaultValue={d.school_name}
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
                    control={school_update_form.control}
                    name="school_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> 中文考試時間 </FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    disabled={isPending}
                                    placeholder={d.school_name}
                                    defaultValue={d.school_name}
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
                    control={school_update_form.control}
                    name="school_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> 英文考試時間 </FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    disabled={isPending}
                                    placeholder={d.school_name}
                                    defaultValue={d.school_name}
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
                    control={school_update_form.control}
                    name="school_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> 學校 </FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    disabled={isPending}
                                    placeholder={d.school_name}
                                    defaultValue={d.school_name}
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
                        修改
                    </Button>

                </form>

            </Form>
        </>
    )
})}
             
        </>
   )
}
     
export default School_Update_Form