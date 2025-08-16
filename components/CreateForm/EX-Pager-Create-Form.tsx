"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
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
  const [PreviewImage, setPreviewImage] = useState<string | null>(null);
  const [SchoolName, setSchoolName] = useState("");

  useEffect(() => {
    if (data && data[0] && data[0].school_name) {
      setSchoolName(data[0].school_name);
      ex_pager_create_form.setValue("school_name", data[0].school_name);
    }
  }, [data]);

  const ex_pager_create_form = useForm<z.infer<typeof Ex_pager_Create_Schema>>({
    resolver: zodResolver(Ex_pager_Create_Schema),
    defaultValues: {
      name: "",
      school_ex_pager_id: SchoolId,
      school_name: SchoolName,
      subject: "",
      year: "",
      grade: 0,
      quarter: 0,
      img: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        ex_pager_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const ex_pager_create_form_onSubmit = (
    values: z.infer<typeof Ex_pager_Create_Schema>
  ) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createExPager(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <div className="space-y-6">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}

      <Form {...ex_pager_create_form}>
        <form
          onSubmit={ex_pager_create_form.handleSubmit(ex_pager_create_form_onSubmit)}
          className="space-y-6"
        >
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
                    className="border-gray-300 focus:ring-[#e7915b] focus:border-[#e7915b] rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {data.map((d) => (
            <FormField
              key={d.id}
              control={ex_pager_create_form.control}
              name="school_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">學校名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={d.school_name}
                      defaultValue={d.school_name}
                      disabled
                      className="border-gray-300 bg-gray-50 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={ex_pager_create_form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">科目</FormLabel>
                <FormControl>
                  <SWR_School_Subject field={field} />
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
                  <SWR_School_Year field={field} />
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
                  <SWR_School_Grade field={field} />
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
                  <SWR_School_Quarter field={field} />
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
                <FormLabel className="text-gray-700 font-medium">上傳試卷圖片</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    disabled={isPending}
                    onChange={handleImageUpload}
                    className="border-gray-300 rounded-md file:bg-[#e7915b] file:text-white file:border-none file:rounded-md file:px-4 file:py-2 hover:file:bg-[#d17a4a]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            className="bg-[#e7915b] hover:bg-[#d17a4a] text-white rounded-md px-6 py-2"
          >
            建立
          </Button>
        </form>
      </Form>

      {PreviewImage && (
        <div className="mt-6">
          <h3 className="text-gray-700 font-medium mb-2">圖片預覽</h3>
          <Image
            width={500}
            height={500}
            src={PreviewImage}
            alt="試卷預覽"
            className="rounded-md shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default EX_Pager_Create_Form;