// app/[您的路徑]/School_Update_Formbysupadmin.tsx

"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
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
import { Supupdate_School_action } from "@/actions/supadmin/Update-School";
import { SupSchool_Update_Schema } from "@/actions/supadmin/Update-School/schema";

interface School {
  id: string;
  school_name: string;
  createdAt?: string;
  updatedAt?: string;
  school_subject?: {
    grade: number;
    quarter: number;
    chine_data?: string;
    math_data?: string;
    eng_data?: string;
  }[];
}

const School_Update_Formbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    schooldetailbyID: string;
  }>();
  const router = useRouter();
  const schoolId = params?.schooldetailbyID;
  const supadminId = params?.supadminid;

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [GetSchoolDataById, setGetSchoolDataById] = useState<School | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const school_update_form = useForm<z.infer<typeof SupSchool_Update_Schema>>({
    resolver: zodResolver(SupSchool_Update_Schema),
    defaultValues: {
      supadminId: supadminId || "",
      school_id: schoolId || "",
      school_name: "",
      grade: 1,
      quarter: 1,
      chine_data: "",
      math_data: "",
      eng_data: "",
    },
  });

  useEffect(() => {
    if (!schoolId || !supadminId) {
      setError("缺少必要路由參數");
      setLoading(false);
      return;
    }

    const fetchSchoolDetail = async (id: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/School_detail_data_by_id/${id}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (!res.ok) {
          throw new Error(`無法載入學校資料: ${res.statusText}`);
        }
        const result = await res.json();
        if (!result) {
          throw new Error("無效的學校數據格式");
        }

        // 處理 API 返回的陣列
        const schoolData = Array.isArray(result) && result.length > 0 ? result[0] : result;
        if (!schoolData || typeof schoolData !== "object") {
          throw new Error("無效的學校數據格式");
        }

        setGetSchoolDataById(schoolData);

        const defaultSubject = schoolData.school_subject?.find(
          (subject: { grade: number; quarter: number }) => subject.grade === 1 && subject.quarter === 1
        ) || { grade: 1, quarter: 1, chine_data: "", math_data: "", eng_data: "" };

        school_update_form.reset({
          supadminId: supadminId,
          school_id: schoolId,
          school_name: schoolData.school_name || "",
          grade: defaultSubject.grade,
          quarter: defaultSubject.quarter,
          chine_data: defaultSubject.chine_data || "",
          math_data: defaultSubject.math_data || "",
          eng_data: defaultSubject.eng_data || "",
        });
      } catch (error: any) {
        console.error("載入錯誤:", error);
        setError("無法載入學校資料，請稍後再試");
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolDetail(schoolId);
  }, [schoolId, supadminId, school_update_form]);

  const school_update_form_onSubmit = (values: z.infer<typeof SupSchool_Update_Schema>) => {
    console.log("-- 學校更新輸入 -- : ", values, " -- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      Supupdate_School_action(values).then((data) => {
        if (data?.success) {
          setSuccess("更新成功");
          school_update_form.reset();
          router.push(`/supadmin/${supadminId}/schoolLists/${schoolId}`);
        } else {
          setError(data?.error || "更新學校資料失敗，請重試。");
        }
      });
    });
  };

  console.log("Bug : ", school_update_form.formState.errors, " -- End --");
  console.log("GetSchoolDataById : ", GetSchoolDataById, " -- End --");

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
    <div className="min-h-screen bg-gray-100 pt-20 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-semibold text-[#80A8BD] mb-6">編輯學校資料</h2>
        
        {/* 顯示 GetSchoolDataById 數據 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">學校資料</h3>
          <p><strong>ID:</strong> {GetSchoolDataById.id}</p>
          <p><strong>學校名稱:</strong> {GetSchoolDataById.school_name}</p>
          <p><strong>創建時間:</strong> {GetSchoolDataById.createdAt ? new Date(GetSchoolDataById.createdAt).toLocaleString() : "N/A"}</p>
          <p><strong>更新時間:</strong> {GetSchoolDataById.updatedAt ? new Date(GetSchoolDataById.updatedAt).toLocaleString() : "N/A"}</p>
          {/* {GetSchoolDataById.school_subject && GetSchoolDataById.school_subject.length > 0 ? (
            <div>
              <h4 className="text-md font-semibold text-gray-600 mt-2">科目資料</h4>
              {GetSchoolDataById.school_subject.map((subject, index) => (
                <div key={index} className="ml-4">
                  <p><strong>年級:</strong> {subject.grade}</p>
                  <p><strong>學期:</strong> {subject.quarter}</p>
                  <p><strong>中文考試日期:</strong> {subject.chine_data || "N/A"}</p>
                  <p><strong>數學考試日期:</strong> {subject.math_data || "N/A"}</p>
                  <p><strong>英文考試日期:</strong> {subject.eng_data || "N/A"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">無科目資料</p>
          )} */}
        </div>

        <Form {...school_update_form}>
          <form onSubmit={school_update_form.handleSubmit(school_update_form_onSubmit)} className="space-y-6">
            <FormError message={error} />
            <FormSuccess message={success} />
            <FormField
              control={school_update_form.control}
              name="school_id"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input {...field} disabled value={schoolId} type="text" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
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
            {/* <FormField
              control={school_update_form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">年級</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入年級（例如 1）"
                      type="number"
                      min="1"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={school_update_form.control}
              name="quarter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">學期</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入學期（1-4）"
                      type="number"
                      min="1"
                      max="4"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={school_update_form.control}
              name="chine_data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">中文考試日期</FormLabel>
                  <FormControl>
                    <Controller
                      name="chine_data"
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
            <FormField
              control={school_update_form.control}
              name="math_data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">數學考試日期</FormLabel>
                  <FormControl>
                    <Controller
                      name="math_data"
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
            <FormField
              control={school_update_form.control}
              name="eng_data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">英文考試日期</FormLabel>
                  <FormControl>
                    <Controller
                      name="eng_data"
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
            /> */}
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
    </div>
  );
};

export default School_Update_Formbysupadmin;