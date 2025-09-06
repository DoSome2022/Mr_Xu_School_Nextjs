// components/CreateForm/SUPADMIN/UpdateForm/Sup-New-Update_Form.tsx
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
import { Supupdate_News_action } from "@/actions/supadmin/Update-New";
import { SupNews_Update_Schema } from "@/actions/supadmin/Update-New/schema";

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
}

const New_Update_Form_bysupadmin = () => {
  const params = useParams<{ newsdetailbyID: string; supadminid: string }>();
  const NewID = params?.newsdetailbyID as string;
  const supadminid = params?.supadminid as string;
  const [isPending, startTransition] = useTransition();
  const [GetNewDateById, setGetNewDateById] = useState<News | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  useEffect(() => {
    if (NewID) {
      const fetchnewdetailbyid = async (id: string) => {
        try {
          const res = await fetch(`/api/News_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法獲取新聞數據");
          }
          const result = await res.json();
          setGetNewDateById(result); // 假設 API 返回單個物件
        } catch (error) {
          console.error("數據獲取失敗:", error);
          setError("無法載入數據");
        }
      };
      fetchnewdetailbyid(NewID);
    }
  }, [NewID]);

  const new_update_form = useForm<z.infer<typeof SupNews_Update_Schema>>({
    resolver: zodResolver(SupNews_Update_Schema),
    defaultValues: {
      supadminid: supadminid,
      NewId: NewID,
      title: "",
      content: "",
      date: "",
    },
  });

  useEffect(() => {
    if (GetNewDateById) {
      new_update_form.setValue("title", GetNewDateById.title || "");
      new_update_form.setValue("content", GetNewDateById.content || "");
      new_update_form.setValue("date", GetNewDateById.date || "");
    }
  }, [GetNewDateById, new_update_form]);

  const new_update_form_onSubmit = (values: z.infer<typeof SupNews_Update_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = await Supupdate_News_action(values);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("新聞更新成功");
      }
    });
  };

  return (
    <Form {...new_update_form}>
      <form onSubmit={new_update_form.handleSubmit(new_update_form_onSubmit)} className="space-y-6">
        <FormError message={error} />
        <FormSuccess message={success} />
        <div className="space-y-4" hidden>
          <FormField
            control={new_update_form.control}
            name="NewId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} value={NewID} type="text" disabled />
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
                  <Input {...field} value={supadminid} type="text" disabled />
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
        <Button disabled={isPending} type="submit" className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300">
          {isPending ? "正在提交..." : "更新新聞"}
        </Button>
      </form>
    </Form>
  );
};

export default New_Update_Form_bysupadmin;