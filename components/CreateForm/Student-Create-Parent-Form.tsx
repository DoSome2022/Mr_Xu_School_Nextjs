"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { student_parent_create_Schema } from "@/actions/Create-Student_Parent/schema";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { createStudentParentData } from "@/actions/Create-Student_Parent";

interface SchoolData {
  id: string;
  school_name: string;
}

const Student_Create_Parent_Form = () => {
  const params = useParams<{
    parentId: string;
  }>();
  const router = useRouter();
  const parentId = params?.parentId;
  const [isPending, startTransition] = useTransition();

  // 驗證路由參數
  if (!parentId) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const form = useForm<z.infer<typeof student_parent_create_Schema>>({
    resolver: zodResolver(student_parent_create_Schema),
    defaultValues: {
      id: parentId,
      name: "",
      school: "",
      grade: 0,
    },
  });

  const fetcher = <T,>(url: string, init?: RequestInit): Promise<T> =>
    fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        ...init?.headers,
        "Cache-Control": "no-cache",
      },
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://localhost:3000";

  // 獲取學校資料
  const { data: schoolData, error: schoolError, isLoading: schoolLoading } = useSWR<SchoolData[]>(
    `${apiUrl}/api/School_Lists`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("schoolData:", schoolData, "-- End --");
  }

  // 錯誤處理
  if (schoolError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入學校資料 - {schoolError.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (schoolLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 驗證學校資料
  const validSchoolData = schoolData?.filter((d) => d.school_name && d.school_name.trim() !== "") || [];
  if (!schoolData || validSchoolData.length === 0) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無有效的學校資料
      </div>
    );
  }

  const onSubmit = async (values: z.infer<typeof student_parent_create_Schema>) => {
    console.log("-- student_register_parent 輸入 -- : ", values, "-- End --");
    startTransition(async () => {
      try {
        const result = await createStudentParentData(values);
        if (result.success) {
          toast.success("新增學生成功");
          router.push(`/parent/${parentId}/profiles`);
          form.reset();
        } else {
          throw new Error(result.error || "新增學生失敗");
        }
      } catch (error) {
        console.error("Create student failed:", error);
        toast.error("新增學生失敗，請檢查輸入資料或稍後重試");
      }
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base font-medium">
                  姓名
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入姓名"
                    className="bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-400"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base font-medium">
                  學校
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending || validSchoolData.length === 0}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-400">
                      <SelectValue placeholder="請選擇學校" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      {validSchoolData.map((school) => (
                        <SelectItem
                          key={school.id}
                          value={school.school_name}
                          className="hover:bg-gray-600"
                        >
                          {school.school_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base font-medium">
                  年級
                </FormLabel>
                <FormControl>
                  <SWR_School_Grade
                    field={field}
                    disabled={isPending}
                    className="bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-400"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors duration-200"
          >
            {isPending ? "載入中..." : "新增學生"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Student_Create_Parent_Form;