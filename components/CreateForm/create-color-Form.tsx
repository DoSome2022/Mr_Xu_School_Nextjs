"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Create_Color_Action } from "@/actions/Create-Color";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ColorResult } from "react-color";
import { Create_Color_Schema } from "@/actions/Create-Color/schema";

// 動態導入 ChromePicker 並禁用 SSR
const ChromePicker = dynamic(
  () => import("react-color").then((mod) => mod.ChromePicker),
  { ssr: false }
);

const CreateColorForm = () => {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const param = useParams();
  const router = useRouter();
  const UserId = param?.id as string;

  // 確保組件在客戶端完成 hydration 後才渲染 ChromePicker
  useEffect(() => {
    setMounted(true);
  }, []);

  const color_create_form = useForm<z.infer<typeof Create_Color_Schema>>({
    resolver: zodResolver(Create_Color_Schema),
    defaultValues: {
      color_name: "",
    },
  });

  // 處理顏色選擇
  const handleColorChange = (selectedColor: ColorResult) => {
    color_create_form.setValue("color_name", selectedColor.hex);
  };

  const color_create_form_onSubmit = (values: z.infer<typeof Create_Color_Schema>) => {
    console.log("-- 表單輸入資料 -- :", values, "-- 結束 --");
    startTransition(() => {
      Create_Color_Action(values)
        .then((result) => {
          console.log("顏色創建成功:", result);
          if (result.data) {
            router.push(`/user/${UserId}/admin/colorLists`);
          }
        })
        .catch((error) => {
          console.error("創建顏色失敗:", error);
          color_create_form.setError("root", { message: "創建顏色失敗，請重試" });
        });
    });
  };

  console.log("-- bug -- :", color_create_form.formState.errors, "-- 結束 --");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-noto-sans-tc p-4 sm:p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl sm:text-3xl text-primary-1 mb-6">創建顏色表單</h1>
        <Form {...color_create_form}>
          <form onSubmit={color_create_form.handleSubmit(color_create_form_onSubmit)} className="space-y-6">
            {/* 顏色選擇器 */}
            <FormField
              control={color_create_form.control}
              name="color_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-1 text-base">顏色選擇</FormLabel>
                  <FormControl>
                    {mounted && (
                      <ChromePicker
                        color={field.value || "#000000"}
                        onChange={handleColorChange}
                      />
                    )}
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            {/* 顯示色碼的輸入欄 */}
            <div>
              <FormLabel className="text-primary-1 text-base">顏色色碼</FormLabel>
              <input
                type="text"
                id="colorCode"
                value={color_create_form.watch("color_name") || ""}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-grey-2 rounded-md text-primary-1 focus:ring-primary-1 focus:border-primary-1"
              />
            </div>
            {/* 錯誤訊息 */}
            {color_create_form.formState.errors.root && (
              <p className="text-red-500 text-sm text-center">
                {color_create_form.formState.errors.root.message}
              </p>
            )}
            {/* 提交按鈕 */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-primary-1 text-black hover:bg-grey-2 rounded-md transition-colors duration-300"
            >
              {isPending ? "提交中..." : "提交"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateColorForm;