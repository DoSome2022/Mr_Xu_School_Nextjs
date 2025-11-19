"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";
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
import { Ex_pager_Create_Schema } from "@/actions/Create-Ex_pager/schema";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Year } from "../fatchdata/swrschool_year";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import Image from "next/image";
import { createExPager } from "@/actions/Create-Ex_pager";

interface SchoolData {
  id: string;
  school_name: string;
}

interface EX_Pager_Create_FormProps {
  SchoolId: string;
  data: SchoolData[];
}

const EX_Pager_Create_Form = ({ SchoolId, data }: EX_Pager_Create_FormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  const ex_pager_create_form = useForm<z.infer<typeof Ex_pager_Create_Schema>>({
    resolver: zodResolver(Ex_pager_Create_Schema),
    defaultValues: {
      name: "",
      school_ex_pager_id: SchoolId,
      school_name: data[0]?.school_name || "",
      subject: "",
      year: "",
      grade: 0,
      quarter: 0,
      img: "",
    },
  });

  useEffect(() => {
    if (data[0]?.school_name) {
      ex_pager_create_form.setValue("school_name", data[0].school_name);
    }
  }, [data, ex_pager_create_form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validExtensions = ["jpg", "jpeg", "png", "pdf"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        setError("僅支持 JPG、JPEG、PNG 或 PDF 格式");
        ex_pager_create_form.setError("img", { message: "僅支持 JPG、JPEG、PNG 或 PDF 格式" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("文件大小不能超過 5MB");
        ex_pager_create_form.setError("img", { message: "文件大小不能超過 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        ex_pager_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const ex_pager_create_form_onSubmit = (values: z.infer<typeof Ex_pager_Create_Schema>) => {
    console.log("--  create ex_pager -- : ", values ,"-- End --")
    setError("");
    setSuccess("");
    startTransition(() => {
      createExPager(values).then((data) => {
        if (data?.success === "true" && data.data) {
          setSuccess("試卷創建成功");
          toast.success("試卷創建成功");
          // 刷新 SWR 緩存
          mutate(`/api/School_Lists`); // 假設 SWR 鍵，根據實際調整
          // 重定向
          router.push(`/admin/schoolLists/${SchoolId}/expageLists/`);
          ex_pager_create_form.reset();
          setPreviewImage(null);
        } else {
          setError(data?.error || "創建試卷失敗");
          toast.error(data?.error || "創建試卷失敗，請檢查輸入數據或文件格式");
        }
      });
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700">上傳試卷 - {data[0]?.school_name || "學校"}</h2>
      <Form {...ex_pager_create_form}>
        <form
          onSubmit={ex_pager_create_form.handleSubmit(ex_pager_create_form_onSubmit)}
          className="space-y-6"
        >
          <FormError message={error} />
          <FormSuccess message={success} />
          <FormField
            control={ex_pager_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">標題</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入試卷標題"
                    className="border-gray-300 focus:ring-[#80A8BD] focus:border-[#80A8BD] rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_pager_create_form.control}
            name="school_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">學校名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    placeholder={data[0]?.school_name || "學校名稱"}
                    className="border-gray-300 bg-gray-50 rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_pager_create_form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">科目</FormLabel>
                <FormControl>
                  <SWR_School_Subject field={field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_pager_create_form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">年份</FormLabel>
                <FormControl>
                  <SWR_School_Year field={field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_pager_create_form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">年級</FormLabel>
                <FormControl>
                  <SWR_School_Grade field={field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_pager_create_form.control}
            name="quarter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">季度</FormLabel>
                <FormControl>
                  <SWR_School_Quarter field={field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_pager_create_form.control}
            name="img"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">上傳試卷文件</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    disabled={isPending}
                    onChange={handleImageUpload}
                    accept="image/jpeg,image/png,application/pdf"
                    className="border-gray-300 rounded-md file:bg-[#80A8BD] file:text-white file:border-none file:rounded-md file:px-4 file:py-2 hover:file:bg-[#d17a4a]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_pager_create_form.control}
            name="school_ex_pager_id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} type="hidden" value={SchoolId} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#80A8BD] hover:bg-[#d17a4a] text-white rounded-md px-6 py-2"
          >
            {isPending ? "正在提交..." : "建立"}
          </Button>
        </form>
      </Form>
      {previewImage && (
        <div className="mt-6">
          <h3 className="text-gray-700 font-medium mb-2">文件預覽</h3>
          {previewImage.startsWith("data:image/") ? (
            <Image
              width={500}
              height={500}
              src={previewImage}
              alt="試卷預覽"
              className="rounded-md shadow-md"
            />
          ) : (
            <div className="text-gray-500">已選擇 PDF 文件，無法預覽</div>
          )}
        </div>
      )}
    </div>
  );
};

export default EX_Pager_Create_Form;