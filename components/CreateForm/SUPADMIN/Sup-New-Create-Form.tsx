"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { SupNews_Create_Schema } from "@/actions/supadmin/Create-New/schema";
import { SupcreateNews_action } from "@/actions/supadmin/Create-New";
import { useParams } from "next/navigation";

const New_Create_Form_bysupadmin = () => {
  const params = useParams();
  const supadminid = params?.supadminid as string;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const new_create_form = useForm<z.infer<typeof SupNews_Create_Schema>>({
    resolver: zodResolver(SupNews_Create_Schema),
    defaultValues: {
      supadminid: supadminid,
      title: "",
      content: "",
      date: "",
    },
  });

const new_create_form_onSubmit = (values: z.infer<typeof SupNews_Create_Schema>) => {
  setError("");
  setSuccess("");
  startTransition(() => {
    SupcreateNews_action(values).then((data) => {
      setError(data?.error);
      setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "公告創建成功" : undefined);
    });
  });
};

  return (
    <Form {...new_create_form}>
      <form
        onSubmit={new_create_form.handleSubmit(new_create_form_onSubmit)}
        className="space-y-6"
      >
<FormError message={error} />
    <FormSuccess
      message={typeof success === "string" ? success : success ? "公告創建成功" : undefined}
    />
        <FormField
          control={new_create_form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-semibold">
                標題
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入公告標題"
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={new_create_form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-semibold">
                內容
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入公告內容"
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={new_create_form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-semibold">
                日期
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入日期 (YYYY-MM-DD)"
                  type="date"
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
        <Button
          disabled={isPending}
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
        >
          {isPending ? "正在建立..." : "建立公告"}
        </Button>
      </form>
    </Form>
  );
};

export default New_Create_Form_bysupadmin;