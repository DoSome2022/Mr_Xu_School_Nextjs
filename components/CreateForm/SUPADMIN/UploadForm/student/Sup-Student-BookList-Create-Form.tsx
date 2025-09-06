"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { Supstudent_booklist_Create_Schema } from "@/actions/supadmin/Create-Student_Booklist/schema";
import { SupcreateStudentBookList } from "@/actions/supadmin/Create-Student_Booklist";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

interface Student_BookList_Create_FormProps {
  studentId: string;
  data: StudentData[];
}

const Student_BookList_Create_Formbysupadmin = ({ studentId, data }: Student_BookList_Create_FormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof Supstudent_booklist_Create_Schema>>({
    resolver: zodResolver(Supstudent_booklist_Create_Schema),
    defaultValues: {
      studentId,
      parentId: "",
      name: "",
      student_name: "",
      year: "",
      grade: 0,
      img: "",
      student_booklist_id: studentId,
      school: "",
    },
  });

  useEffect(() => {
    if (data?.length > 0) {
      form.setValue("student_name", data[0].name || "");
      form.setValue("school", data[0].school || "");
    }
  }, [data, form]);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof Supstudent_booklist_Create_Schema>) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Create student_booklist:", values);
    }
    setError("");
    setSuccess("");
    startTransition(() => {
      SupcreateStudentBookList(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>檔案名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="檔案名稱"
                    type="text"
                    className="border-gray-300 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>學校</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="學校"
                    type="text"
                    className="border-gray-300 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="student_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>學生名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="學生名稱"
                    type="text"
                    className="border-gray-300 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年份</FormLabel>
                <FormControl>
                  <SWR_School_Year field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年級</FormLabel>
                <FormControl>
                  <SWR_School_Grade field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="img"
            render={() => (
              <FormItem>
                <FormLabel>上傳圖片</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    onChange={handleImageUpload}
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="student_booklist_id"
            render={({ field }) => (
              <FormItem hidden>
                <FormControl>
                  <Input {...field} type="text" value={studentId} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            建立
          </Button>
        </form>
      </Form>

      {previewImage && (
        <div className="relative mt-4 w-full h-64">
          <Image
            src={previewImage}
            alt="預覽圖片"
            fill
            className="object-contain max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default Student_BookList_Create_Formbysupadmin;