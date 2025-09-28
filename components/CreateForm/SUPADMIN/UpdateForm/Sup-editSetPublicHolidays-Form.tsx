// app/[您的路徑]/Public_Holidays_Edit_Formbysupadmin.tsx

"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
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
import DatePicker from "react-multi-date-picker";
import { Suppublic_holiday_edit_Schema } from "@/actions/supadmin/Update-PublicHoliday/schema";
import { SupeditPublic_holiday } from "@/actions/supadmin/Update-PublicHoliday";
import { useRouter } from "next/navigation";

// 定義介面
interface PublicHoliday {
  id: string;
  publicholiday: string[];
}

// 輔助函數：格式化日期
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
};

const Public_Holidays_Edit_Formbysupadmin = ({ PublicHolidays }: { PublicHolidays: PublicHoliday[] }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter();
  const params = useParams<{ supadminid: string }>();
  const supadminid = params.supadminid as string;

  // 初始化表單
  const publicholidays_edit_form = useForm<z.infer<typeof Suppublic_holiday_edit_Schema>>({
    resolver: zodResolver(Suppublic_holiday_edit_Schema),
    defaultValues: {
      id: PublicHolidays[0]?.id || "",
      publicholiday: PublicHolidays[0]?.publicholiday || [],
      supadminid: supadminid,
    },
  });

  // 設置初始值
  useEffect(() => {
    if (PublicHolidays[0]) {
      publicholidays_edit_form.reset({
        id: PublicHolidays[0].id,
        publicholiday: PublicHolidays[0].publicholiday,
        supadminid: supadminid,
      });
    }
  }, [PublicHolidays, supadminid, publicholidays_edit_form]);

  // 提交表單
  const publicholidays_edit_form_onSubmit = (values: z.infer<typeof Suppublic_holiday_edit_Schema>) => {
    console.log("-- edit publicholidays -- : ", values, "-- End --");
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const result = await SupeditPublic_holiday(values);
        if (result?.error) {
          setError(result.error);
        } else {
          setSuccess("公眾假期更新成功");
          router.push(`/supadmin/${supadminid}/setpublicholidaysLists`);
        }
      } catch (error: any) {
        if (error.message?.includes("NEXT_REDIRECT")) {
          setSuccess("公眾假期更新成功");
        } else {
          setError("更新失敗，請重試。");
        }
      }
    });
  };

  console.log("bug : ", publicholidays_edit_form.formState.errors, "-- End --");

  return (
    <div className="min-h-screen bg-gray-100 pt-20 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* 新增：公眾假期顯示區域 */}
        {PublicHolidays[0]?.publicholiday?.length > 0 ? (
          <div className="mb-8 border-b pb-6">
            <h2 className="text-2xl font-semibold text-[#80A8BD] mb-4">當前公眾假期</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-gray-600 font-medium">公眾假期:</p>
                <p className="text-gray-800">
                  {PublicHolidays[0].publicholiday.map((holiday, index) => (
                    <span key={index}>
                      {formatDate(holiday)}
                      {index < PublicHolidays[0].publicholiday.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 text-center">
            <p className="text-gray-600">無公眾假期數據可顯示</p>
          </div>
        )}

        <h2 className="text-xl font-bold tracking-tight text-[#80A8BD] mb-6">
          修改公眾假期
        </h2>
        <Form {...publicholidays_edit_form}>
          <form
            onSubmit={publicholidays_edit_form.handleSubmit(publicholidays_edit_form_onSubmit)}
            className="space-y-6"
          >
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className="space-y-4">
              <FormField
                control={publicholidays_edit_form.control}
                name="publicholiday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#80A8BD] font-medium">修改公眾假期</FormLabel>
                    <FormControl>
                      <DatePicker
                        multiple
                        value={field.value.map((date) => new Date(date)) || []}
                        onChange={(dates: any) => {
                          const formattedDates = dates
                            ? dates.map((date: any) => {
                                const d = new Date(date);
                                return isNaN(d.getTime()) ? null : d.toISOString();
                              }).filter((date: string | null) => date !== null)
                            : [];
                          field.onChange(formattedDates);
                        }}
                        format="YYYY-MM-DD"
                        placeholder="選擇公眾假期"
                        className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50"
            >
              {isPending ? "正在提交..." : "提交"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Public_Holidays_Edit_Formbysupadmin;