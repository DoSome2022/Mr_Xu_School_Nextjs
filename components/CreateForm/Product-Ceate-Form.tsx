// "use client";

// import * as z from "zod";
// import { useEffect, useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Product_Create_Schema } from "@/actions/Create-Product/schema";
// import { createProduct_action } from "@/actions/Create-Product";

// interface GetCourseData {
//   id: string;
//   course_name: string;
// }

// const Product_Create_Form = () => {
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [GetCourseData, setGetCourseData] = useState<GetCourseData[]>([]);

//   const product_register_form = useForm<z.infer<typeof Product_Create_Schema>>({
//     resolver: zodResolver(Product_Create_Schema),
//     defaultValues: {
//       name: "",
//       description: "",
//       price: 0,
//       product_price_record_id: "",
//       stock: 0,
//       Course_id: "",
//     },
//   });

//   const handleCourseChange = (courseName: string) => {
//     // 查找選中的課程
//     const selectedCourse = GetCourseData.find((data) => data.course_name === courseName);
//     // 更新 Course_id
//     if (selectedCourse) {
//       product_register_form.setValue("Course_id", selectedCourse.id, { shouldValidate: true });
//     } else {
//       product_register_form.setValue("Course_id", "", { shouldValidate: true });
//     }
//   };

//   const product_register_form_onSubmit = (values: z.infer<typeof Product_Create_Schema>) => {
//     console.log("-- product register輸入 -- : ", JSON.stringify(values, null, 2), "-- End --");
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       createProduct_action(values).then((data) => {
//         setError(data?.error);
//         setSuccess(data?.success);
//       });
//     });
//   };

//   useEffect(() => {
//     const fetchProductData = async () => {
//       const res = await fetch("/api/Course_Lists");
//       if (!res.ok) {
//         throw new Error("斷線！");
//       }
//       const result = await res.json();
//       setGetCourseData(result);
//     };
//     fetchProductData();
//   }, []);

//   console.log(" --GetCourseData -- :", GetCourseData, "-- End --");

//   return (
//     <>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       {success && <div className="text-green-500 mb-4">{success}</div>}
//       <Form {...product_register_form}>
//         <form
//           onSubmit={product_register_form.handleSubmit(product_register_form_onSubmit)}
//           className="space-y-6"
//         >
//           <div className="space-y-4">
//             <FormField
//               control={product_register_form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>商品名稱</FormLabel>
//                   <FormControl>
//                     <Select
//                       defaultValue={String(field.value)}
//                       onValueChange={(value) => {
//                         field.onChange(value); // 更新 name 字段
//                         handleCourseChange(value); // 更新 Course_id
//                       }}
//                     >
//                       <SelectTrigger>
//                         <SelectValue>{field.value || "選擇課程"}</SelectValue>
//                       </SelectTrigger>
//                       <SelectContent>
//                         {GetCourseData?.map((data) => (
//                           <SelectItem value={String(data.course_name)} key={data.id}>
//                             {data.course_name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="space-y-4" hidden>
//             <FormField
//               control={product_register_form.control}
//               name="Course_id"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Input {...field} type="hidden" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="space-y-4">
//             <FormField
//               control={product_register_form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>商品描述</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="商品描述"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="space-y-4">
//             <FormField
//               control={product_register_form.control}
//               name="stock"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>商品數量</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="商品數量"
//                       type="number"
//                       value={field.value ?? ""}
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="space-y-4">
//             <FormField
//               control={product_register_form.control}
//               name="price"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>錢</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="價錢"
//                       type="number"
//                       onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <Button disabled={isPending} type="submit">
//             建立
//           </Button>
//         </form>
//       </Form>
//     </>
//   );
// };

// export default Product_Create_Form;


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
import { Product_Create_Schema } from "@/actions/Create-Product/schema";
import { createProduct_action } from "@/actions/Create-Product";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

interface GetCourseData {
  id: string;
  course_name: string;
}

const Product_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [GetCourseData, setGetCourseData] = useState<GetCourseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const product_register_form = useForm<z.infer<typeof Product_Create_Schema>>({
    resolver: zodResolver(Product_Create_Schema),
    defaultValues: {
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
    product_register_form.setValue("Course_id", selectedCourse?.id || "", { shouldValidate: true });
    product_register_form.setValue("name", courseName, { shouldValidate: true });
  };

  // const product_register_form_onSubmit = (values: z.infer<typeof Product_Create_Schema>) => {
  //   setError("");
  //   setSuccess("");
  //   startTransition(() => {
  //     createProduct_action(values).then((data) => {
  //       if (data?.success) {
  //         setSuccess(data.success);
  //         product_register_form.reset();
  //       } else {
  //         setError(data?.error || "建立商品失敗");
  //       }
  //     });
  //   });
  // };
  const product_register_form_onSubmit = (values: z.infer<typeof Product_Create_Schema>) => {
  setError("");
  setSuccess("");
  startTransition(() => {
    createProduct_action(values).then((data) => {
      if (data?.success) {
        setSuccess(typeof data.success === "string" ? data.success : "商品創建成功");
        product_register_form.reset();
      } else {
        setError(data?.error || "建立商品失敗");
      }
    });
  });
};

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/Course_Lists");
        if (!res.ok) {
          throw new Error("無法載入課程資料");
        }
        const result = await res.json();
        setGetCourseData(Array.isArray(result) ? result : []);
      } catch (err: any) {
        console.error("載入錯誤:", err);
        setError("無法載入課程資料");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, []);

  if (loading) {
    return <p className="text-[#80A8BD] text-lg">正在加載...</p>;
  }

  if (error && !GetCourseData.length) {
    return <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold tracking-tight text-[#80A8BD] mb-6">
        建立新商品
      </h2>
      <Form {...product_register_form}>
        <form onSubmit={product_register_form.handleSubmit(product_register_form_onSubmit)} className="space-y-6">
          {/* <FormError message={error} />
          <FormSuccess message={success} />
          <div className="space-y-4">
            <FormField
              control={product_register_form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#80A8BD] font-medium">商品名稱</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleCourseChange(value);
                      }}
                      defaultValue={field.value}
                      disabled={isPending || GetCourseData.length === 0}
                    >
                      <SelectTrigger className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300">
                        <SelectValue placeholder="選擇課程作為商品名稱" />
                      </SelectTrigger>
                      <SelectContent>
                        {GetCourseData.length > 0 ? (
                          GetCourseData.map((data) => (
                            <SelectItem key={data.id} value={data.course_name}>
                              {data.course_name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="text-gray-500 px-4 py-2">無可用課程</div>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div> */}
          <FormError message={error} />
<FormSuccess
  message={typeof success === "string" ? success : success ? "商品創建成功" : undefined}
/>
<div className="space-y-4">
  <FormField
    control={product_register_form.control}
    name="name"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-[#80A8BD] font-medium">商品名稱</FormLabel>
        <FormControl>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              handleCourseChange(value);
            }}
            defaultValue={field.value}
            disabled={isPending || GetCourseData.length === 0}
          >
            <SelectTrigger className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300">
              <SelectValue placeholder="選擇課程作為商品名稱" />
            </SelectTrigger>
            <SelectContent>
              {GetCourseData.length > 0 ? (
                GetCourseData.map((data) => (
                  <SelectItem key={data.id} value={data.course_name}>
                    {data.course_name}
                  </SelectItem>
                ))
              ) : (
                <div className="text-gray-500 px-4 py-2">無可用課程</div>
              )}
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage className="text-red-500" />
      </FormItem>
    )}
  />
</div>
          <div className="space-y-4" hidden>
            <FormField
              control={product_register_form.control}
              name="Course_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={product_register_form.control}
              name="product_price_record_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={product_register_form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#80A8BD] font-medium">商品描述</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      disabled={isPending}
                      placeholder="輸入商品描述"
                      className="w-full border-[#80A8BD] rounded-md p-2 focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300 min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={product_register_form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#80A8BD] font-medium">商品數量</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入商品數量"
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={product_register_form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#80A8BD] font-medium">價格</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入價格"
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD] text-gray-900 transition-colors duration-300"
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
            className="w-full bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50"
          >
            {isPending ? "正在提交..." : "建立商品"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Product_Create_Form;