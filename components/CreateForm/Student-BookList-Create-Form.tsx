"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SWR_School_Year } from "../fatchdata/swrschool_year";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { student_booklist_Create_Schema } from "@/actions/Create-Student_Booklist/schema";
import { createStudentBookList } from "@/actions/Create-Student_Booklist";

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

const Student_BookList_Create_Form = ({ studentId, data }: Student_BookList_Create_FormProps) => {
  console.log("-- Student Data _form: --", data, "-- end --");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const param = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const studentid = param.studentdetailbyID as string;
  const parentid = param.parentdetailbyID as string;

  console.log("params: ", param);

  const student_booklist_create_form = useForm<z.infer<typeof student_booklist_Create_Schema>>({
    resolver: zodResolver(student_booklist_Create_Schema),
    defaultValues: {
      studentId: studentid,
      parentId: parentid,
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
    if (data && data[0] && data[0].name) {
      student_booklist_create_form.setValue("student_name", data[0].name);
    }
    if (data && data[0] && data[0].school) {
      student_booklist_create_form.setValue("school", data[0].school);
    }
  }, [data, student_booklist_create_form]);

  // 處理圖片上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        student_booklist_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const student_booklist_create_form_onSubmit = (
    values: z.infer<typeof student_booklist_Create_Schema>
  ) => {
    console.log("-- create student_booklist -- : ", values, "-- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      createStudentBookList(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <div className="border border-gray-200 rounded p-6 bg-white shadow-sm">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <Form {...student_booklist_create_form}>
        <form
          onSubmit={student_booklist_create_form.handleSubmit(student_booklist_create_form_onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={student_booklist_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">檔案名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="請輸入檔案名稱"
                    type="text"
                    className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">學校</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    placeholder="學校"
                    value={data[0]?.school || ""}
                    type="text"
                    className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
            name="student_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">學生名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    placeholder="學生名稱"
                    type="text"
                    className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
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

          <FormField
            control={student_booklist_create_form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">年份</FormLabel>
                <FormControl>
                  <SWR_School_Year field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">年級</FormLabel>
                <FormControl>
                  <SWR_School_Grade field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
            name="img"
            render={() => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">上傳圖片</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    onChange={handleImageUpload}
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:border-[#e7915b] focus:ring-[#e7915b]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            className="bg-[#e7915b] hover:bg-cyan-200 text-white hover:text-[#e7915b] transition-colors duration-300"
          >
            建立
          </Button>
        </form>

        {previewImage && (
          <div className="mt-6">
            <p className="text-[#e7915b] font-medium mb-2">圖片預覽</p>
            <Image
              width={500}
              height={500}
              src={previewImage}
              alt="書單圖片預覽"
              className="rounded-md object-cover max-w-full h-auto"
            />
          </div>
        )}
      </Form>
    </div>
  );
};

export default Student_BookList_Create_Form;