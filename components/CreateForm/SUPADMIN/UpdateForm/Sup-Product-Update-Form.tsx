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
import { SupProduct_Update_Schema } from "@/actions/supadmin/Update-Product/schema";
import { SupupdateProduct_action } from "@/actions/supadmin/Update-Product";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
}

const Product_Update_Formbysupadmin = () => {
  const params = useParams<{ productDetailbyID: string; supadminid: string }>();
  const supadminid = params?.supadminid as string;
  const productId = params?.productDetailbyID as string;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const product_update_form = useForm<z.infer<typeof SupProduct_Update_Schema>>({
    resolver: zodResolver(SupProduct_Update_Schema),
    defaultValues: {
      supadminid: supadminid,
      productid: productId,
      name: "",
      description: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (productId) {
      const fetchProductDetail = async (id: string) => {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/Product_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法獲取商品詳情數據");
          }
          const result = await res.json();
          setProductData(result);
          // 預填表單數據
          product_update_form.reset({
            supadminid: supadminid,
            productid: productId,
            name: result.name || "",
            description: result.description || "",
            price: parseFloat(result.price) || 0,
          });
        } catch (error: any) {
          console.error("獲取商品詳情失敗:", error);
          setError("無法載入商品詳情");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProductDetail(productId);
    }
  }, [productId, supadminid, product_update_form]);

const product_update_form_onSubmit = (
  values: z.infer<typeof SupProduct_Update_Schema>
) => {
  setError("");
  setSuccess("");
  startTransition(async () => {
    const result = await SupupdateProduct_action(values);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(typeof result.success === "string" ? result.success : result.success ? "商品更新成功" : undefined);
    }
  });
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-gray-500 text-sm font-medium">正在載入...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <Form {...product_update_form}>
      <form
        onSubmit={product_update_form.handleSubmit(product_update_form_onSubmit)}
        className="space-y-6"
      >
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        <FormField
          control={product_update_form.control}
          name="productid"
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
          control={product_update_form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-semibold">
                商品名稱
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入商品名稱"
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={product_update_form.control}
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
          control={product_update_form.control}
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
          {isPending ? "正在更新..." : "更新商品"}
        </Button>
      </form>
    </Form>
  );
};

export default Product_Update_Formbysupadmin;