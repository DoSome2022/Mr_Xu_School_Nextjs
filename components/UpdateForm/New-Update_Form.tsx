"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
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
import { News_Update_Schema } from "@/actions/Update-New/schema";
import { update_News_action } from "@/actions/Update-New";

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  createAt: string;
  updatedAt: string;
}

const New_Update_Form = () => {
  const params = useParams();
  const newsId = params?.newsdetailbyID as string;
  const [isPending, startTransition] = useTransition();
  const [GetNewDataById, setGetNewDataById] = useState<News | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (newsId) {
      const fetchNewDetailById = async (id: string) => {
        setLoading(true);
        setError("");
        try {
          const res = await fetch(`/api/News_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法載入公告資料");
          }
          const result: News[] = await res.json();
          setGetNewDataById(result[0] || null);
        } catch (err: any) {
          console.error("載入錯誤:", err);
          setError(err.message || "無法載入公告資料");
        } finally {
          setLoading(false);
        }
      };
      fetchNewDetailById(newsId);
    } else {
      setError("無效的公告ID");
      setLoading(false);
    }
  }, [newsId]);

  const new_update_form = useForm<z.infer<typeof News_Update_Schema>>({
    resolver: zodResolver(News_Update_Schema),
    defaultValues: {
      NewId: newsId,
      title: "",
      content: "",
      date: "",
    },
  });

  useEffect(() => {
    if (GetNewDataById) {
      new_update_form.reset({
        NewId: newsId,
        title: GetNewDataById.title || "",
        content: GetNewDataById.content || "",
        date: GetNewDataById.date || "",
      });
    }
  }, [GetNewDataById, newsId, new_update_form]);

  const new_update_form_onSubmit = (values: z.infer<typeof News_Update_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = await update_News_action(values);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("公告更新成功");
        new_update_form.reset({
          NewId: newsId,
          title: values.title,
          content: values.content,
          date: values.date,
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !GetNewDataById) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無公告資料"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">
        公告標題: {GetNewDataById?.title || "載入中..."}
      </h2>
      <Form {...new_update_form}>
        <form onSubmit={new_update_form.handleSubmit(new_update_form_onSubmit)} className="space-y-6">
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="space-y-4">
            <FormField
              control={new_update_form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">標題</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入標題"
                      type="text"
                      className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={new_update_form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">內容</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      disabled={isPending}
                      placeholder="輸入內容"
                      className="w-full border-gray-300 rounded-md p-2 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300 min-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={new_update_form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">日期</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入日期 (YYYY-MM-DD)"
                      type="date"
                      className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
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
            className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            {isPending ? "正在提交..." : "更新公告"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default New_Update_Form;