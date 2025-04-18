"use client";

import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input"; 

import { Button } from "@/components/ui/button";

import { Checkbox } from "@radix-ui/react-checkbox";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Price_Record_Create_Schema } from "@/actions/Create-Price-record/schema";


const PriceRecord_Create_Form = () => {

    const [isPending , startTransition] = useTransition();

    const pricerecord_create_form = useForm<z.infer<typeof Price_Record_Create_Schema>>({
        resolver : zodResolver(Price_Record_Create_Schema),
        defaultValues:{
            price: 0,
            parent_name:""
        }
    })

    const pricerecord_create_form_onSubmit = ( values : z.infer<typeof Price_Record_Create_Schema> ) => {
        console.log("-- create pricerecord -- : ", values ,"-- End --")
    }

    return(
        <>
            <Form {...pricerecord_create_form}>
                <form
                    onSubmit={pricerecord_create_form.handleSubmit(pricerecord_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={pricerecord_create_form.control}
                    name="parent_name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 用戶名稱 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled
                placeholder="用戶名稱"
                type="text"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={pricerecord_create_form.control}
                    name="price"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 價錢 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="價錢"
                type="number"
                />
                    </FormControl>
                </FormItem>
                    )}
                />
                </div> 

                
                <button disabled={isPending} type="submit">
                    建立
                </button>

                </form>
            </Form>
        </>
    )
}

export default PriceRecord_Create_Form