"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
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
import { Product_Update_Schema } from "@/actions/Update-Product/schema";
import { updateProduct_action } from "@/actions/Update-Product";

// 定義 Product 介面，與 Prisma 模式匹配
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

const Product_Update_Form = () => {
  const params = useParams<{ ProductDetailbyID: string }>();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);
  const ProductID = params?.ProductDetailbyID as string;

  // 使用 Product | null 作為類型
  const [GetProductDataById, setGetProductDataById] = useState<Product | null>(null);

  useEffect(() => {
    if (ProductID) {
      const fetchProductDetailById = async (id: string) => {
        setLoading(true);
        try {
          const res = await fetch(`/api/Product_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法載入產品資料");
          }
          const result: Product = await res.json();
          setGetProductDataById(result);
          // 更新表單值
          product_update_form.setValue("name", result.name);
          product_update_form.setValue("description", result.description);
          product_update_form.setValue("price", result.price);
        } catch (error) {
          console.error("載入錯誤:", error);
          setError("無法載入產品資料");
        } finally {
          setLoading(false);
        }
      };
      fetchProductDetailById(ProductID);
    }
  }, [ProductID]);

  const product_update_form = useForm<z.infer<typeof Product_Update_Schema>>({
    resolver: zodResolver(Product_Update_Schema),
    defaultValues: {
      productid: ProductID,
      name: "",
      description: "",
      price: 0,
    },
  });

  const product_update_form_onSubmit = (values: z.infer<typeof Product_Update_Schema>) => {
    console.log("-- 產品更新輸入 -- : ", values, "-- End --");
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await updateProduct_action(values);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("產品更新成功");
      }
    });
  };

  if (loading) {
    return <p className="text-[#e7915b] text-lg">正在加載...</p>;
  }

  if (error && !GetProductDataById) {
    return <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold tracking-tight text-[#e7915b] mb-6">
        編輯商品
      </h2>
      <Form {...product_update_form}>
        <form onSubmit={product_update_form.handleSubmit(product_update_form_onSubmit)} className="space-y-6">
          <FormError message={error} />
          <FormSuccess message={success} />

          {/* 隱藏的 productid 字段 */}
          <FormField
            control={product_update_form.control}
            name="productid"
            render={({ field }) => (
              <FormItem hidden>
                <FormControl>
                  <Input {...field} value={ProductID} type="text" readOnly />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* 商品名稱 */}
          <FormField
            control={product_update_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">商品名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder={GetProductDataById?.name || "輸入商品名稱"}
                    type="text"
                    className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* 商品描述 */}
          <FormField
            control={product_update_form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">商品描述</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    disabled={isPending}
                    placeholder={GetProductDataById?.description || "輸入商品描述"}
                    className="w-full border-[#e7915b] rounded-md p-2 focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300 min-h-[100px]"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* 商品價格 */}
          <FormField
            control={product_update_form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">
                  價格: {GetProductDataById?.price?.toString() || "未設定"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder={GetProductDataById?.price?.toString() || "輸入價格"}
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50"
          >
            {isPending ? "正在提交..." : "更新產品"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Product_Update_Form;