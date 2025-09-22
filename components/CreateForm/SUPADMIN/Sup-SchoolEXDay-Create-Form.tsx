"use client";

import { School_Ex_Day_Schema } from "@/actions/Create-School_EX_Day/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input"; 
import DatePicker from "react-multi-date-picker";
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

import { createSchool_Ex_Day_data_action } from "@/actions/Create-School_EX_Day";
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
import { SupSchool_Ex_Day_Schema } from "@/actions/supadmin/Create-School_EX_Day/schema";
import { SupcreateSchool_Ex_Day_data_action } from "@/actions/supadmin/Create-School_EX_Day";
const SchoolEXDayCreateFormbysupadmin = () => {
    const param = useParams();
    // console.log("param : ", param ,"-- End --");
    const schoolId = param?.schooldetailbyID as string;
    const supadminid = param?.supadminid as string;
    console.log("supadminid :", supadminid);

    const [ isPending , startTransition ] = useTransition();

    const schoolexday_create_form = useForm<z.infer<typeof SupSchool_Ex_Day_Schema>>({
        resolver: zodResolver(SupSchool_Ex_Day_Schema),
        defaultValues:{
            supadminid:supadminid,
            school_ex_day_id:schoolId,
            subject:"",
            grade:0,
            year:"",
            quarter:0,
            EX_Day:"",
            title:"",
        }
    })

    const schoolexday_create_form_onSubmit = (values:z.infer<typeof SupSchool_Ex_Day_Schema>) =>{
        console.log("--  create school ex day -- : ", values ,"-- End --");

        startTransition(() => {
            SupcreateSchool_Ex_Day_data_action(values)
        })

    }

  return (
    <div>
      SchoolEXDayCreateForm
        <Form {...schoolexday_create_form}>
            <form
                onSubmit={schoolexday_create_form.handleSubmit(schoolexday_create_form_onSubmit)}
                className="space-y-6"
            >

                <div className="space-y-4">
                <FormField
                    control={schoolexday_create_form.control}
                    name="title"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 標題 </FormLabel>
                    <FormControl>
                    <Input 
                        {...field}
                        disabled={isPending}
                        placeholder="標題"
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
                    control={schoolexday_create_form.control}
                    name="subject"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 科目 </FormLabel>
                    <FormControl>
                        <SWR_School_Subject  field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={schoolexday_create_form.control}
                    name="grade"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年級 </FormLabel>
                    <FormControl>
                        <SWR_School_Grade field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={schoolexday_create_form.control}
                    name="year"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年度 </FormLabel>
                    <FormControl>
                        <SWR_School_Year field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 


                <div className="space-y-4">
                <FormField
                    control={schoolexday_create_form.control}
                    name="quarter"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 季度 </FormLabel>
                    <FormControl>
                        <SWR_School_Quarter field={field} /> 
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
    <FormField
        control={schoolexday_create_form.control}
        name="EX_Day"
        render={({ field }) => (
            <FormItem>
                <FormLabel> 考試日子 </FormLabel>
                <FormControl>
                    <Controller
                        name="EX_Day"
                        control={schoolexday_create_form.control}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker
                                value={value ? new Date(value) : null}
                                format="YYYY-MM-DD"
                                onChange={(date) => {
                                    if (date) {
                                        const nativeDate = date.toDate(); // 将 DateObject 转换为原生 Date
                                        onChange(nativeDate.toISOString()); // 转换为 ISO 字符串
                                    } else {
                                        onChange(null); // 如果日期为空，设置为 null
                                    }
                                }}
                            />
                        )}
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
    </div>
  )
}

export default SchoolEXDayCreateFormbysupadmin