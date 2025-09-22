"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";
import Image from "next/image";
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
import { School_timetable_Create_Schema } from "@/actions/Create-School_Timetable/schema";
import { SWR_School_Year } from "../fatchdata/swrschool_year";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { createSchoolTimeTable } from "@/actions/Create-School_Timetable";

interface SchoolData {
  id: string;
  school_name: string;
}

interface SchoolTimeTable_Create_FormProps {
  SchoolId: string;
  data: SchoolData[];
}

const SchoolTimeTable_Create_Form = ({ SchoolId, data }: SchoolTimeTable_Create_FormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  const schooltimetable_create_form = useForm<z.infer<typeof School_timetable_Create_Schema>>({
    resolver: zodResolver(School_timetable_Create_Schema),
    defaultValues: {
      name: "",
      school_name: data[0]?.school_name || "",
      year: "",
      school_school_timetable_id: SchoolId,
      img: "",
      grade: 0,
      quarter: 0,
    },
  });

  useEffect(() => {
    if (data[0]?.school_name) {
      schooltimetable_create_form.setValue("school_name", data[0].school_name);
    }
  }, [data, schooltimetable_create_form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validExtensions = ["jpg", "jpeg", "png", "pdf"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        setError("僅支持 JPG、JPEG、PNG 或 PDF 格式");
        schooltimetable_create_form.setError("img", { message: "僅支持 JPG、JPEG、PNG 或 PDF 格式" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("文件大小不能超過 5MB");
        schooltimetable_create_form.setError("img", { message: "文件大小不能超過 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        schooltimetable_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const schooltimetable_create_form_onSubmit = (values: z.infer<typeof School_timetable_Create_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createSchoolTimeTable(values).then((data) => {
        if (data?.success === "true" && data.data) {
          setSuccess("學校時間表創建成功");
          toast.success("學校時間表創建成功");
          // 刷新 SWR 緩存
          mutate(`/api/School_Lists`); // 假設 SWR 鍵，根據實際調整
          // 重定向
          router.push(`/admin/schoolLists/${SchoolId}/schooltimetableLists/`);
          schooltimetable_create_form.reset();
          setPreviewImage(null);
        } else {
          setError(data?.error || "創建學校時間表失敗");
          toast.error(data?.error || "創建學校時間表失敗，請檢查輸入數據或文件格式");
        }
      });
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700">上傳學校時間表 - {data[0]?.school_name || "學校"}</h2>
      <Form {...schooltimetable_create_form}>
        <form
          onSubmit={schooltimetable_create_form.handleSubmit(schooltimetable_create_form_onSubmit)}
          className="space-y-6"
        >
          <div className="text-red-500 text-sm">{error}</div>
          <div className="text-green-500 text-sm">{success}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={schooltimetable_create_form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">標題</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="時間表標題"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#80A8BD] focus:border-[#80A8BD]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={schooltimetable_create_form.control}
              name="school_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">學校名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      placeholder={data[0]?.school_name || "學校名稱"}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={schooltimetable_create_form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">年份</FormLabel>
                  <FormControl>
                    <SWR_School_Year field={field} disabled={isPending} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={schooltimetable_create_form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">年級</FormLabel>
                  <FormControl>
                    <SWR_School_Grade field={field} disabled={isPending} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={schooltimetable_create_form.control}
              name="quarter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">季度</FormLabel>
                  <FormControl>
                    <SWR_School_Quarter field={field} disabled={isPending} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={schooltimetable_create_form.control}
            name="school_school_timetable_id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} type="hidden" value={SchoolId} />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={schooltimetable_create_form.control}
            name="img"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">時間表文件</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    disabled={isPending}
                    onChange={handleImageUpload}
                    accept="image/jpeg,image/png,application/pdf"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#80A8BD] file:text-white hover:file:bg-[#d17a4a]"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#80A8BD] hover:bg-[#d17a4a] text-white rounded-md px-4 py-2"
            >
              {isPending ? "正在提交..." : "建立時間表"}
            </Button>
          </div>
        </form>
      </Form>
      {previewImage && (
        <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">文件預覽</h3>
          {previewImage.startsWith("data:image/") ? (
            <Image
              width={800}
              height={600}
              src={previewImage}
              alt="時間表預覽"
              className="max-w-full h-auto rounded-md"
            />
          ) : (
            <div className="text-gray-500">已選擇 PDF 文件，無法預覽</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolTimeTable_Create_Form;