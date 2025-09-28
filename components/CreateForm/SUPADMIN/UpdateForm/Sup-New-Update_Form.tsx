// components/CreateForm/SUPADMIN/UpdateForm/Sup-New-Update_Form.tsx
"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
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
import { Supupdate_News_action } from "@/actions/supadmin/Update-New";
import { SupNews_Update_Schema } from "@/actions/supadmin/Update-New/schema";

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  createAt: string; // 與後端 API 保持一致
  updatedAt: string;
}

const New_Update_Form_bysupadmin = () => {
  const params = useParams<{ newsdetailbyID: string; supadminid: string }>();
  const newsId = params?.newsdetailbyID as string;
  const supadminId = params?.supadminid as string;
  const router = useRouter(); // 新增 useRouter
  const [isPending, startTransition] = useTransition();
  const [GetNewsDataById, setGetNewsDataById] = useState<News[] | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (newsId) {
      const fetchNewsDetail = async (id: string) => {
        setLoading(true);
        setError("");
        try {
          const res = await fetch(`/api/News_detail_data_by_id/${id}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error("無法獲取新聞數據");
          }
          const result = await res.json();
          setGetNewsDataById(result);
        } catch (error: any) {
          console.error("數據獲取失敗:", error);
          setError("無法載入新聞數據");
        } finally {
          setLoading(false);
        }
      };
      fetchNewsDetail(newsId);
    } else {
      setError("無效的新聞ID");
      setLoading(false);
    }
  }, [newsId]);

  const new_update_form = useForm<z.infer<typeof SupNews_Update_Schema>>({
    resolver: zodResolver(SupNews_Update_Schema),
    defaultValues: {
      supadminid: supadminId,
      NewId: newsId,
      title: "",
      content: "",
      date: "",
    },
  });

  useEffect(() => {
    if (GetNewsDataById && GetNewsDataById.length > 0) {
      const newsData = GetNewsDataById[0];
      new_update_form.setValue("title", newsData.title || "");
      new_update_form.setValue("content", newsData.content || "");
      new_update_form.setValue("date", newsData.date || "");
    }
  }, [GetNewsDataById, new_update_form]);

  const new_update_form_onSubmit = (values: z.infer<typeof SupNews_Update_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = await Supupdate_News_action(values);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("新聞更新成功，正在跳轉...");
        setTimeout(() => {
          router.push(`/supadmin/${supadminId}/newsLists`);
        }, 2000); // 2秒後跳轉
      }
    });
  };

  console.log("GetNewsDataById:", GetNewsDataById, "-- End --");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  if (!GetNewsDataById || GetNewsDataById.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600">無新聞數據</p>
      </div>
    );
  }

  const newsData = GetNewsDataById[0];

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#e7915b] mb-6">更新新聞</h1>

        {/* 顯示當前新聞數據 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">當前新聞數據</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-semibold text-gray-700">標題</h3>
              <p className="text-gray-600">{newsData.title || "無標題"}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-700">內容</h3>
              <p className="text-gray-600">{newsData.content || "無內容"}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-700">日期</h3>
              <p className="text-gray-600">{newsData.date || "無日期"}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-700">創建時間</h3>
              <p className="text-gray-600">
                {new Date(newsData.createAt).toLocaleString("zh-TW") || "無創建時間"}
              </p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-700">更新時間</h3>
              <p className="text-gray-600">
                {new Date(newsData.updatedAt).toLocaleString("zh-TW") || "無更新時間"}
              </p>
            </div>
          </div>
        </div>

        {/* 更新表單 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Form {...new_update_form}>
            <form
              onSubmit={new_update_form.handleSubmit(new_update_form_onSubmit)}
              className="space-y-6"
            >
              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="space-y-4" hidden>
                <FormField
                  control={new_update_form.control}
                  name="NewId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} value={newsId} type="text" disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={new_update_form.control}
                  name="supadminid"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} value={supadminId} type="text" disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={new_update_form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>標題</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="輸入新聞標題"
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
                  control={new_update_form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>內容</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="輸入新聞內容"
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
                  control={new_update_form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>日期</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="輸入日期 (YYYY-MM-DD)"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={isPending}
                type="submit"
                className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
              >
                {isPending ? "正在提交..." : "更新新聞"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default New_Update_Form_bysupadmin;