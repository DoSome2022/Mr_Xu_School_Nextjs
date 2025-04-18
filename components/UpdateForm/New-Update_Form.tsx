"use client";


import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input"; 
import { useParams } from 'next/navigation';
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
import { News_Update_Schema } from "@/actions/Update-New/schema";
import { update_News_action } from "@/actions/Update-New";


const New_Update_Form = () => {

    const params = useParams<{newsdetailbyID: string}>();
    const NewID = params?.newsdetailbyID as string;

    const [isPending , startTransition] = useTransition();
    const [ GetNewDateById , setGetNewDateById ] = useState([]);
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");

    useEffect(()=>{
        if(NewID) {
            const fetchnewdetailbyid = async (id: string) => {
                try {
                    const res = await fetch(`/api/News_detail_data_by_id/${id}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetNewDateById(result);                    
                    } catch (error) {
                        console.error(error);
                    }
            };
            fetchnewdetailbyid(NewID)
        }

    },[NewID])

    console.log(GetNewDateById)

    const [ GetTitle , setGetTitle ] = useState('');
    const [ GetContent , setGetContent] = useState('');
    const [ GetDate , setGetDate ] = useState('');


    const new_update_form = useForm<z.infer<typeof News_Update_Schema>>({
        resolver: zodResolver(News_Update_Schema),
        defaultValues:{
            NewId: NewID,
            title: GetTitle,
            content: GetContent,
            date: GetDate,
        }
    })

    useEffect(()=>{
        if(GetNewDateById && GetNewDateById[0] && GetNewDateById[0].title){
            setGetTitle(GetNewDateById[0].title);
            new_update_form.setValue("title", GetNewDateById[0].title);
        }
        if(GetNewDateById && GetNewDateById[0] && GetNewDateById[0].content){
            setGetContent(GetNewDateById[0].content);
            new_update_form.setValue("content", GetNewDateById[0].content);
        }
        if(GetNewDateById && GetNewDateById[0] && GetNewDateById[0].date){
            setGetDate(GetNewDateById[0].date);
            new_update_form.setValue("date", GetNewDateById[0].date);
        }

    },[GetNewDateById])

    const new_update_form_onSubmit = (values : z.infer<typeof News_Update_Schema>) => {
        console.log("--  create news -- : ", values ,"-- End --");
        setError("");
        setSuccess("");

        startTransition( async() => {
            const result = await update_News_action(values)
            if (result.error) {
                setError(result.error);
              } else {
                setError("")
              }
        })

    }

    return(
        <>
<Form {...new_update_form}>
                <form
                    onSubmit={new_update_form.handleSubmit(new_update_form_onSubmit)}
                    className="space-y-6"
                >

{GetNewDateById.map((d)=>{
    return(
        <>
         <div className="space-y-4"
            hidden
         >
                <FormField
                    control={new_update_form.control}
                    name="NewId"
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input 
                            {...field}
                            value={NewID}
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
                    control={new_update_form.control}
                    name="title"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 標題 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder={d.title}
                type="text"
                defaultValue={d.title}
                />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={new_update_form.control}
                    name="content"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 內容 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder={d.content}
                defaultValue={d.content}
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
                    control={new_update_form.control}
                    name="date"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 日期 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder={d.date}
                defaultValue={d.date}
                type="text"
                />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 
        </>
    )
})}
           

                <FormError message={error }/>
                <FormSuccess message={success} />
                <Button disabled={isPending} type="submit">
                    建立
                </Button>

                </form>
            </Form>
        </>
    )
}

export default New_Update_Form