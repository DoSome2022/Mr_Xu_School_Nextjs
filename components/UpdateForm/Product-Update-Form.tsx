// "use client";

// import * as z from "zod";
// import { useEffect, useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { FormError } from "@/components/form-error";
// import { FormSuccess } from "@/components/form-success";
// import { Product_Update_Schema } from "@/actions/Update-Product/schema";
// import { updateProduct_action } from "@/actions/Update-Product";

// // 定義 Product 介面，與 Prisma 模式匹配
// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   createdAt: string;
//   updatedAt: string;
// }

// const Product_Update_Form = () => {
//   const params = useParams<{ ProductDetailbyID: string }>();
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const ProductID = params?.ProductDetailbyID as string;

//   // 使用 Product | null 作為類型
//   const [GetProductDataById, setGetProductDataById] = useState<Product | null>(null);

//   useEffect(() => {
//     if (ProductID) {
//       const fetchProductDetailById = async (id: string) => {
//         setLoading(true);
//         try {
//           const res = await fetch(`/api/Product_detail_data_by_id/${id}`, {
//                 cache: 'no-store',  // 強制不快取，確保每次請求新數據
//                 headers: {
//                     'Cache-Control': 'no-cache',
//                 },
//             });
//           if (!res.ok) {
//             throw new Error("無法載入產品資料");
//           }
//           const result: Product = await res.json();
//           setGetProductDataById(result);
//           // 更新表單值
//           product_update_form.setValue("name", result.name);
//           product_update_form.setValue("description", result.description);
//           product_update_form.setValue("price", result.price);
//         } catch (error) {
//           console.error("載入錯誤:", error);
//           setError("無法載入產品資料");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchProductDetailById(ProductID);
//     }
//   }, [ProductID]);

//   const product_update_form = useForm<z.infer<typeof Product_Update_Schema>>({
//     resolver: zodResolver(Product_Update_Schema),
//     defaultValues: {
//       productid: ProductID,
//       name: "",
//       description: "",
//       price: 0,
//     },
//   });

//   const product_update_form_onSubmit = (values: z.infer<typeof Product_Update_Schema>) => {
//     console.log("-- 產品更新輸入 -- : ", values, "-- End --");
//     setError("");
//     setSuccess("");

//     startTransition(async () => {
//       const result = await updateProduct_action(values);
//       if (result.error) {
//         setError(result.error);
//       } else {
//         setSuccess("產品更新成功");
//       }
//     });
//   };

//   console.log("GetProductDataById : ", GetProductDataById ," -- End -- ")

//   if (loading) {
//     return <p className="text-[#80A8BD] text-lg">正在加載...</p>;
//   }

//   if (error && !GetProductDataById) {
//     return <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>;
//   }

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <h2 className="text-xl font-bold tracking-tight text-[#80A8BD] mb-6">
//         編輯商品
//       </h2>
//       <Form {...product_update_form}>
//         <form onSubmit={product_update_form.handleSubmit(product_update_form_onSubmit)} className="space-y-6">
//           <FormError message={error} />
//           <FormSuccess message={success} />

//           {/* 隱藏的 productid 字段 */}
//           <FormField
//             control={product_update_form.control}
//             name="productid"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} value={ProductID} type="text" readOnly />
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />

//           {/* 商品名稱 */}
//           <FormField
//             control={product_update_form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-[#80A8BD] font-medium">商品名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder={GetProductDataById?.name || "輸入商品名稱"}
//                     type="text"
//                     className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300"
//                   />
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />

//           {/* 商品描述 */}
//           <FormField
//             control={product_update_form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-[#80A8BD] font-medium">商品描述</FormLabel>
//                 <FormControl>
//                   <textarea
//                     {...field}
//                     disabled={isPending}
//                     placeholder={GetProductDataById?.description || "輸入商品描述"}
//                     className="w-full border-[#80A8BD] rounded-md p-2 focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300 min-h-[100px]"
//                   />
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />

//           {/* 商品價格 */}
//           <FormField
//             control={product_update_form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-[#80A8BD] font-medium">
//                   價格: {GetProductDataById?.price?.toString() || "未設定"}
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder={GetProductDataById?.price?.toString() || "輸入價格"}
//                     type="number"
//                     value={field.value ?? ""}
//                     onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                     className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300"
//                   />
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />

//           <Button
//             disabled={isPending}
//             type="submit"
//             className="w-full bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50"
//           >
//             {isPending ? "正在提交..." : "更新產品"}
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default Product_Update_Form;


// app/[您的路徑]/Product_Update_Form.tsx

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
  Course_id: string;
  product_price_record_id: string;
}

// 輔助函數：格式化日期
const formatDateTime = (dateStr: string | undefined): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const Product_Update_Form = () => {
  const params = useParams<{ ProductDetailbyID: string }>();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);
  const ProductID = params?.ProductDetailbyID as string;

  // 更新類型為 Product[] | null 以匹配 API 回傳數據
  const [GetProductDataById, setGetProductDataById] = useState<Product[] | null>(null);

  const product_update_form = useForm<z.infer<typeof Product_Update_Schema>>({
    resolver: zodResolver(Product_Update_Schema),
    defaultValues: {
      productid: ProductID,
      name: "",
      description: "",
      price: 0,
    },
  });
  useEffect(() => {
    if (ProductID) {
      const fetchProductDetailById = async (id: string) => {
        setLoading(true);
        try {
          const res = await fetch(`/api/Product_detail_data_by_id/${id}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          if (!res.ok) {
            throw new Error("無法載入產品資料");
          }
          const result = await res.json();
          // 確保結果是陣列
          const productData = Array.isArray(result) ? result : [result];
          setGetProductDataById(productData);
          // 更新表單值（使用第一筆數據）
          if (productData[0]) {
            product_update_form.setValue("name", productData[0].name);
            product_update_form.setValue("description", productData[0].description);
            product_update_form.setValue("price", productData[0].price);
          }
        } catch (error) {
          console.error("載入錯誤:", error);
          setError("無法載入產品資料");
        } finally {
          setLoading(false);
        }
      };
      fetchProductDetailById(ProductID);
    }
  }, [ProductID, product_update_form]);



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

  console.log("GetProductDataById : ", GetProductDataById, " -- End -- ");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-[#80A8BD] text-lg">正在加載...</p>
      </div>
    );
  }

  if (error && !GetProductDataById) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* 新增：產品數據顯示區域 */}
        {GetProductDataById && GetProductDataById[0] ? (
          <div className="mb-8 border-b pb-6">
            <h2 className="text-2xl font-semibold text-[#80A8BD] mb-4">產品詳情</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-medium">商品名稱:</p>
                <p className="text-gray-800">{GetProductDataById[0].name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">商品描述:</p>
                <p className="text-gray-800">{GetProductDataById[0].description || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">價格:</p>
                <p className="text-gray-800">{GetProductDataById[0].price ?? "0"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">庫存:</p>
                <p className="text-gray-800">{GetProductDataById[0].stock ?? "0"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">創建時間:</p>
                <p className="text-gray-800">{formatDateTime(GetProductDataById[0].createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">更新時間:</p>
                <p className="text-gray-800">{formatDateTime(GetProductDataById[0].updatedAt)}</p>
              </div>
              {/* <div>
                <p className="text-gray-600 font-medium">課程 ID:</p>
                <p className="text-gray-800">{GetProductDataById[0].Course_id || "N/A"}</p>
              </div> */}
              {/* <div>
                <p className="text-gray-600 font-medium">價格記錄 ID:</p>
                <p className="text-gray-800">{GetProductDataById[0].product_price_record_id || "N/A"}</p>
              </div> */}
            </div>
          </div>
        ) : (
          <div className="mb-8 text-center">
            <p className="text-gray-600">無產品數據可顯示</p>
          </div>
        )}

        <h2 className="text-xl font-bold tracking-tight text-[#80A8BD] mb-6">
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
                  <FormLabel className="text-[#80A8BD] font-medium">商品名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={GetProductDataById?.[0]?.name || "輸入商品名稱"}
                      type="text"
                      className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300"
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
                  <FormLabel className="text-[#80A8BD] font-medium">商品描述</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      disabled={isPending}
                      placeholder={GetProductDataById?.[0]?.description || "輸入商品描述"}
                      className="w-full border-[#80A8BD] rounded-md p-2 focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300 min-h-[100px]"
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
                  <FormLabel className="text-[#80A8BD] font-medium">
                    價格: {GetProductDataById?.[0]?.price?.toString() || "未設定"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={GetProductDataById?.[0]?.price?.toString() || "輸入價格"}
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50"
            >
              {isPending ? "正在提交..." : "更新產品"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Product_Update_Form;