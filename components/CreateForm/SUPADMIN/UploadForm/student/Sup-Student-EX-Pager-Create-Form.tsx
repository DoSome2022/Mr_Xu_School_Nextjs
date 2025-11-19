"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import { toast } from "sonner";
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";

import { useParams } from "next/navigation";
import { SupcreateStudentExPaper } from "@/actions/supadmin/Create-Student_Ex_pager";
import { Supstudent_ex_paper_Create_Schema } from "@/actions/supadmin/Create-Student_Ex_pager/schema";

interface SchoolData {
  id: string;
  school: string;
  name: string;
  grade: number;

}

interface EX_Pager_Create_FormProps {
  studentId: string;
  data: SchoolData[];
}

const Student_EX_Page_Create_Formbysupadminbysupadmin = ({ studentId, data }: EX_Pager_Create_FormProps) => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const supadminId = params?.supadminid;
  const parentId = params?.parentdetailbyID;
  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [studentName, setstudentName] = useState("");

  console.log(" data :" , data , "-- End --")

  useEffect(() => {
    if (data && data[0] && data[0].school && data[0].name) {
      setSchoolName(data[0].school);
      setstudentName(data[0].name);
      ex_pager_create_form.setValue("school", data[0].school);
      ex_pager_create_form.setValue("student_name", data[0].name);
        ex_pager_create_form.setValue("parentId",parentId );
    }
  }, [data]);

  const ex_pager_create_form = useForm<z.infer<typeof Supstudent_ex_paper_Create_Schema>>({
    resolver: zodResolver(Supstudent_ex_paper_Create_Schema),
    defaultValues: {
      supadminId: supadminId || "",
      name: "",
      student_ex_paper_id: studentId,
      school: schoolName,
      subject: "",
      year: "",
      grade: 0,
      quarter: 0,
      img: "",
      student_name: studentName,
      parentId: parentId,
    },
  });

  // 處理文件上傳
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        toast.error("僅支援 JPG、PNG 和 PDF 文件");
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

  const ex_pager_create_form_onSubmit = (values: z.infer<typeof Supstudent_ex_paper_Create_Schema>) => {
    console.log("-- create ex pager -- : ", values, "-- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      SupcreateStudentExPaper(values).then((data) => {
        if (data?.error) {
          setError(data.error);
          toast.error(data.error);
        }
        if (data?.success) {
          setSuccess(typeof data.success === "string" ? data.success : "考試試卷創建成功");
          toast.success(typeof data.success === "string" ? data.success : "考試試卷創建成功");
          // 跳轉頁面
          router.push(`/supadmin/${supadminId}/schoolLists/${studentId}/expageLists/`);
        }
      });
    });
  };

  console.log(" Bug  : " ,ex_pager_create_form.formState.errors , "-- End --" )

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {error && (
        <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          <svg
            className="h-5 w-5 text-red-500 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center bg-green-50 text-green-600 p-4 rounded-lg mb-4">
          <svg
            className="h-5 w-5 text-green-500 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {success}
        </div>
      )}

      <Form {...ex_pager_create_form}>
        <form onSubmit={ex_pager_create_form.handleSubmit(ex_pager_create_form_onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={ex_pager_create_form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#80A8BD]">標題</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入試卷標題"
                      type="text"
                      className="border-[#80A8BD] focus:ring-[#80A8BD]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {data.map((d) => (
            <div key={d.id} className="space-y-4">
              <FormField
                control={ex_pager_create_form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#80A8BD]">學校名稱</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={d.school}
                        defaultValue={d.school}
                        type="text"
                        disabled
                        className="border-[#80A8BD] focus:ring-[#80A8BD]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <div className="space-y-4">
            <FormField
              control={ex_pager_create_form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#80A8BD]">科目</FormLabel>
                  <FormControl>
                    <SWR_School_Subject field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={ex_pager_create_form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#80A8BD]">年份</FormLabel>
                  <FormControl>
                    <SWR_School_Year field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={ex_pager_create_form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#80A8BD]">年級</FormLabel>
                  <FormControl>
                    <SWR_School_Grade field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={ex_pager_create_form.control}
              name="quarter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#80A8BD]">季度</FormLabel>
                  <FormControl>
                    <SWR_School_Quarter field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={ex_pager_create_form.control}
              name="img"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel className="text-[#80A8BD]">上傳試卷</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="hidden"
                        className="block w-full text-sm text-gray-900 border border-[#80A8BD] rounded-lg focus:ring-[#80A8BD]"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        onChange={handleFileUpload}
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        className="block w-full text-sm text-gray-900 border border-[#80A8BD] rounded-lg cursor-pointer bg-gray-50 focus:ring-[#80A8BD]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="bg-[#80A8BD] hover:bg-cyan-200 text-white hover:text-gray-800 transition-colors duration-300"
          >
            {isPending ? (
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              "建立"
            )}
          </Button>
        </form>
      </Form>

      {previewImage && (
        <div className="mt-4">
          {previewImage.startsWith("data:application/pdf") ? (
            <iframe
              src={previewImage}
              title="試卷預覽"
              className="w-full h-96 rounded-md border border-[#80A8BD]"
            />
          ) : (
            <Image
              width={500}
              height={500}
              src={previewImage}
              alt="試卷預覽圖片"
              className="rounded-lg border border-[#80A8BD]"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Student_EX_Page_Create_Formbysupadminbysupadmin;


