"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
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

import { student_score_Create_Schema } from "@/actions/Create-Student_Score/schema";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { createStudentScore } from "@/actions/Create-Student_Score";
import { SWR_School_Year } from "../fatchdata/swrschool_year";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

interface Student_Score_Create_FormProps {
  studentId: string;
  data: StudentData[];
}

const Student_Score_Create_Form = ({ studentId, data }: Student_Score_Create_FormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const param = useParams();
  const router = useRouter();
  const parentId = param.parentdetailbyID as string;
  const [isPending, startTransition] = useTransition();

  const student_score_create_form = useForm<z.infer<typeof student_score_Create_Schema>>({
    resolver: zodResolver(student_score_Create_Schema),
    defaultValues: {
      parentId: parentId,
      subject: "",
      student_name: "",
      student_score_id: studentId,
      grade: 0,
      quarter: 0,
      score: 0,
      year: "",
      school: "",
      name: "",
      img: "",
    },
  });

  useEffect(() => {
    if (data && data[0] && data[0].name) {
      student_score_create_form.setValue("student_name", data[0]?.name);
    }
    if (data && data[0] && data[0].school) {
      student_score_create_form.setValue("school", data[0]?.school);
    }
  }, [data, student_score_create_form]);

  // 處理圖片/文件上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validExtensions = ["jpg", "jpeg", "png", "pdf"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        setError("僅支持 JPG、JPEG、PNG 或 PDF 格式");
        student_score_create_form.setError("img", { message: "僅支持 JPG、JPEG、PNG 或 PDF 格式" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("文件大小不能超過 5MB");
        student_score_create_form.setError("img", { message: "文件大小不能超過 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        student_score_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const student_score_create_form_onSubmit = (values: z.infer<typeof student_score_Create_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createStudentScore(values).then((data) => {
        if (data?.data) {
          setSuccess("學生成績記錄創建成功");
          toast.success("學生成績記錄創建成功");
          router.push(`/admin/userLists/parentsLists/${parentId}/studentLists/${studentId}/scoreLists/`);
          student_score_create_form.reset();
          setPreviewImage(null);
        } else {
          setError(data?.error || "創建學生成績記錄失敗，請檢查輸入數據或文件格式");
          toast.error(data?.error || "創建學生成績記錄失敗，請檢查輸入數據或文件格式");
        }
      }).catch((error) => {
        console.log("Unexpected error: ", error, "-- End --");
        setError("創建學生成績記錄失敗，發生未預期的錯誤");
        toast.error("創建學生成績記錄失敗，發生未預期的錯誤");
      });
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {success}
        </div>
      )}

      <Form {...student_score_create_form}>
        <form
          onSubmit={student_score_create_form.handleSubmit(student_score_create_form_onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={student_score_create_form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">檔案名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="檔案名稱"
                      className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={student_score_create_form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">科目</FormLabel>
                  <FormControl>
                    <SWR_School_Subject field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={student_score_create_form.control}
              name="student_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">學生名字</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="學生名字"
                      className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={student_score_create_form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">學校</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="學校"
                      className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={student_score_create_form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">年級</FormLabel>
                  <FormControl>
                    <SWR_School_Grade field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={student_score_create_form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">年份</FormLabel>
                  <FormControl>
                    <SWR_School_Year field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={student_score_create_form.control}
              name="quarter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">季度</FormLabel>
                  <FormControl>
                    <SWR_School_Quarter field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={student_score_create_form.control}
              name="img"
              render={() => (
                <FormItem>
                  <FormLabel className="text-gray-700">上傳文件</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      onChange={handleImageUpload}
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="block w-full text-sm text-gray-900 border border-[#80A8BD] rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              disabled={isPending}
              type="submit"
              className="bg-[#80A8BD] hover:bg-[#d9824c] text-white"
            >
              {isPending ? "處理中..." : "建立成績記錄"}
            </Button>
          </div>
        </form>
      </Form>

      {previewImage && (
        <div className="mt-6 p-4 border border-[#80A8BD] rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">預覽文件</h3>
          <div className="relative w-full h-64">
            {previewImage.startsWith("data:image/") ? (
              <Image
                src={previewImage}
                alt="預覽圖片"
                fill
                className="object-contain"
              />
            ) : (
              <p className="text-gray-500">已選擇 PDF 文件，無法預覽</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Student_Score_Create_Form;

// "use client";

// import * as z from "zod";
// import { useState, useEffect, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useParams } from "next/navigation";
// import Image from "next/image";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { 
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
// } from "@/components/ui/form";

// import { student_score_Create_Schema } from "@/actions/Create-Student_Score/schema";
// import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
// import { createStudentScore } from "@/actions/Create-Student_Score";
// import { SWR_School_Year } from "../fatchdata/swrschool_year";

// interface StudentData {
//     id: string;
//     name: string;
//     grade: number;
//     school: string;
// }

// interface Student_Score_Create_FormProps {
//     studentId: string;
//     data: StudentData[];
// }

// const Student_Score_Create_Form = ({ studentId, data }: Student_Score_Create_FormProps) => {
//     const [previewImage, setPreviewImage] = useState<string | null>(null);
//     const [error, setError] = useState<string | undefined>("");
//     const [success, setSuccess] = useState<string | undefined>("");
//     const param = useParams();
//     const parentId = param.parentdetailbyID as string;
//     const [isPending, startTransition] = useTransition();

//     const student_score_create_form = useForm<z.infer<typeof student_score_Create_Schema>>({
//         resolver: zodResolver(student_score_Create_Schema),
//         defaultValues: {
//             parentId: parentId,
//             subject: "",
//             student_name: "",
//             student_score_id: studentId,
//             grade: 0,
//             quarter: 0,
//             score: 0,
//             year: "",
//             school: "",
//             name: "",
//         }
//     });

//     useEffect(() => {
//         if (data && data[0] && data[0].name) {
//             student_score_create_form.setValue('student_name', data[0]?.name);
//         }
//         if (data && data[0] && data[0].school) {
//             student_score_create_form.setValue('school', data[0]?.school);
//         }
//     }, [data]);

//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             const file = e.target.files[0];
//             const reader = new FileReader();

//             reader.onload = () => {
//                 const base64String = reader.result as string;
//                 student_score_create_form.setValue("img", base64String);
//                 setPreviewImage(base64String);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const student_score_create_form_onSubmit = (values: z.infer<typeof student_score_Create_Schema>) => {
//         setError("");
//         setSuccess("");
//         startTransition(() => {
//             createStudentScore(values).then((data) => {
//                 setError(data?.error);
//                 setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
//             });
//         });
//     };

//     return (
//         <div className="space-y-6">
//             {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//                     {error}
//                 </div>
//             )}
//             {success && (
//                 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
//                     {success}
//                 </div>
//             )}

//             <Form {...student_score_create_form}>
//                 <form
//                     onSubmit={student_score_create_form.handleSubmit(student_score_create_form_onSubmit)}
//                     className="space-y-6"
//                 >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <FormField
//                             control={student_score_create_form.control}
//                             name="name"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-700">檔案名稱</FormLabel>
//                                     <FormControl>
//                                         <Input 
//                                             {...field}
//                                             disabled={isPending}
//                                             placeholder="檔案名稱"
//                                             className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD]"
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={student_score_create_form.control}
//                             name="subject"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-700">科目</FormLabel>
//                                     <FormControl>
//                                         <SWR_School_Subject field={field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={student_score_create_form.control}
//                             name="student_name"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-700">學生名字</FormLabel>
//                                     <FormControl>
//                                         <Input 
//                                             {...field}
//                                             disabled={isPending}
//                                             placeholder="學生名字"
//                                             className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD]"
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={student_score_create_form.control}
//                             name="school"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-700">學校</FormLabel>
//                                     <FormControl>
//                                         <Input 
//                                             {...field}
//                                             disabled={isPending}
//                                             placeholder="學校"
//                                             className="border-[#80A8BD] focus:border-[#80A8BD] focus:ring-[#80A8BD]"
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={student_score_create_form.control}
//                             name="grade"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-700">年級</FormLabel>
//                                     <FormControl>
//                                         <SWR_School_Grade field={field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={student_score_create_form.control}
//                             name="year"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-700">年份</FormLabel>
//                                     <FormControl>
//                                         <SWR_School_Year field={field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={student_score_create_form.control}
//                             name="quarter"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-700">季度</FormLabel>
//                                     <FormControl>
//                                         <SWR_School_Quarter field={field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={student_score_create_form.control}
//                             name="img"
//                             render={() => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-700">上傳圖片</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             disabled={isPending}
//                                             onChange={handleImageUpload}
//                                             type="file"
//                                             accept="image/*"
//                                             className="block w-full text-sm text-gray-900 border border-[#80A8BD] rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <div className="flex justify-end">
//                         <Button 
//                             disabled={isPending} 
//                             type="submit"
//                             className="bg-[#80A8BD] hover:bg-[#d9824c] text-white"
//                         >
//                             {isPending ? "處理中..." : "建立成績記錄"}
//                         </Button>
//                     </div>
//                 </form>
//             </Form>

//             {previewImage && (
//                 <div className="mt-6 p-4 border border-[#80A8BD] rounded-lg">
//                     <h3 className="text-lg font-medium text-gray-700 mb-2">預覽圖片</h3>
//                     <div className="relative w-full h-64">
//                         <Image
//                             src={previewImage}
//                             alt="預覽圖片"
//                             fill
//                             className="object-contain"
//                         />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Student_Score_Create_Form;