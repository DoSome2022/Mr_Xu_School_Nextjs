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

import { News_Create_Schema } from "@/actions/Create-New/schema";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { createNews_action } from "@/actions/Create-New";

const New_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const new_create_form = useForm<z.infer<typeof News_Create_Schema>>({
    resolver: zodResolver(News_Create_Schema),
    defaultValues: {
      title: "",
      content: "",
      date: "",
    },
  });

  const new_create_form_onSubmit = (values: z.infer<typeof News_Create_Schema>) => {
    console.log("-- create news -- : ", values, "-- End --");
    setError("");
    setSuccess("");

    startTransition(() => {
      createNews_action(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mx-auto">
      <h2 className="text-xl font-bold tracking-tight text-[#e7915b] mb-6">
        建立公告
      </h2>
      <Form {...new_create_form}>
        <form
          onSubmit={new_create_form.handleSubmit(new_create_form_onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={new_create_form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#e7915b] font-medium">標題</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入公告標題"
                      type="text"
                      className="border-[#e7915b] focus:ring-[#e7915b] focus:border-[#e7915b] text-gray-900"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={new_create_form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#e7915b] font-medium">內容</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入公告內容"
                      type="text"
                      className="border-[#e7915b] focus:ring-[#e7915b] focus:border-[#e7915b] text-gray-900"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={new_create_form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#e7915b] font-medium">日期</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="選擇公告日期"
                      type="date"
                      className="border-[#e7915b] focus:ring-[#e7915b] focus:border-[#e7915b] text-gray-900"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50"
          >
            建立
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default New_Create_Form;