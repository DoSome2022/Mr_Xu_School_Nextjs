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
import { SupcreateProduct_action } from "@/actions/supadmin/Create-Product";
import { SupProduct_Create_Schema } from "@/actions/supadmin/Create-Product/schema";
import { useParams } from "next/navigation";

interface GetCourseData {
  id: string;
  course_name: string;
}

const Product_Create_Formbysupadmin = () => {
            const param = useParams();
        console.log("param :",  param ,"--end --"  )
        const supadminid = param?.supadminid as string;
        console.log("supadminid :", supadminid);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [GetCourseData, setGetCourseData] = useState<GetCourseData[]>([]);

  const product_register_form = useForm<z.infer<typeof SupProduct_Create_Schema>>({
    resolver: zodResolver(SupProduct_Create_Schema),
    defaultValues: {
      supadminid:supadminid,
      name: "",
      description: "",
      price: 0,
      product_price_record_id: "",
      stock: 0,
      Course_id: "",
    },
  });

  const handleCourseChange = (courseName: string) => {
    // 查找選中的課程
    const selectedCourse = GetCourseData.find((data) => data.course_name === courseName);
    // 更新 Course_id
    if (selectedCourse) {
      product_register_form.setValue("Course_id", selectedCourse.id, { shouldValidate: true });
    } else {
      product_register_form.setValue("Course_id", "", { shouldValidate: true });
    }
  };

  const product_register_form_onSubmit = (values: z.infer<typeof SupProduct_Create_Schema>) => {
    console.log("-- product register輸入 -- : ", JSON.stringify(values, null, 2), "-- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      SupcreateProduct_action(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const res = await fetch("/api/Course_Lists");
      if (!res.ok) {
        throw new Error("斷線！");
      }
      const result = await res.json();
      setGetCourseData(result);
    };
    fetchProductData();
  }, []);

  console.log(" --GetCourseData -- :", GetCourseData, "-- End --");

  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <Form {...product_register_form}>
        <form
          onSubmit={product_register_form.handleSubmit(product_register_form_onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={product_register_form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品名稱</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={String(field.value)}
                      onValueChange={(value) => {
                        field.onChange(value); // 更新 name 字段
                        handleCourseChange(value); // 更新 Course_id
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue>{field.value || "選擇課程"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {GetCourseData?.map((data) => (
                          <SelectItem value={String(data.course_name)} key={data.id}>
                            {data.course_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormLabel>商品描述</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="商品描述"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
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
                  <FormLabel>商品數量</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="商品數量"
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
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
                  <FormLabel>錢</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="價錢"
                      type="number"
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isPending} type="submit">
            建立
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Product_Create_Formbysupadmin;