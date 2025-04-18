"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
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
    FormMessage,
} from "@/components/ui/form";

import DatePicker from "react-multi-date-picker";

import { public_holiday_edit_Schema } from "@/actions/Update-PublicHoliday/schema";
import { editPublic_holiday } from "@/actions/Update-PublicHoliday";

const Public_Holidays_Edit_Form = ({ PublicHolidays }: any) => {
    const [isPending, startTransition] = useTransition();
 console.log('PublicHolidays : ', PublicHolidays, "--end--");

    // 將 PublicHolidays.publicholiday 轉換為 Date 物件的陣列
    const initialDates = PublicHolidays[0]?.publicholiday.map((date: string) => new Date(date));

    // 初始化表單
    const publicholidays_edit_form = useForm<z.infer<typeof public_holiday_edit_Schema>>({
        resolver: zodResolver(public_holiday_edit_Schema),
        defaultValues: {
            id: PublicHolidays[0]?.id,
             publicholiday: initialDates, // 直接傳入日期陣列
        },
    });

    

    useEffect(()=>{
        publicholidays_edit_form.setValue('publicholiday', initialDates);
        publicholidays_edit_form.setValue('id', PublicHolidays[0]?.id);
    },[PublicHolidays])


    // 提交表單
    const publicholidays_edit_form_onSubmit = (values: z.infer<typeof public_holiday_edit_Schema>) => {
        console.log("--  edit publicholidays -- : ", values, "-- End --");

        startTransition(() => {
            editPublic_holiday(values);
        });
    };

    console.log("bug : ", publicholidays_edit_form, "-- End --");

    return (
        <>
            <Form {...publicholidays_edit_form}>
                <form
                    onSubmit={publicholidays_edit_form.handleSubmit(publicholidays_edit_form_onSubmit)}
                    className="space-y-4"
                >
                    <div className="space-y-4">
                        <FormField
                            control={publicholidays_edit_form.control}
                            name="publicholiday"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>修改公眾假期</FormLabel>
                                    <FormControl>
                                    <DatePicker
                                            multiple // 啟用多選
                                            value={
                                                field.value || 
                                                
                                                []} // 使用轉換後的 Date 物件陣列
                                            onChange={(dates: any) => {
                                                // 將選擇的日期轉換為 ISO 字串
                                                const formattedDates = dates?.map((date: any) =>
                                                    new Date(date).toISOString()
                                                ) || [];
                                                field.onChange(formattedDates); // 更新表單的值
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
                            <br />
                    {/* {PublicHolidays?.map((d:any)=>{
                        return(
                            <>
              {d.publicholiday.map((holiday: string, index: number) => (
                <span key={index}>{formatDateString(holiday)}{index < d.publicholiday.length - 1 ? ", " : ""}</span>
              ))}
                            </>
                        )
                    })} */}

                </form>
            </Form>
        </>
    );
};

export default Public_Holidays_Edit_Form;