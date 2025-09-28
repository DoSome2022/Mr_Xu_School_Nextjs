"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { SupcreateProduct_action } from "@/actions/supadmin/Create-Product";
import { SupProduct_Create_Schema } from "@/actions/supadmin/Create-Product/schema";
import { useParams } from "next/navigation";

interface GetCourseData {
  id: string;
  course_name: string;
}

const Product_Create_Formbysupadmin = () => {
  const params = useParams();
  const supadminid = params?.supadminid as string;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [GetCourseData, setGetCourseData] = useState<GetCourseData[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(true);

  const product_register_form = useForm<z.infer<typeof SupProduct_Create_Schema>>({
    resolver: zodResolver(SupProduct_Create_Schema),
    defaultValues: {
      supadminid: supadminid,
      name: "",
      description: "",
      price: 0,
      product_price_record_id: "",
      stock: 0,
      Course_id: "",
    },
  });

  const handleCourseChange = (courseName: string) => {
    const selectedCourse = GetCourseData.find((data) => data.course_name === courseName);
    product_register_form.setValue("Course_id", selectedCourse ? selectedCourse.id : "", {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoadingCourses(true);
        const res = await fetch("/api/Course_Lists", {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("無法獲取課程列表數據");
        }
        const result = await res.json();
        setGetCourseData(result);
      } catch (error: any) {
        console.error("獲取課程數據失敗:", error);
        setError("無法載入課程列表");
      } finally {
        setIsLoadingCourses(false);
      }
    };
    fetchProductData();
  }, []);

const product_register_form_onSubmit = (
  values: z.infer<typeof SupProduct_Create_Schema>
) => {
  setError("");
  setSuccess("");
  startTransition(() => {
    SupcreateProduct_action(values).then((data) => {
      setError(data?.error);
      setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "商品創建成功" : undefined);
    });
  });
};

  return (
    <Form {...product_register_form}>
      <form
        onSubmit={product_register_form.handleSubmit(product_register_form_onSubmit)}
        className="space-y-6"
      >
<FormError message={error} />
    <FormSuccess
      message={typeof success === "string" ? success : success ? "商品創建成功" : undefined}
    />
        <FormField
          control={product_register_form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-semibold">
                商品名稱
              </FormLabel>
              <FormControl>
                <Select
                  disabled={isPending || isLoadingCourses}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCourseChange(value);
                  }}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200">
                    <SelectValue placeholder={isLoadingCourses ? "正在載入課程..." : "選擇課程"} />
                  </SelectTrigger>
                  <SelectContent>
                    {GetCourseData.length > 0 ? (
                      GetCourseData.map((data) => (
                        <SelectItem value={data.course_name} key={data.id}>
                          {data.course_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        無可用課程
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={product_register_form.control}
          name="Course_id"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <Input {...field} type="hidden" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={product_register_form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-semibold">
                商品描述
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入商品描述"
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={product_register_form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-semibold">
                商品數量
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入商品數量"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={product_register_form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-semibold">
                商品價格
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入商品價格"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
          {isPending ? "正在建立..." : "建立商品"}
        </Button>
      </form>
    </Form>
  );
};

export default Product_Create_Formbysupadmin;