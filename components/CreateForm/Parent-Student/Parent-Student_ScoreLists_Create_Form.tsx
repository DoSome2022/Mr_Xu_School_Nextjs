// "use client";

// import * as z from "zod";
// import { useState, useEffect, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
// import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
// import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
// import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
// import { parent_student_score_create_schema } from "@/actions/Create-Parent_Student_Score/schema";
// import { createParentStudentScore } from "@/actions/Create-Parent_Student_Score";

// const Parent_Student_ScoreLists_Create_Form = () => {
//   const [isPending, startTransition] = useTransition();
//   const params = useParams();
//   const ParentID = params?.parentId as string;
//   const StudentID = params?.studentid as string;

//   const [GetStudentData, setGetStudentData] = useState<any[]>([]);
//   const [GetSchoolData, setGetSchoolData] = useState<any[]>([]);
//   const [fileBase64, setFileBase64] = useState<string>("");
//   const [originalFileName, setOriginalFileName] = useState<string>("");

//   const parent_student_scorelists_create_form = useForm<
//     z.infer<typeof parent_student_score_create_schema>
//   >({
//     resolver: zodResolver(parent_student_score_create_schema),
//     defaultValues: {
//       parentid: ParentID,
//       name: "",
//       student_score_id: StudentID,
//       student_name: "",
//       grade: 0,
//       year: "",
//       school: "",
//       img: "",
//       subject: "",
//       score: 0,
//       quarter: 0,
//       originalFileName: "",
//     },
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setOriginalFileName(file.name);
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const base64String = event.target?.result as string;
//         setFileBase64(base64String);
//         parent_student_scorelists_create_form.setValue("img", base64String);
//         parent_student_scorelists_create_form.setValue("originalFileName", file.name);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const parent_student_scorelists_create_onSubmit = (
//     values: z.infer<typeof parent_student_score_create_schema>
//   ) => {
//     startTransition(async () => {
//       try {
//         await createParentStudentScore(values);
//         parent_student_scorelists_create_form.reset();
//         setFileBase64("");
//         setOriginalFileName("");
//       } catch (error) {
//         console.error("Upload failed:", error);
//       }
//     });
//   };

//   useEffect(() => {
//     const fetchSchoolData = async () => {
//       const res = await fetch(`/api/School_Lists/`);
//       if (!res.ok) throw new Error("Network error!");
//       const result = await res.json();
//       setGetSchoolData(result);
//     };
//     fetchSchoolData();
//   }, []);

//   useEffect(() => {
//     if (StudentID) {
//       const fetchStudentData = async () => {
//         const res = await fetch(
//           `/api/Parents_Student/Parents_Student_Lists_detail_data_by_id/${StudentID}`
//         );
//         if (!res.ok) throw new Error("Network error!");
//         const result = await res.json();
//         setGetStudentData(result);
//         if (result[0]?.name) {
//           parent_student_scorelists_create_form.setValue("student_name", result[0].name);
//         }
//       };
//       fetchStudentData();
//     }
//   }, [StudentID]);

//   useEffect(()=>{
//     const school_name = GetStudentData[0]?.school;

//     parent_student_scorelists_create_form.setValue("school",school_name)
//   },[GetStudentData])

//   return (
//     <Form {...parent_student_scorelists_create_form}>
//       <form
//         onSubmit={parent_student_scorelists_create_form.handleSubmit(
//           parent_student_scorelists_create_onSubmit
//         )}
//         className="space-y-6"
//       >
//         <div className="space-y-4">
//           <FormField
//             control={parent_student_scorelists_create_form.control}
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
//                   />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={parent_student_scorelists_create_form.control}
//             name="subject"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>科目</FormLabel>
//                 <FormControl>
//                   <SWR_School_Subject field={field} />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={parent_student_scorelists_create_form.control}
//             name="student_name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>學生名字</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="學生名字"
//                     type="text"
//                   />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={parent_student_scorelists_create_form.control}
//             name="school"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>學校</FormLabel>
//                 <FormControl>
//                 <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="學校名字"
//                     type="text"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={parent_student_scorelists_create_form.control}
//             name="grade"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>年級</FormLabel>
//                 <FormControl>
//                   <SWR_School_Grade field={field} />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={parent_student_scorelists_create_form.control}
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
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={parent_student_scorelists_create_form.control}
//             name="score"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>分數</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     onChange={(e) => field.onChange(Number(e.target.value))} // 轉為數字
//                     disabled={isPending}
//                     placeholder="分數"
//                     type="number" // 改為 number
//                   />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={parent_student_scorelists_create_form.control}
//             name="quarter"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>季度</FormLabel>
//                 <FormControl>
//                   <SWR_School_Quarter field={field} />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={parent_student_scorelists_create_form.control}
//           name="img"
//           render={() => (
//             <FormItem>
//               <FormLabel>文件</FormLabel>
//               <FormControl>
//                 <Input
//                   disabled={isPending}
//                   type="file"
//                   onChange={handleFileChange}
//                   accept=".jpg,.png,.pdf,.rar,.zip"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {fileBase64 && (
//           <div className="text-sm text-gray-500">已選擇文件: {originalFileName}</div>
//         )}

//         <Button disabled={isPending} type="submit">
//           建立
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default Parent_Student_ScoreLists_Create_Form;

"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";

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

import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { parent_student_score_create_schema } from "@/actions/Create-Parent_Student_Score/schema";
import { createParentStudentScore } from "@/actions/Create-Parent_Student_Score";

const Parent_Student_ScoreLists_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const router = useRouter();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;

  const [GetStudentData, setGetStudentData] = useState<any[]>([]);
  const [GetSchoolData, setGetSchoolData] = useState<any[]>([]);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [originalFileName, setOriginalFileName] = useState<string>("");

  const parent_student_scorelists_create_form = useForm<
    z.infer<typeof parent_student_score_create_schema>
  >({
    resolver: zodResolver(parent_student_score_create_schema),
    defaultValues: {
      parentid: ParentID,
      name: "",
      student_score_id: StudentID,
      student_name: "",
      grade: 0,
      year: "",
      school: "",
      img: "",
      subject: "",
      score: 0,
      quarter: 0,
      originalFileName: "",
    },
  });

  // 文件處理函數
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        parent_student_scorelists_create_form.setError("img", { message: "文件大小不能超過 10MB" });
        return;
      }
      setOriginalFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFileBase64(base64String);
        parent_student_scorelists_create_form.setValue("img", base64String);
        parent_student_scorelists_create_form.setValue("originalFileName", file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const parent_student_scorelists_create_onSubmit = (
    values: z.infer<typeof parent_student_score_create_schema>
  ) => {
    startTransition(async () => {
      try {
        const result = await createParentStudentScore(values);
        if (result.success === "true" && result.data) {
          toast.success("上傳成功");
          // 刷新 SWR 緩存
          await mutate(`/api/Parents_Student/Parents_Student_Lists_detail_data_by_id/${StudentID}`);
          // 重定向
          router.push(`/parent/${ParentID}/profiles/${StudentID}/upload/scoreLists`);
          parent_student_scorelists_create_form.reset();
          setFileBase64("");
          setOriginalFileName("");
        } else {
          throw new Error(result.error || "上傳失敗");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("上傳失敗，請檢查文件格式或稍後重試");
      }
    });
  };

  useEffect(() => {
    const fetchSchoolData = async () => {
      const res = await fetch(`/api/School_Lists/`);
      if (!res.ok) throw new Error("Network error!");
      const result = await res.json();
      setGetSchoolData(result);
    };
    fetchSchoolData();
  }, []);

  useEffect(() => {
    if (StudentID) {
      const fetchStudentData = async () => {
        const res = await fetch(
          `/api/Parents_Student/Parents_Student_Lists_detail_data_by_id/${StudentID}`
        );
        if (!res.ok) throw new Error("Network error!");
        const result = await res.json();
        setGetStudentData(result);
        if (result[0]?.name) {
          parent_student_scorelists_create_form.setValue("student_name", result[0].name);
        }
        if (result[0]?.school) {
          parent_student_scorelists_create_form.setValue("school", result[0].school);
        }
      };
      fetchStudentData();
    }
  }, [StudentID]);

  return (
    <Form {...parent_student_scorelists_create_form}>
      <form
        onSubmit={parent_student_scorelists_create_form.handleSubmit(
          parent_student_scorelists_create_onSubmit
        )}
        className="space-y-6"
      >
        <div className="space-y-4">
          <FormField
            control={parent_student_scorelists_create_form.control}
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={parent_student_scorelists_create_form.control}
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
        </div>

        <div className="space-y-4">
          <FormField
            control={parent_student_scorelists_create_form.control}
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={parent_student_scorelists_create_form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>學校</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="學校名稱"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={parent_student_scorelists_create_form.control}
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
        </div>

        <div className="space-y-4">
          <FormField
            control={parent_student_scorelists_create_form.control}
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
        </div>

        <div className="space-y-4">
          <FormField
            control={parent_student_scorelists_create_form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>分數</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isPending}
                    placeholder="分數"
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={parent_student_scorelists_create_form.control}
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
        </div>

        <FormField
          control={parent_student_scorelists_create_form.control}
          name="img"
          render={() => (
            <FormItem>
              <FormLabel>文件</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.png,.pdf,.rar,.zip"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fileBase64 && (
          <div className="text-sm text-gray-500">已選擇文件: {originalFileName}</div>
        )}

        <Button disabled={isPending} type="submit">
          建立
        </Button>
      </form>
    </Form>
  );
};

export default Parent_Student_ScoreLists_Create_Form;