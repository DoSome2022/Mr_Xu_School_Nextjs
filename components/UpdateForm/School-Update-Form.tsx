"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
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
import { School_Update_Schema } from "@/actions/Update-School/schema";
import { update_School_action } from "@/actions/Update-School";

interface School {
  id: string;
  school_name: string;
  chine_date?: string;
  eng_date?: string;
  math_date?: string;
}

const School_Update_Form = () => {
  const params = useParams();
  const schoolId = params?.schooldetailbyID as string;

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [GetSchoolDataById, setGetSchoolDataById] = useState<School | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (schoolId) {
      const fetchSchoolDetail = async (id: string) => {
        setLoading(true);
        setError("");
        try {
          const res = await fetch(`/api/School_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法載入學校資料");
          }
          const result = await res.json();
          setGetSchoolDataById(result);
          // 更新表單預設值
          school_update_form.reset({
            school_id: schoolId,
            school_name: result.school_name || "",
            chine_date: result.chine_date || "",
            eng_date: result.eng_date || "",
            math_date: result.math_date || "",
          });
        } catch (error: any) {
          console.error("載入錯誤:", error);
          setError("無法載入學校資料");
        } finally {
          setLoading(false);
        }
      };
      fetchSchoolDetail(schoolId);
    } else {
      setError("無效的學校ID");
      setLoading(false);
    }
  }, [schoolId]);

  const school_update_form = useForm<z.infer<typeof School_Update_Schema>>({
    resolver: zodResolver(School_Update_Schema),
    defaultValues: {
      school_id: schoolId,
      school_name: "",
      chine_date: "",
      eng_date: "",
      math_date: "",
    },
  });

  const school_update_form_onSubmit = (values: z.infer<typeof School_Update_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      update_School_action(values).then((data) => {
        if (data?.success) {
          setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
        } else {
          setError(data?.error || "更新學校資料失敗");
        }
      });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !GetSchoolDataById) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無學校資料"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">編輯學校資料</h2>
      <Form {...school_update_form}>
        <form onSubmit={school_update_form.handleSubmit(school_update_form_onSubmit)} className="space-y-6">
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="space-y-4 hidden">
            <FormField
              control={school_update_form.control}
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="hidden" value={schoolId} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                  <FormLabel className="text-gray-700 font-semibold">學校名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入學校名稱"
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
              control={school_update_form.control}
              name="chine_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">中文考試日期</FormLabel>
                  <FormControl>
                    <Controller
                      name="chine_date"
                      control={school_update_form.control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value ? new Date(value) : null}
                          format="YYYY-MM-DD"
                          onChange={(date) => {
                            if (date) {
                              const nativeDate = date.toDate();
                              onChange(nativeDate.toISOString());
                            } else {
                              onChange("");
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
          <div className="space-y-4">
            <FormField
              control={school_update_form.control}
              name="eng_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">英文考試日期</FormLabel>
                  <FormControl>
                    <Controller
                      name="eng_date"
                      control={school_update_form.control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value ? new Date(value) : null}
                          format="YYYY-MM-DD"
                          onChange={(date) => {
                            if (date) {
                              const nativeDate = date.toDate();
                              onChange(nativeDate.toISOString());
                            } else {
                              onChange("");
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
          <div className="space-y-4">
            <FormField
              control={school_update_form.control}
              name="math_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">數學考試日期</FormLabel>
                  <FormControl>
                    <Controller
                      name="math_date"
                      control={school_update_form.control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value ? new Date(value) : null}
                          format="YYYY-MM-DD"
                          onChange={(date) => {
                            if (date) {
                              const nativeDate = date.toDate();
                              onChange(nativeDate.toISOString());
                            } else {
                              onChange("");
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
            {isPending ? "正在提交..." : "更新學校資料"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default School_Update_Form;