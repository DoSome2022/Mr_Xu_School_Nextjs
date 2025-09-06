// app/reset-password/page.tsx
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
import { useRouter, useSearchParams } from "next/navigation";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { ResetPasswordSchema } from "@/actions/ResetPassword/schema";
import { ResetPasswordAction } from "@/actions/ResetPassword";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    if (!token) {
      setError("無效的重置連結");
      return;
    }
    console.log("-- 重置密碼輸入 -- : ", values);
    setError("");
    setSuccess("");

    startTransition(() => {
      ResetPasswordAction({ ...values, token }).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        if (data?.success) {
          setTimeout(() => router.push("/login"), 2000); // 成功後 2 秒導向登入頁面
        }
      });
    });
  };

  const handleBack = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e7915b] p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">重置密碼</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">新密碼</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="輸入新密碼"
                          type="password"
                          className="pl-10 bg-white/20 text-white placeholder:text-gray-300 border-none rounded-md focus:ring-2 focus:ring-cyan-200 transition-all duration-300"
                        />
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 11c0-1.1.9-2 2-2m-2 6c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4m4 2c0 2.2-1.8 4-4 4s-4-1.8-4-4m-6 0c0 2.2-1.8 4-4 4s-4-1.8-4-4m4-6c0-2.2 1.8-4 4-4"
                          />
                        </svg>
                      </div>
                    </FormControl>
                    <FormMessage className="text-cyan-200" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">確認新密碼</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="再次輸入新密碼"
                          type="password"
                          className="pl-10 bg-white/20 text-white placeholder:text-gray-300 border-none rounded-md focus:ring-2 focus:ring-cyan-200 transition-all duration-300"
                        />
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 11c0-1.1.9-2 2-2m-2 6c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4m4 2c0 2.2-1.8 4-4 4s-4-1.8-4-4m-6 0c0 2.2-1.8 4-4 4s-4-1.8-4-4m4-6c0-2.2 1.8-4 4-4"
                          />
                        </svg>
                      </div>
                    </FormControl>
                    <FormMessage className="text-cyan-200" />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />
            <div className="flex space-x-4">
              <Button
                disabled={isPending}
                type="submit"
                className="flex-1 bg-blue-300 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    正在提交...
                  </span>
                ) : (
                  "提交"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-white border-white/50 hover:bg-white/20"
                onClick={handleBack}
                disabled={isPending}
              >
                返回
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;