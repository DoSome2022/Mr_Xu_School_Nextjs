// "use client";

// import * as z from "zod";
// import { useState, useEffect, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
// import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
// import { Supstudent_booklist_Create_Schema } from "@/actions/supadmin/Create-Student_Booklist/schema";
// import { SupcreateStudentBookList } from "@/actions/supadmin/Create-Student_Booklist";

// interface StudentData {
//   id: string;
//   name: string;
//   grade: number;
//   school: string;
// }

// interface Student_BookList_Create_FormProps {
//   studentId: string;
//   data: StudentData[];
// }

// const Student_BookList_Create_Formbysupadmin = ({ studentId, data }: Student_BookList_Create_FormProps) => {
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition();
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   const form = useForm<z.infer<typeof Supstudent_booklist_Create_Schema>>({
//     resolver: zodResolver(Supstudent_booklist_Create_Schema),
//     defaultValues: {
//       studentId,
//       parentId: "",
//       name: "",
//       student_name: "",
//       year: "",
//       grade: 0,
//       img: "",
//       student_booklist_id: studentId,
//       school: "",
//     },
//   });

//   useEffect(() => {
//     if (data?.length > 0) {
//       form.setValue("student_name", data[0].name || "");
//       form.setValue("school", data[0].school || "");
//     }
//   }, [data, form]);

//   useEffect(() => {
//     return () => {
//       if (previewImage) {
//         URL.revokeObjectURL(previewImage);
//       }
//     };
//   }, [previewImage]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onload = () => {
//         const base64String = reader.result as string;
//         form.setValue("img", base64String);
//         setPreviewImage(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = (values: z.infer<typeof Supstudent_booklist_Create_Schema>) => {
//     if (process.env.NODE_ENV === "development") {
//       console.log("Create student_booklist:", values);
//     }
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       SupcreateStudentBookList(values).then((data) => {
//         setError(data?.error);
//         setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
//       });
//     });
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       {success && <div className="text-green-500 mb-4">{success}</div>}
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>檔案名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="檔案名稱"
//                     type="text"
//                     className="border-gray-300 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="school"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>學校</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="學校"
//                     type="text"
//                     className="border-gray-300 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="student_name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>學生名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="學生名稱"
//                     type="text"
//                     className="border-gray-300 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="year"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>年份</FormLabel>
//                 <FormControl>
//                   <SWR_School_Year field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="grade"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>年級</FormLabel>
//                 <FormControl>
//                   <SWR_School_Grade field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="img"
//             render={() => (
//               <FormItem>
//                 <FormLabel>上傳圖片</FormLabel>
//                 <FormControl>
//                   <Input
//                     disabled={isPending}
//                     onChange={handleImageUpload}
//                     type="file"
//                     accept="image/*"
//                     className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="student_booklist_id"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} type="text" value={studentId} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button
//             disabled={isPending}
//             type="submit"
//             className="bg-blue-600 text-white hover:bg-blue-700"
//           >
//             建立
//           </Button>
//         </form>
//       </Form>

//       {previewImage && (
//         <div className="relative mt-4 w-full h-64">
//           <Image
//             src={previewImage}
//             alt="預覽圖片"
//             fill
//             className="object-contain max-w-full h-auto rounded-lg shadow-md"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Student_BookList_Create_Formbysupadmin;

"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { Supstudent_booklist_Create_Schema } from "@/actions/supadmin/Create-Student_Booklist/schema";
import { SupcreateStudentBookList } from "@/actions/supadmin/Create-Student_Booklist";
import { toast } from "sonner";

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
  const router = useRouter();
  const params = useParams<{ supadminid: string; parentdetailbyID: string }>();

  // 驗證路由參數
  const supadminId = params?.supadminid;
  const parentId = params?.parentdetailbyID;

  if (!supadminId || !parentId) {
    return (
      <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg">
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
        錯誤：缺少必要的路由參數（supadminId 或 parentId）
      </div>
    );
  }

  const form = useForm<z.infer<typeof Supstudent_booklist_Create_Schema>>({
    resolver: zodResolver(Supstudent_booklist_Create_Schema),
    defaultValues: {
      studentId,
      parentId,
      supadminId,
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
      const validExtensions = ["jpg", "jpeg", "png", "pdf"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        setError("僅支持 JPG、JPEG、PNG 或 PDF 格式");
        form.setError("img", { message: "僅支持 JPG、JPEG、PNG 或 PDF 格式" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("文件大小不能超過 5MB");
        form.setError("img", { message: "文件大小不能超過 5MB" });
        return;
      }
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
        if (data?.fieldErrors) {
          Object.entries(data.fieldErrors).forEach(([field, errors]) => {
            form.setError(field as keyof z.infer<typeof Supstudent_booklist_Create_Schema>, {
              type: "manual",
              message: errors?.join(", ") || "字段錯誤",
            });
          });
          toast.error("表單驗證失敗，請檢查輸入");
        } else if (data?.error) {
          setError(data.error);
          toast.error(data.error);
        } else if (data?.data) {
          setSuccess("書單創建成功");
          toast.success("書單創建成功");
          router.push(
            `/supadmin/${supadminId}/userLists/parentsLists/${data.parentid || values.parentId}/studentLists/${studentId}/bookLists`
          );
          form.reset();
          setPreviewImage(null);
        }
      }).catch((error) => {
        console.error("Unexpected error:", error);
        setError("創建書單失敗，發生未預期的錯誤");
        toast.error("創建書單失敗，發生未預期的錯誤");
      });
    });
  };

  if (process.env.NODE_ENV === "development") {
    console.log("Form Errors:", form.formState.errors);
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-[#80A8BD] mb-4">創建書單</h2>
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#80A8BD]">檔案名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="檔案名稱"
                      type="text"
                      className="border-[#80A8BD] focus:ring-[#80A8BD]"
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
                  <FormLabel className="text-[#80A8BD]">學校</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="學校"
                      type="text"
                      className="border-[#80A8BD] focus:ring-[#80A8BD]"
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
                  <FormLabel className="text-[#80A8BD]">學生名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="學生名稱"
                      type="text"
                      className="border-[#80A8BD] focus:ring-[#80A8BD]"
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
                  <FormLabel className="text-[#80A8BD]">年份</FormLabel>
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
                  <FormLabel className="text-[#80A8BD]">年級</FormLabel>
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
                  <FormLabel className="text-[#80A8BD]">上傳文件</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      onChange={handleImageUpload}
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="block w-full text-sm text-gray-900 border border-[#80A8BD] rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#80A8BD]"
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
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input {...field} type="text" value={parentId} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supadminId"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input {...field} type="text" value={supadminId} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-800"
            >
              {isPending ? (
                <div className="flex items-center">
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  處理中...
                </div>
              ) : (
                "建立書單"
              )}
            </Button>
          </form>
        </Form>

        {previewImage && (
          <div className="mt-6 p-4 border border-[#80A8BD] rounded-lg">
            <h3 className="text-lg font-medium text-[#80A8BD] mb-2">文件預覽</h3>
            <div className="relative w-full h-64">
              {previewImage.startsWith("data:image/") ? (
                <Image
                  src={previewImage}
                  alt="預覽圖片"
                  fill
                  className="object-contain max-w-full h-auto rounded-md"
                />
              ) : (
                <p className="text-gray-500">已選擇 PDF 文件，無法預覽</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student_BookList_Create_Formbysupadmin;