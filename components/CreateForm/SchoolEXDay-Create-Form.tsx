"use client";

import { School_Ex_Day_Schema } from "@/actions/Create-School_EX_Day/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import DatePicker from "react-multi-date-picker";
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
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Year } from "../fatchdata/swrschool_year";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { createSchool_Ex_Day_data_action } from "@/actions/Create-School_EX_Day";

const SchoolEXDayCreateForm = () => {
  const params = useParams();
  const schoolId = params?.schooldetailbyID as string;

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const schoolexday_create_form = useForm<z.infer<typeof School_Ex_Day_Schema>>({
    resolver: zodResolver(School_Ex_Day_Schema),
    defaultValues: {
      school_ex_day_id: schoolId,
      subject: "",
      grade: 0,
      year: "",
      quarter: 0,
      EX_Day: "",
      title: "",
    },
  });

  const schoolexday_create_form_onSubmit = (values: z.infer<typeof School_Ex_Day_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createSchool_Ex_Day_data_action(values).then((data) => {
        if (data?.success) {
          setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
          schoolexday_create_form.reset({ school_ex_day_id: schoolId });
        } else {
          setError(data?.error || "新增考試時間失敗");
        }
      });
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">新增學校考試時間</h2>
      <Form {...schoolexday_create_form}>
        <form onSubmit={schoolexday_create_form.handleSubmit(schoolexday_create_form_onSubmit)} className="space-y-6">
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="space-y-4">
            <FormField
              control={schoolexday_create_form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">標題</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入考試標題"
                      type="text"
                      className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                  <FormLabel className="text-gray-700 font-semibold">科目</FormLabel>
                  <FormControl>
                    <SWR_School_Subject field={field} disabled={isPending} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                  <FormLabel className="text-gray-700 font-semibold">年級</FormLabel>
                  <FormControl>
                    <SWR_School_Grade field={field} disabled={isPending} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                  <FormLabel className="text-gray-700 font-semibold">年度</FormLabel>
                  <FormControl>
                    <SWR_School_Year field={field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                  <FormLabel className="text-gray-700 font-semibold">季度</FormLabel>
                  <FormControl>
                    <SWR_School_Quarter field={field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                  <FormLabel className="text-gray-700 font-semibold">考試日期</FormLabel>
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
                              const nativeDate = date.toDate();
                              onChange(nativeDate.toISOString());
                            } else {
                              onChange(null);
                            }
                          }}
                          inputClass="w-full border-gray-300 rounded-md p-2 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
                          disabled={isPending}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            {isPending ? "正在提交..." : "建立考試時間"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SchoolEXDayCreateForm;