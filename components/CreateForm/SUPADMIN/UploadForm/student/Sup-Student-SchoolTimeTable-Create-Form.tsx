"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
import { Supstudent_school_timetable_Create_Schema } from "@/actions/supadmin/Create-Student_school_Timetable/schema";
import { SupcreateStudentSchoolTimetable } from "@/actions/supadmin/Create-Student_school_Timetable";
import { toast } from "sonner";
import { Document, Page, pdfjs } from "react-pdf";

// 配置 PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.min.js`;

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

interface Student_SchoolTimeTable_Create_FormProps {
  studentId: string;
  data: StudentData[];
}

const Student_SchoolTimeTable_Create_Formbysupadmin = ({ studentId, data }: Student_SchoolTimeTable_Create_FormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ parentdetailbyID: string , supadminid: string }>();
  const router = useRouter();
  const parentId = params?.parentdetailbyID;
  const supadminId = params?.supadminid

  // 驗證路由參數
  if (!parentId || !studentId) {
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
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const schooltimetable_create_form = useForm<z.infer<typeof Supstudent_school_timetable_Create_Schema>>({
    resolver: zodResolver(Supstudent_school_timetable_Create_Schema),
    defaultValues: {
      name: "",
      student_name: "",
      year: "",
      student_school_timetable_id: studentId,
      img: "",
      grade: 0,
      quarter: 0,
      school: "",
      parentId: parentId,
      supadminId:supadminId,
    },
  });

  useEffect(() => {
    if (data?.length > 0 && data[0]?.name) {
      schooltimetable_create_form.setValue("student_name", data[0].name);
      schooltimetable_create_form.setValue("school", data[0].school);
    }
  }, [data, schooltimetable_create_form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        schooltimetable_create_form.setValue("img", base64String);
        setPreviewUrl(URL.createObjectURL(file));
        setIsPdf(file.type === "application/pdf");
      };
      reader.readAsDataURL(file);
    }
  };

  const schooltimetable_create_form_onSubmit = (values: z.infer<typeof Supstudent_school_timetable_Create_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      SupcreateStudentSchoolTimetable(values).then((data) => {
        if (data?.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setSuccess("時間表建立成功");
          toast.success(data?.success || "時間表建立成功");
          schooltimetable_create_form.reset();
          setPreviewUrl(null);
          setIsPdf(false);
          router.push(`/supadmin/${supadminId}/userLists/parentsLists/${parentId}/studentLists/${studentId}/schooltimetableLists/`);
        }
      });
    });
  };

  console.log(" Bug : " ,schooltimetable_create_form.formState.errors , " -- End -- " )

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-[#80A8BD] mb-4">建立學校時間表</h2>
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
      <Form {...schooltimetable_create_form}>
        <form
          onSubmit={schooltimetable_create_form.handleSubmit(schooltimetable_create_form_onSubmit)}
          className="space-y-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
        >
          <FormField
            control={schooltimetable_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD]">檔案名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="請輸入檔案名稱"
                    type="text"
                    className="border-[#80A8BD] focus:ring-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={schooltimetable_create_form.control}
            name="student_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD]">學生名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
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
            control={schooltimetable_create_form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD]">學校名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    placeholder="學校名稱"
                    type="text"
                    className="border-[#80A8BD] focus:ring-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={schooltimetable_create_form.control}
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
            control={schooltimetable_create_form.control}
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
            control={schooltimetable_create_form.control}
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

          <FormField
            control={schooltimetable_create_form.control}
            name="img"
            render={() => (
              <FormItem>
                <FormLabel className="text-[#80A8BD]">上傳文件（圖片或 PDF）</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    onChange={handleImageUpload}
                    type="file"
                    accept="image/*,application/pdf"
                    className="border-[#80A8BD] focus:ring-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {previewUrl && (
            isPdf ? (
              <div className="mt-4">
                <Document
                  file={previewUrl}
                  onLoadError={(error) => {
                    console.error("PDF 預覽失敗:", error);
                    toast.error("無法載入 PDF 預覽");
                  }}
                >
                  <Page pageNumber={1} width={500} className="rounded-md shadow-sm" />
                </Document>
              </div>
            ) : (
              <Image
                width={500}
                height={500}
                src={previewUrl}
                alt="預覽文件"
                className="object-contain rounded-lg max-w-full h-auto mt-4"
              />
            )
          )}

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
    </div>
  );
};

export default Student_SchoolTimeTable_Create_Formbysupadmin;

// "use client";

// import * as z from "zod";
// import { useState, useEffect, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useParams } from "next/navigation";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
// import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
// import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
// import { Supstudent_school_timetable_Create_Schema } from "@/actions/supadmin/Create-Student_school_Timetable/schema";
// import { SupcreateStudentSchoolTimetable } from "@/actions/supadmin/Create-Student_school_Timetable";

// interface StudentData {
//   id: string;
//   name: string;
//   grade: number;
//   school: string;
// }

// interface Student_SchoolTimeTable_Create_FormProps {
//   studentId: string;
//   data: StudentData[];
// }

// const Student_SchoolTimeTable_Create_Formbysupadmin = ({ studentId, data }: Student_SchoolTimeTable_Create_FormProps) => {
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition();
//   const params = useParams<{ parentdetailbyID: string }>();
//   const parentId = params?.parentdetailbyID;

//   // 驗證路由參數
//   if (!parentId || !studentId) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         錯誤：缺少必要路由參數
//       </div>
//     );
//   }

//   const schooltimetable_create_form = useForm<z.infer<typeof Supstudent_school_timetable_Create_Schema>>({
//     resolver: zodResolver(Supstudent_school_timetable_Create_Schema),
//     defaultValues: {
//       name: "",
//       student_name: "",
//       year: "",
//       student_school_timetable_id: studentId,
//       img: "",
//       grade: 0,
//       quarter: 0,
//       school: "",
//       parentId: parentId,
//     },
//   });

//   useEffect(() => {
//     if (data?.length > 0 && data[0]?.name) {
//       schooltimetable_create_form.setValue("student_name", data[0].name);
//       schooltimetable_create_form.setValue("school", data[0].school);
//     }
//   }, [data, schooltimetable_create_form]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64String = reader.result as string;
//         schooltimetable_create_form.setValue("img", base64String);
//         setPreviewImage(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const schooltimetable_create_form_onSubmit = (values: z.infer<typeof Supstudent_school_timetable_Create_Schema>) => {
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       SupcreateStudentSchoolTimetable(values).then((data) => {
//         setError(data?.error);
//         setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
//         if (data?.success) {
//           schooltimetable_create_form.reset();
//           setPreviewImage(null);
//         }
//       });
//     });
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
//       {error && <div className="text-red-600 bg-red-50 p-2 rounded-lg mb-4">{error}</div>}
//       {success && <div className="text-green-600 bg-green-50 p-2 rounded-lg mb-4">{success}</div>}
//       <Form {...schooltimetable_create_form}>
//         <form onSubmit={schooltimetable_create_form.handleSubmit(schooltimetable_create_form_onSubmit)} className="space-y-6">
//           <FormField
//             control={schooltimetable_create_form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">檔案名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="請輸入檔案名稱"
//                     type="text"
//                     className="border-blue-300 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={schooltimetable_create_form.control}
//             name="student_name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">學生名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={true}
//                     placeholder="學生名稱"
//                     type="text"
//                     className="border-blue-300 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={schooltimetable_create_form.control}
//             name="school"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">學校名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={true}
//                     placeholder="學校名稱"
//                     type="text"
//                     className="border-blue-300 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={schooltimetable_create_form.control}
//             name="year"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">年份</FormLabel>
//                 <FormControl>
//                   <SWR_School_Year field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={schooltimetable_create_form.control}
//             name="grade"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">年級</FormLabel>
//                 <FormControl>
//                   <SWR_School_Grade field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={schooltimetable_create_form.control}
//             name="quarter"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">季度</FormLabel>
//                 <FormControl>
//                   <SWR_School_Quarter field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={schooltimetable_create_form.control}
//             name="img"
//             render={() => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">上傳圖片</FormLabel>
//                 <FormControl>
//                   <Input
//                     disabled={isPending}
//                     onChange={handleImageUpload}
//                     type="file"
//                     accept="image/*"
//                     className="border-blue-300 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {previewImage && (
//             <Image
//               width={500}
//               height={500}
//               src={previewImage}
//               alt="預覽圖片"
//               className="object-contain rounded-lg max-w-full h-auto mt-4"
//             />
//           )}

//           <Button
//             disabled={isPending}
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             建立
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default Student_SchoolTimeTable_Create_Formbysupadmin;