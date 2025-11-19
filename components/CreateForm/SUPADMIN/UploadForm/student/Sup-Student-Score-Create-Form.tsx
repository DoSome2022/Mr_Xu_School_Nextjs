"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
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
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
import { Supstudent_score_Create_Schema } from "@/actions/supadmin/Create-Student_Score/schema";
import { SupcreateStudentScore } from "@/actions/supadmin/Create-Student_Score";

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

const Student_Score_Create_Formbysupadmin = ({ studentId, data }: Student_Score_Create_FormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const supadminId = params?.supadminid;
  const parentId = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;

  // 驗證路由參數
  if (!supadminId || !parentId || !StudentID) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const form = useForm<z.infer<typeof Supstudent_score_Create_Schema>>({
    resolver: zodResolver(Supstudent_score_Create_Schema),
    defaultValues: {
      parentId,
      student_score_id: studentId,
      student_name: "",
      school: "",
      name: "",
      subject: "",
      grade: 0,
      year: "",
      quarter: 0,
      score: 0,
      img: "",
      supadminId:supadminId,
    },
  });

  useEffect(() => {
    if (data && data[0] && data[0].name && data[0].school) {
      form.setValue("student_name", data[0].name);
      form.setValue("school", data[0].school);
      form.setValue("supadminId", supadminId);
    }
    
  }, [data, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        setError("僅支援 JPG、PNG 和 PDF 文件");
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

  const onSubmit = (values: z.infer<typeof Supstudent_score_Create_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      SupcreateStudentScore(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (data?.success) {
          setSuccess(typeof data?.success === "string" ? data?.success : "資料更新成功");
          form.reset();
          setPreviewImage(null);
          router.push(`/supadmin/${supadminId}/userLists/parentsLists/${parentId}/studentLists/${studentId}/scoreLists`);
        }
      });
    });
  };

  console.log(" Bug : ",form.formState.errors,"-- End --" )

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">檔案名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入檔案名稱"
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">科目</FormLabel>
                <FormControl>
                  <SWR_School_Subject field={field} />
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
                <FormLabel className="text-blue-600">學生姓名</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    placeholder="學生姓名"
                    className="border-blue-300 focus:border-blue-500"
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
                <FormLabel className="text-blue-600">學校</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    placeholder="學校"
                    className="border-blue-300 focus:border-blue-500"
                  />
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
                <FormLabel className="text-blue-600">年級</FormLabel>
                <FormControl>
                  <SWR_School_Grade field={field} />
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
                <FormLabel className="text-blue-600">學年</FormLabel>
                <FormControl>
                  <SWR_School_Year field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quarter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">季度</FormLabel>
                <FormControl>
                  <SWR_School_Quarter field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">分數</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入分數 (0-100)"
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border-blue-300 focus:border-blue-500"
                  />
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
                <FormLabel className="text-blue-600">上傳成績圖片</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    onChange={handleImageUpload}
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {previewImage && (
            previewImage.startsWith("data:application/pdf") ? (
              <p className="mt-4 text-gray-600">已上傳 PDF 文件（無法預覽）</p>
            ) : (
              <Image
                width={500}
                height={500}
                src={previewImage}
                alt="成績圖片預覽"
                className="object-contain rounded-lg max-w-full h-auto mt-4"
              />
            )
          )}

          <Button
            disabled={isPending}
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? "提交中..." : "建立成績"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Student_Score_Create_Formbysupadmin;


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
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
// import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
// import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
// import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
// import { Supstudent_score_Create_Schema } from "@/actions/supadmin/Create-Student_Score/schema";
// import { SupcreateStudentScore } from "@/actions/supadmin/Create-Student_Score";

// interface StudentData {
//   id: string;
//   name: string;
//   grade: number;
//   school: string;
// }

// interface Student_Score_Create_FormProps {
//   studentId: string;
//   data: StudentData[];
// }

// const Student_Score_Create_Formbysupadmin = ({ studentId, data }: Student_Score_Create_FormProps) => {
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition();

//   const params = useParams<{
//     supadminid: string;
//     parentdetailbyID: string;
//     studentdetailbyID: string;
//   }>();
//   const supadminId = params?.supadminid;
//   const parentId = params?.parentdetailbyID;
//     const StudentID = params?.studentdetailbyID;

//   // 驗證路由參數
//   if (!supadminId || !parentId || !StudentID) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         錯誤：缺少必要路由參數
//       </div>
//     );
//   }

//   const form = useForm<z.infer<typeof Supstudent_score_Create_Schema>>({
//     resolver: zodResolver(Supstudent_score_Create_Schema),
//     defaultValues: {
//       parentId,
//       student_score_id: studentId,
//       student_name: "",
//       school: "",
//       name: "",
//       subject: "",
//       grade: 0,
//       year: "",
//       quarter: 0,
//       score: 0,
//       img: "",
//     },
//   });

//   useEffect(() => {
//     if (data && data[0] && data[0].name && data[0].school) {
//       form.setValue("student_name", data[0].name);
//       form.setValue("school", data[0].school);
//     }
//   }, [data, form]);

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

//   const onSubmit = (values: z.infer<typeof Supstudent_score_Create_Schema>) => {
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       SupcreateStudentScore(values).then((data) => {
//         setError(data?.error);
//         setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
//       });
//     });
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       {success && <div className="text-green-500 mb-4">{success}</div>}
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">檔案名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入檔案名稱"
//                     className="border-blue-300 focus:border-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="subject"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">科目</FormLabel>
//                 <FormControl>
//                   <SWR_School_Subject field={field} />
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
//                 <FormLabel className="text-blue-600">學生姓名</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={true}
//                     placeholder="學生姓名"
//                     className="border-blue-300 focus:border-blue-500"
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
//                 <FormLabel className="text-blue-600">學校</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={true}
//                     placeholder="學校"
//                     className="border-blue-300 focus:border-blue-500"
//                   />
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
//                 <FormLabel className="text-blue-600">年級</FormLabel>
//                 <FormControl>
//                   <SWR_School_Grade field={field} />
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
//                 <FormLabel className="text-blue-600">學年</FormLabel>
//                 <FormControl>
//                   <SWR_School_Year field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
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
//             control={form.control}
//             name="score"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">分數</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入分數 (0-100)"
//                     type="number"
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                     className="border-blue-300 focus:border-blue-500"
//                   />
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
//                 <FormLabel className="text-blue-600">上傳成績圖片</FormLabel>
//                 <FormControl>
//                   <Input
//                     disabled={isPending}
//                     onChange={handleImageUpload}
//                     type="file"
//                     accept="image/*"
//                     className="border-blue-300 focus:border-blue-500"
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
//               alt="成績圖片預覽"
//               className="object-contain rounded-lg max-w-full h-auto mt-4"
//             />
//           )}

//           <Button
//             disabled={isPending}
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             {isPending ? "提交中..." : "建立成績"}
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default Student_Score_Create_Formbysupadmin;