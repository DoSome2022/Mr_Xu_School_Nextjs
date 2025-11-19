// "use client";

// import * as z from "zod";
// import { useEffect, useState, useTransition } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useParams } from "next/navigation";
// import useSWR from "swr";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "../ui/switch";
// import { FormError } from "@/components/form-error";
// import { FormSuccess } from "@/components/form-success";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import DatePicker from "react-multi-date-picker";
// import { Student_Update_Schema } from "@/actions/Update-Student/schema";
// import { Update_Student } from "@/actions/Update-Student";

// interface SchoolData {
//   id: string;
//   school_name: string;
// }

// interface StudentData {
//   id: string;
//   name: string;
//   school: string;
//   grade: number;
//   student_id: string;
//   chine_ex_day?: string;
//   math_ex_day?: string;
//   eng_ex_day?: string;
//   pay: boolean;
//   student_parent_data_id: string;
//   student_class_id?: string;
//   student_teacher_data_id?: string | null;
//   BookList?: any[];
//   EX_Paper?: any[];
//   EX_Time?: any[];
//   EX_scope?: any[];
//   SC_Timetable?: any[];
//   Score?: any[];
//   course?: any[];
//   dailyreview?: any[];
//   chine_ex?: string;
//   eng_ex?: string;
//   math_ex?: string;
//   craetedAt?: string;
//   updatedAt?: string;
//   ismember?: boolean;
//   issurvive?: boolean;
// }

// const Student_Update_Form = () => {
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const params = useParams<{ parentdetailbyID: string; studentdetailbyID: string }>();

//   const parentId = params?.parentdetailbyID;
//   const studentId = params?.studentdetailbyID;

//   console.log("studentId : ", studentId, "-- End --");

//   // 驗證路由參數
//   if (!parentId || !studentId) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         錯誤：缺少必要路由參數
//       </div>
//     );
//   }

//   const fetcher = <T,>(url: string, init?: RequestInit): Promise<T> =>
//     fetch(url, init).then((res) => {
//       if (!res.ok) throw new Error(res.statusText);
//       return res.json();
//     });

//   const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:8000";

//   // 獲取學生資料
//   const { data: studentDataRaw, error: studentError, isLoading: studentLoading } = useSWR<StudentData[]>(
//     `${apiUrl}/api/student/Student_Lists_detail_data_by_id/${studentId}`,
//     fetcher,
//     { revalidateOnFocus: false }
//   );

//   // 獲取學校資料
//   const { data: schoolsData, error: schoolsError, isLoading: schoolsLoading } = useSWR<SchoolData[]>(
//     `${apiUrl}/api/School_Lists`,
//     fetcher,
//     { revalidateOnFocus: false }
//   );

//   const form = useForm<z.infer<typeof Student_Update_Schema>>({
//     resolver: zodResolver(Student_Update_Schema),
//     defaultValues: {
//       name: "",
//       school: "",
//       grade: 0,
//       student_id: "",
//       studentId: studentId,
//       chine_ex_day: "",
//       math_ex_day: "",
//       eng_ex_day: "",
//       pay: false,
//       student_parent_data_id: parentId,
//     },
//   });

//   useEffect(() => {
//     if (studentDataRaw && Array.isArray(studentDataRaw) && studentDataRaw.length > 0) {
//       const studentData = studentDataRaw[0];
//       form.reset({
//         name: studentData.name || "",
//         school: studentData.school || "",
//         grade: studentData.grade || 0,
//         studentId: studentId,
//         student_id: studentData.student_id || "",
//         chine_ex_day: studentData.chine_ex_day || "",
//         math_ex_day: studentData.math_ex_day || "",
//         eng_ex_day: studentData.eng_ex_day || "",
//         pay: studentData.pay || false,
//         student_parent_data_id: studentData.student_parent_data_id || parentId,
//       });
//     }
//   }, [studentDataRaw, form, parentId, studentId]);

//   // 錯誤處理
//   if (studentError || schoolsError) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         錯誤：無法載入資料 - {(studentError || schoolsError)?.message || "未知錯誤"}
//       </div>
//     );
//   }

//   // 載入中
//   if (studentLoading || schoolsLoading) {
//     return <div className="text-gray-600 p-4">載入中...</div>;
//   }

//   // 驗證學生資料
//   if (
//     !studentDataRaw ||
//     !Array.isArray(studentDataRaw) ||
//     studentDataRaw.length === 0 ||
//     !studentDataRaw[0].name ||
//     !studentDataRaw[0].school ||
//     typeof studentDataRaw[0].grade !== "number"
//   ) {
//     console.log("studentDataRaw : ", studentDataRaw, " -- End -- ");
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         無效的學生資料格式
//       </div>
//     );
//   }

//   // 驗證學校資料
//   if (!schoolsData || !Array.isArray(schoolsData) || !schoolsData.every((item) => item.id)) {
//     console.log("schoolsData : ", schoolsData, " -- End -- ");
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         無效的學校資料格式
//       </div>
//     );
//   }

//   const onSubmit = (values: z.infer<typeof Student_Update_Schema>) => {
//     console.log("提交數據:", values);
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       Update_Student(values)
//         .then((data) => {
//           if (data?.error) {
//             setError(data.error);
//           } else if (data?.data) {
//             setSuccess("資料更新成功");
//           }
//         })
//         .catch((error) => {
//           console.error("提交失敗:", error);
//           setError("提交失敗，請稍後重試");
//         });
//     });
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
//       {error && <FormError message={error} />}
//       {success && <FormSuccess message={success} />}
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">姓名</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入姓名"
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
//                   <Select disabled={isPending} value={field.value} onValueChange={field.onChange}>
//                     <SelectTrigger className="border-blue-300 focus:border-blue-500">
//                       <SelectValue placeholder="選擇學校" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {schoolsData
//                         .filter((school) => school.school_name)
//                         .map((school) => (
//                           <SelectItem key={school.id} value={school.school_name}>
//                             {school.school_name}
//                           </SelectItem>
//                         ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="studentId"
//             render={({ field }) => (
//               <FormItem className="hidden">
//                 <FormControl>
//                   <Input {...field} type="hidden" />
//                 </FormControl>
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
//             name="student_id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">學生 ID</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入學生 ID"
//                     className="border-blue-300 focus:border-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="chine_ex_day"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">中文考試日期</FormLabel>
//                 <FormControl>
//                   <Controller
//                     name="chine_ex_day"
//                     control={form.control}
//                     render={({ field: { onChange, value } }) => (
//                       <DatePicker
//                         value={value || ""}
//                         onChange={(date) => {
//                           const formattedDate = date ? date.format("YYYY-MM-DD") : "";
//                           onChange(formattedDate);
//                         }}
//                         format="YYYY-MM-DD"
//                         placeholder="選擇日期"
//                         disabled={isPending}
//                         inputClass="w-full p-2 border-blue-300 focus:border-blue-500 rounded"
//                       />
//                     )}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="math_ex_day"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">數學考試日期</FormLabel>
//                 <FormControl>
//                   <Controller
//                     name="math_ex_day"
//                     control={form.control}
//                     render={({ field: { onChange, value } }) => (
//                       <DatePicker
//                         value={value || ""}
//                         onChange={(date) => {
//                           const formattedDate = date ? date.format("YYYY-MM-DD") : "";
//                           onChange(formattedDate);
//                         }}
//                         format="YYYY-MM-DD"
//                         placeholder="選擇日期"
//                         disabled={isPending}
//                         inputClass="w-full p-2 border-blue-300 focus:border-blue-500 rounded"
//                       />
//                     )}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="eng_ex_day"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">英文考試日期</FormLabel>
//                 <FormControl>
//                   <Controller
//                     name="eng_ex_day"
//                     control={form.control}
//                     render={({ field: { onChange, value } }) => (
//                       <DatePicker
//                         value={value || ""}
//                         onChange={(date) => {
//                           const formattedDate = date ? date.format("YYYY-MM-DD") : "";
//                           onChange(formattedDate);
//                         }}
//                         format="YYYY-MM-DD"
//                         placeholder="選擇日期"
//                         disabled={isPending}
//                         inputClass="w-full p-2 border-blue-300 focus:border-blue-500 rounded"
//                       />
//                     )}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="pay"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-blue-600">付款狀態</FormLabel>
//                 <FormControl>
//                   <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button
//             disabled={isPending}
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             {isPending ? "提交中..." : "更新學生資料"}
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default Student_Update_Form;

"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import useSWR from "swr";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "../ui/switch";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import DatePicker from "react-multi-date-picker";
import { Student_Update_Schema } from "@/actions/Update-Student/schema";
import { Update_Student } from "@/actions/Update-Student";

interface SchoolData {
  id: string;
  school_name: string;
}

interface StudentData {
  id: string;
  name: string;
  school: string;
  grade: number;
  student_id: string;
  chine_ex_day?: string;
  math_ex_day?: string;
  eng_ex_day?: string;
  pay: boolean;
  student_parent_data_id: string;
  student_class_id?: string;
  student_teacher_data_id?: string | null;
  BookList?: any[];
  EX_Paper?: any[];
  EX_Time?: any[];
  EX_scope?: any[];
  SC_Timetable?: any[];
  Score?: any[];
  course?: any[];
  dailyreview?: any[];
  chine_ex?: string;
  eng_ex?: string;
  math_ex?: string;
  craetedAt?: string;
  updatedAt?: string;
  ismember?: boolean;
  issurvive?: boolean;
}

const Student_Update_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const params = useParams<{

    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();

  const parentId = params?.parentdetailbyID;
  const studentId = params?.studentdetailbyID;

  console.log("studentId : ", studentId , "-- End --")

  // 驗證路由參數
  if ( !parentId || !studentId) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = <T,>(url: string, init?: RequestInit): Promise<T> =>
    fetch(url, init).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:8000";

  // 獲取學生資料
  const { data: studentDataRaw, error: studentError, isLoading: studentLoading } = useSWR<StudentData[]>(
    `${apiUrl}/api/student/Student_Lists_detail_data_by_id/${studentId}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 獲取學校資料
  const { data: schoolsData, error: schoolsError, isLoading: schoolsLoading } = useSWR<SchoolData[]>(
    `${apiUrl}/api/School_Lists`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const form = useForm<z.infer<typeof Student_Update_Schema>>({
    resolver: zodResolver(Student_Update_Schema),
    defaultValues: {
      name: "",
      school: "",
      grade: 0,
      student_id: "",
      chine_ex_day: "",
      math_ex_day: "",
      eng_ex_day: "",
      studentId: studentId,
      pay: false,
      student_parent_data_id: parentId,
    },
  });

  useEffect(() => {
    if (studentDataRaw && Array.isArray(studentDataRaw) && studentDataRaw.length > 0) {
      const studentData = studentDataRaw[0];
      form.reset({
        name: studentData.name || "",
        school: studentData.school || "",
        grade: studentData.grade || 0,
        studentId: studentId, // 明確設置 studentId
        student_id: studentData.student_id || "",
        chine_ex_day: studentData.chine_ex_day || "",
        math_ex_day: studentData.math_ex_day || "",
        eng_ex_day: studentData.eng_ex_day || "",
        pay: studentData.pay || false,
        student_parent_data_id: studentData.student_parent_data_id || parentId,
      });
    }
  }, [studentDataRaw, form, parentId]);

  // 錯誤處理
  if (studentError || schoolsError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入資料 - {(studentError || schoolsError)?.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (studentLoading || schoolsLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 驗證學生資料
  if (
    !studentDataRaw ||
    !Array.isArray(studentDataRaw) ||
    studentDataRaw.length === 0 ||
    !studentDataRaw[0].name ||
    !studentDataRaw[0].school ||
    typeof studentDataRaw[0].grade !== "number" ||
    !studentDataRaw[0].student_id
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的學生資料格式
      </div>
    );
  }

  // 驗證學校資料
  if (!schoolsData || !Array.isArray(schoolsData) || !schoolsData.every((item) => item.id && item.school_name)) {
    console.log("schoolsData : ", schoolsData," -- End -- ")
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的學校資料格式
      </div>
    );
  }

// const onSubmit = (values: z.infer<typeof Student_Update_Schema>) => {
//   console.log("提交數據:", values);
//   setError("");
//   setSuccess("");
//   startTransition(() => {
//     Update_Student(values).then((data) => {
//       if (data?.error) {
//         setError(data.error);
//       } else if (data?.data) {
//         setSuccess("資料更新成功");
//       }
//     });
//   });
// };

const onSubmit = (values: z.infer<typeof Student_Update_Schema>) => {
  console.log("提交數據:", values);
  setError("");
  setSuccess("");
  startTransition(() => {
    Update_Student(values).then((data) => {
      if (data?.error) {
        setError(data.error);
      } else if (data?.data) {
        setSuccess("資料更新成功");
      }
    }).catch((error) => {
      console.error("提交失敗:", error);
      setError("提交失敗，請稍後重試");
    });
  });
};

  // console.log("schoolsData : ", schoolsData," -- End -- ")
  // console.log("bug  : ",form.formState.errors ," -- End -- ")

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">姓名</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入姓名"
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
                  <Select disabled={isPending} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="border-blue-300 focus:border-blue-500">
                      <SelectValue placeholder="選擇學校" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolsData.map((school) => (
                        <SelectItem key={school.id} value={school.school_name}>
                          {school.school_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

                <FormField
        control={form.control}
        name="studentId"
        render={({ field }) => (
          <FormItem className="hidden">
            <FormControl>
              <Input {...field} type="hidden" />
            </FormControl>
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
            name="student_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">學生 ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入學生 ID"
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chine_ex_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">中文考試日期</FormLabel>
                <FormControl>
                  <Controller
                    name="chine_ex_day"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        value={value || ""}
                        onChange={(date) => {
                          const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                          onChange(formattedDate);
                        }}
                        format="YYYY-MM-DD"
                        placeholder="選擇日期"
                        disabled={isPending}
                        inputClass="w-full p-2 border-blue-300 focus:border-blue-500 rounded"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="math_ex_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">數學考試日期</FormLabel>
                <FormControl>
                  <Controller
                    name="math_ex_day"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        value={value || ""}
                        onChange={(date) => {
                          const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                          onChange(formattedDate);
                        }}
                        format="YYYY-MM-DD"
                        placeholder="選擇日期"
                        disabled={isPending}
                        inputClass="w-full p-2 border-blue-300 focus:border-blue-500 rounded"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eng_ex_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">英文考試日期</FormLabel>
                <FormControl>
                  <Controller
                    name="eng_ex_day"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        value={value || ""}
                        onChange={(date) => {
                          const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                          onChange(formattedDate);
                        }}
                        format="YYYY-MM-DD"
                        placeholder="選擇日期"
                        disabled={isPending}
                        inputClass="w-full p-2 border-blue-300 focus:border-blue-500 rounded"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pay"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">付款狀態</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? "提交中..." : "更新學生資料"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Student_Update_Form;