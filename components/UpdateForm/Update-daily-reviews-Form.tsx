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
import { update_dailyreviews } from "@/actions/Update-dailyreviews";
import { Update_Dailyreviews_Schema } from "@/actions/Update-dailyreviews/schema";

// 定義 DailyReview 介面，與 Prisma 模式匹配
interface DailyReview {
  id: string;
  title: string;
  content: string;
  student_id: string;
  teacher_id: string;
  created_at: string;
  updated_at: string;
}

const Update_daily_reviews_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const params = useParams();
  const studentId = params?.studentdetailbyID as string;
  const teacherId = params?.teacherId as string;
  const dailyreviewId = params?.dailyreviewbyID as string;

  // 使用 DailyReview | null 作為類型
  const [getdailyreviewsData, setgetdailyreviewsData] = useState<DailyReview | null>(null);



  const dailyreviews_update_form = useForm<z.infer<typeof Update_Dailyreviews_Schema>>({
    resolver: zodResolver(Update_Dailyreviews_Schema),
    defaultValues: {
      id: dailyreviewId,
      student_id: studentId,
      teacher_id: teacherId,
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (dailyreviewId) {
      const fetchDailyReviews = async (id: string) => {
        try {
          const res = await fetch(`/api/Dailyreviews_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法載入日評資料");
          }
          const result: DailyReview = await res.json();
          setgetdailyreviewsData(result);
          // 設置表單值
          dailyreviews_update_form.setValue("title", result.title || "");
          dailyreviews_update_form.setValue("content", result.content || "");
        } catch (error) {
          console.error("載入錯誤:", error);
          setError("無法載入日評資料");
        }
      };
      fetchDailyReviews(dailyreviewId);
    }
  }, [dailyreviewId, dailyreviews_update_form]);



  const dailyreviews_update_form_onSubmit = (values: z.infer<typeof Update_Dailyreviews_Schema>) => {
    console.log("-- 日評更新輸入 -- : ", values, "-- End --");
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await update_dailyreviews(values);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("日評更新成功");
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#80A8BD] rounded-lg shadow-md">
      <Form {...dailyreviews_update_form}>
        <form
          onSubmit={dailyreviews_update_form.handleSubmit(dailyreviews_update_form_onSubmit)}
          className="space-y-6"
        >
          <FormError message={error} />
          <FormSuccess message={success} />

          {/* 隱藏的 ID 字段 */}
          <FormField
            control={dailyreviews_update_form.control}
            name="id"
            render={({ field }) => (
              <FormItem hidden>
                <FormControl>
                  <Input {...field} value={dailyreviewId} type="text" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 隱藏的 student_id 字段 */}
          <FormField
            control={dailyreviews_update_form.control}
            name="student_id"
            render={({ field }) => (
              <FormItem hidden>
                <FormControl>
                  <Input {...field} value={studentId} type="text" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 隱藏的 teacher_id 字段 */}
          <FormField
            control={dailyreviews_update_form.control}
            name="teacher_id"
            render={({ field }) => (
              <FormItem hidden>
                <FormControl>
                  <Input {...field} value={teacherId} type="text" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 標題 */}
          <FormField
            control={dailyreviews_update_form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>標題</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder={getdailyreviewsData?.title || "輸入標題"}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 內容 */}
          <FormField
            control={dailyreviews_update_form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>內容</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder={getdailyreviewsData?.content || "輸入內容"}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? "正在更新..." : "更新日評"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Update_daily_reviews_Form;