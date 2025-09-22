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
import { School_Create_Schema } from "@/actions/Create-School/schema";
import { createSchool_action } from "@/actions/Create-School";

const School_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const school_register_form = useForm<z.infer<typeof School_Create_Schema>>({
    resolver: zodResolver(School_Create_Schema),
    defaultValues: {
      school_name: "",
    },
  });

  const school_register_form_onSubmit = (values: z.infer<typeof School_Create_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createSchool_action(values).then((data) => {
        if (data?.success) {
          setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
          school_register_form.reset();
        } else {
          setError(data?.error || "建立學校失敗");
        }
      });
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">建立新學校</h2>
      <Form {...school_register_form}>
        <form onSubmit={school_register_form.handleSubmit(school_register_form_onSubmit)} className="space-y-6">
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="space-y-4">
            <FormField
              control={school_register_form.control}
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
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            {isPending ? "正在提交..." : "建立學校"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default School_Create_Form;