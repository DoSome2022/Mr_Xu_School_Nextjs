"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
import { Supstudent_ex_timetable_Create_Schema } from "@/actions/supadmin/Create-Student_Ex_timetable/schema";
import { SupcreateStudentExTimeTable } from "@/actions/supadmin/Create-Student_Ex_timetable";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

interface Student_EX_Time_Create_FormProps {
  studentId: string;
  data: StudentData[];
}

const Student_EX_Time_Create_Formbysupadmin = ({ studentId, data }: Student_EX_Time_Create_FormProps) => {
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const router = useRouter();
  const parentId = params?.parentdetailbyID;
  const supadminId = params?.supadminid;

  // 驗證路由參數
  if (!parentId || !studentId || !supadminId) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const ex_time_create_form = useForm<z.infer<typeof Supstudent_ex_timetable_Create_Schema>>({
    resolver: zodResolver(Supstudent_ex_timetable_Create_Schema),
    defaultValues: {
      parentId,
      name: "",
      student_name: "",
      school: "",
      subject: "",
      year: "",
      grade: 0,
      quarter: 0,
      student_ex_timetable_id: studentId,
      img: "",
      supadminId:supadminId,
    },
  });

  useEffect(() => {
    if (data && data[0]) {
      if (data[0].name) {
        ex_time_create_form.setValue("student_name", data[0].name);
      }
      if (data[0].school) {
        ex_time_create_form.setValue("school", data[0].school);
      }
      if (data[0].grade) {
        ex_time_create_form.setValue("grade", data[0].grade);
      }
    }
  }, [data, ex_time_create_form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        ex_time_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const ex_time_create_form_onSubmit = (values: z.infer<typeof Supstudent_ex_timetable_Create_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      // 轉換 subject（例如 "chinese" -> "中"）
      const normalizedValues = {
        ...values,
        subject: values.subject === "chinese" ? "中" : values.subject,
      };

      SupcreateStudentExTimeTable(normalizedValues).then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSuccess( "資料更新成功");
          // 提交成功後跳轉
          router.push(`/supadmin/${supadminId}/userLists/parentsLists/${parentId}/studentLists/${studentId}/extimeLists`);
        }
      });
    });
  };

  console.log("  Bug : ", ex_time_create_form.formState.errors, "-- Bug --")

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4">{success}</div>}
      <Form {...ex_time_create_form}>
        <form onSubmit={ex_time_create_form.handleSubmit(ex_time_create_form_onSubmit)} className="space-y-6">
          <FormField
            control={ex_time_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>檔案名稱</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="檔案名稱" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={ex_time_create_form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>學校</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="學校" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={ex_time_create_form.control}
            name="student_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>學生名稱</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="學生名稱" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={ex_time_create_form.control}
            name="student_ex_timetable_id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <input type="hidden" {...field} value={studentId} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={ex_time_create_form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>科目</FormLabel>
                <FormControl>
                  <SWR_School_Subject field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={ex_time_create_form.control}
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
            control={ex_time_create_form.control}
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
            control={ex_time_create_form.control}
            name="quarter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>季度</FormLabel>
                <FormControl>
                  <SWR_School_Quarter field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={ex_time_create_form.control}
            name="img"
            render={() => (
              <FormItem>
                <FormLabel>上傳圖片</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    onChange={handleImageUpload}
                    type="file"
                    accept="image/*,application/pdf" // 允許上傳 PDF 和圖片
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {previewImage && (
            <div className="mt-4">
              {previewImage.startsWith("data:application/pdf") ? (
                <p className="text-gray-600">已上傳 PDF 文件（無法預覽）</p>
              ) : (
                <Image
                  width={500}
                  height={500}
                  src={previewImage}
                  alt="預覽圖片"
                  className="w-full max-w-md rounded-lg"
                />
              )}
            </div>
          )}

          <Button disabled={isPending} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            建立
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Student_EX_Time_Create_Formbysupadmin;

// "use client";

// import * as z from "zod";
// import { useState, useEffect, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
// import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
// import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
// import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
// import { Supstudent_ex_timetable_Create_Schema } from "@/actions/supadmin/Create-Student_Ex_timetable/schema";
// import { SupcreateStudentExTimeTable } from "@/actions/supadmin/Create-Student_Ex_timetable";

// interface StudentData {
//   id: string;
//   name: string;
//   grade: number;
//   school: string;
// }

// interface Student_EX_Time_Create_FormProps {
//   studentId: string;
//   data: StudentData[];
// }

// const Student_EX_Time_Create_Formbysupadmin = ({ studentId, data }: Student_EX_Time_Create_FormProps) => {
//   const [isPending, startTransition] = useTransition();
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const params = useParams<{
//     supadminid: string;
//     parentdetailbyID: string;
//     studentdetailbyID: string;
//   }>();
//   const parentId = params?.parentdetailbyID;
//   const supadminId = params?.supadminid;

//   // 驗證路由參數
//   if (!parentId || !studentId || !supadminId) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         錯誤：缺少必要路由參數
//       </div>
//     );
//   }

//   const ex_time_create_form = useForm<z.infer<typeof Supstudent_ex_timetable_Create_Schema>>({
//     resolver: zodResolver(Supstudent_ex_timetable_Create_Schema),
//     defaultValues: {
//       parentId,
//       name: "",
//       student_name: "",
//       school: "",
//       subject: "",
//       year: "",
//       grade: 0,
//       quarter: 0,
//       student_ex_timetable_id: studentId,
//       img: "",
//     },
//   });

//   useEffect(() => {
//     if (data && data[0]) {
//       if (data[0].name) {
//         ex_time_create_form.setValue("student_name", data[0].name);
//       }
//       if (data[0].school) {
//         ex_time_create_form.setValue("school", data[0].school);
//       }
//       if (data[0].grade) {
//         ex_time_create_form.setValue("grade", data[0].grade);
//       }
//     }
//   }, [data, ex_time_create_form]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64String = reader.result as string;
//         ex_time_create_form.setValue("img", base64String);
//         setPreviewImage(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const ex_time_create_form_onSubmit = (values: z.infer<typeof Supstudent_ex_timetable_Create_Schema>) => {
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       SupcreateStudentExTimeTable(values).then((data) => {
//         setError(data?.error);
//         setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
//       });
//     });
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}
//       {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4">{success}</div>}
//       <Form {...ex_time_create_form}>
//         <form onSubmit={ex_time_create_form.handleSubmit(ex_time_create_form_onSubmit)} className="space-y-6">
//           <FormField
//             control={ex_time_create_form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>檔案名稱</FormLabel>
//                 <FormControl>
//                   <Input {...field} disabled={isPending} placeholder="檔案名稱" type="text" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={ex_time_create_form.control}
//             name="school"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>學校</FormLabel>
//                 <FormControl>
//                   <Input {...field} disabled={isPending} placeholder="學校" type="text" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={ex_time_create_form.control}
//             name="student_name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>學生名稱</FormLabel>
//                 <FormControl>
//                   <Input {...field} disabled={isPending} placeholder="學生名稱" type="text" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={ex_time_create_form.control}
//             name="student_ex_timetable_id"
//             render={({ field }) => (
//               <FormItem className="hidden">
//                 <FormControl>
//                   <input type="hidden" {...field} value={studentId} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={ex_time_create_form.control}
//             name="subject"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>科目</FormLabel>
//                 <FormControl>
//                   <SWR_School_Subject field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={ex_time_create_form.control}
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
//             control={ex_time_create_form.control}
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
//             control={ex_time_create_form.control}
//             name="quarter"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>季度</FormLabel>
//                 <FormControl>
//                   <SWR_School_Quarter field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={ex_time_create_form.control}
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
//                     className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
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
//               className="w-full max-w-md rounded-lg mt-4"
//             />
//           )}

//           <Button disabled={isPending} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
//             建立
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default Student_EX_Time_Create_Formbysupadmin;