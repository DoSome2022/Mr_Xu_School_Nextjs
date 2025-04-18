"use client";

import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
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
import { public_holiday_create_Schema } from "@/actions/Create-PublicHoliday/schema";
import DatePicker from "react-multi-date-picker";
import { createPublic_holiday } from "@/actions/Create-PublicHoliday";
import { SWR_Class_Time } from "../fatchdata/swrclass_tiime";


const Public_Holidays_Form = () => {
    const [ isPending , startTransition ] = useTransition();
    const publicholidays_create_form = useForm<z.infer<typeof public_holiday_create_Schema>>({
            resolver: zodResolver(public_holiday_create_Schema),
            defaultValues:{
                publicholiday : [],
            }
        })



        // 提交表單
    const publicholidays_create_form_onSubmit = (values : z.infer<typeof public_holiday_create_Schema>) => {
        console.log("--  create publicholidays -- : ", values ,"-- End --");

        startTransition(() => {
            createPublic_holiday(values);
        })
    }
console.log("bug : ",publicholidays_create_form,"-- End --" )

return (
    <>
        <Form {...publicholidays_create_form}>
            <form
                onSubmit={publicholidays_create_form.handleSubmit(publicholidays_create_form_onSubmit)}
                className="space-y-4"
            >
                <div className="space-y-4"> 
            <FormField 
                control={publicholidays_create_form.control}
                name="publicholiday"
                render={({ field }) =>(
                    <FormItem>
                        <FormLabel>選擇公眾假期</FormLabel>
                        <FormControl>
                        <DatePicker
                                    multiple // 啟用多選
                                    value={field.value?.map((date : any) => new Date(date)) || []}
                                    onChange={(dates:any) => {
                                        const formattedDates = dates?.map((date:any) => 
                                            new Date(date).toISOString()
                                        ) || [];
                                        field.onChange(formattedDates);
                                    }}
                                    format="YYYY-MM-dd"
                                />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}            
            />
</div>


                <Button type="submit" disabled={isPending}>
                    提交
                </Button>
            </form>
        </Form>
    </>
);

}

export default Public_Holidays_Form