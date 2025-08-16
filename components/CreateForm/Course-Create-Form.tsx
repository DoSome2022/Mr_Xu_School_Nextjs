// "use client";
// import * as z from "zod";
// import { useState, useEffect, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
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
// import { Course_Create_Schema } from "@/actions/Create-Course/schema";
// import { create_Course } from "@/actions/Create-Course";
// import { FormError } from "@/components/form-error";
// import { FormSuccess } from "@/components/form-success";
// import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";

// interface TimeTemplate {
//   id: string;
//   title: string;
//   day_start: string;
//   day_end: string;
//   start_time: string;
//   end_time: string;
//   days: { date: string; start_time: string; end_time: string; lesson: string }[];
//   weekdays: { date: string; start_time: string; end_time: string; lesson: string }[];
//   publicholiday_model: string[];
//   grade: string;
// }

// interface ClassRooomData {
//   id: string;
//   room: string;
// }

// const Course_Create_Form = () => {
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [GetTeacherData, setGetTeacherData] = useState<any[]>([]);
//   const [GetSelectedTeacherID, setGetSelectedTeacherID] = useState<string[]>([]);
//   const [GetTimeTemplateData, setGetTimeTemplateData] = useState<TimeTemplate[]>([]);
//   const [selectedLCSData, setSelectedLCSData] = useState<TimeTemplate | null>(null);
//   const [GetClassRoomData, setGetClassRoomData] = useState<ClassRooomData[]>([]);

//   useEffect(() => {
//     const getTeacherData = async () => {
//       const res = await fetch("/api/Course_data_teacher");
//       if (!res.ok) throw new Error("斷線！");
//       const result = await res.json();
//       setGetTeacherData(result);
//     };
//     getTeacherData();

//     const getClassRoomData = async () => {
//       const res = await fetch("/api/ClassRoom_Lists");
//       if (!res.ok) throw new Error("斷線！");
//       const result = await res.json();
//       setGetClassRoomData(result);
//     };
//     getClassRoomData();
//   }, []);

//   useEffect(() => {
//     const getTTdata = async () => {
//       const res = await fetch("/api/TimeTemplate_Lists");
//       if (!res.ok) {
//         throw new Error("斷線！");
//       }
//       const result = await res.json();
//       const normalizedData = result.map((item: any) => ({
//         ...item,
//         weekdays: Array.isArray(item.weekdays)
//           ? item.weekdays.map((w: any) => ({
//               date: w.date || "",
//               start_time: w.start_time || item.start_time || "",
//               end_time: w.end_time || item.end_time || "",
//               lesson: w.lesson || "",
//             }))
//           : [],
//         days: Array.isArray(item.days)
//           ? item.days.map((d: any) => ({
//               date: d.date || "",
//               start_time: d.start_time || item.start_time || "",
//               end_time: d.end_time || item.end_time || "",
//               lesson: d.lesson || "",
//             }))
//           : [],
//       }));
//       console.log("Normalized TimeTemplate Data:", JSON.stringify(normalizedData, null, 2));
//       setGetTimeTemplateData(normalizedData);
//     };
//     getTTdata();
//   }, []);

//   const course_create_form = useForm<z.infer<typeof Course_Create_Schema>>({
//     resolver: zodResolver(Course_Create_Schema),
//     defaultValues: {
//       course_name: "",
//       course_subject: "",
//       persons: 0,
//       grade: 0,
//       teacher: "",
//       course_teacher_data_id: [],
//       TimeTemplateID: "",
//       classroom: "",
//       day_start: "",
//       day_end: "",
//       start_time: "",
//       end_time: "",
//       days: [],
//       weekdays: [],
//       publicholiday: [],
//     },
//   });

//   const handleTimeTemplateChange = (value: string) => {
//     const selectedData = GetTimeTemplateData.find((data: TimeTemplate) => data.title === value);
//     setSelectedLCSData(selectedData || null);
//     if (selectedData) {
//       course_create_form.setValue("TimeTemplateID", selectedData.id, { shouldValidate: true });
//       course_create_form.setValue("day_start", selectedData.day_start, { shouldValidate: true });
//       course_create_form.setValue("day_end", selectedData.day_end, { shouldValidate: true });
//       course_create_form.setValue("start_time", selectedData.start_time, { shouldValidate: true });
//       course_create_form.setValue("end_time", selectedData.end_time, { shouldValidate: true });
//       course_create_form.setValue("days", selectedData.days, { shouldValidate: true });
//       course_create_form.setValue("weekdays", selectedData.weekdays, { shouldValidate: true });
//       course_create_form.setValue("publicholiday", selectedData.publicholiday_model, {
//         shouldValidate: true,
//       });
//     }
//   };

//   const course_create_form_onSubmit = (values: z.infer<typeof Course_Create_Schema>) => {
//     console.log("-- create course輸入 -- : ", JSON.stringify(values, null, 2), "-- End --");
//     setError("");
//     setSuccess("");
//     startTransition(()=>{
//       create_Course(values);
//     }
//     );
//   };

//   console.log(" -- Bug -- : ", course_create_form.formState.errors, "-- END --");

//   return (
//     <Form {...course_create_form}>
//       <form onSubmit={course_create_form.handleSubmit(course_create_form_onSubmit)} className="space-y-6">
//         <div className="space-y-4">
//           <FormField
//             control={course_create_form.control}
//             name="course_name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>課程名稱/課程ID</FormLabel>
//                 <FormControl>
//                   <Input {...field} disabled={isPending} placeholder="輸入課程名稱/課程ID" type="text" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={course_create_form.control}
//           name="grade"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>年級</FormLabel>
//               <FormControl>
//                 <SWR_School_Grade field={field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="space-y-4" hidden>
//           <FormField
//             control={course_create_form.control}
//             name="TimeTemplateID"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>TimeTemplateID</FormLabel>
//                 <FormControl>
//                   <Input {...field} disabled={true} value={selectedLCSData ? selectedLCSData.id : ""} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={course_create_form.control}
//             name="TimeTemplate"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>時間模組</FormLabel>
//                 <FormControl>
//                   <Select
//                     onValueChange={(value) => {
//                       field.onChange(value);
//                       handleTimeTemplateChange(value);
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="選擇" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {GetTimeTemplateData.map((data) => (
//                         <SelectItem value={data.title} key={data.id}>
//                           標題: {data.title}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={course_create_form.control}
//             name="course_subject"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>課程科目</FormLabel>
//                 <FormControl>
//                   <SWR_School_Subject field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={course_create_form.control}
//             name="teacher"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>老師</FormLabel>
//                 <FormControl>
//                   <Select
//                     defaultValue={field.value}
//                     onValueChange={(value) => {
//                       field.onChange(value);
//                       const SelectedTeacher = GetTeacherData.find((data) => data.username === value);
//                       if (SelectedTeacher?.id) {
//                         const updatedIDs = [...GetSelectedTeacherID, SelectedTeacher.id];
//                         setGetSelectedTeacherID(updatedIDs);
//                         course_create_form.setValue("course_teacher_data_id", updatedIDs);
//                       }
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="選擇老師" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {GetTeacherData.map((data) => {
//                         if (data.role === "TEACHER") {
//                           return (
//                             <SelectItem value={data.username} key={data.id}>
//                               名：{data.username}
//                             </SelectItem>
//                           );
//                         }
//                       })}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4" hidden>
//           <FormField
//             control={course_create_form.control}
//             name="course_teacher_data_id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <Input {...field} type="text" value={GetSelectedTeacherID.join(", ")} disabled />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={course_create_form.control}
//             name="persons"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>人數</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入人數"
//                     type="number"
//                     onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-4">
//           <FormField
//             control={course_create_form.control}
//             name="classroom"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>課室</FormLabel>
//                 <FormControl>
//                   <Select
//                     defaultValue={field.value}
//                     onValueChange={(value) => field.onChange(value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="選擇課室" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {GetClassRoomData?.map((datas) => (
//                         <SelectItem value={datas.id} key={datas.id}>
//                           {datas.room}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* 隱藏字段 */}
//         <FormField
//           control={course_create_form.control}
//           name="day_start"
//           render={({ field }) => (
//             <FormItem hidden>
//               <FormControl>
//                 <Input {...field} type="hidden" />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={course_create_form.control}
//           name="day_end"
//           render={({ field }) => (
//             <FormItem hidden>
//               <FormControl>
//                 <Input {...field} type="hidden" />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={course_create_form.control}
//           name="start_time"
//           render={({ field }) => (
//             <FormItem hidden>
//               <FormControl>
//                 <Input {...field} type="hidden" />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={course_create_form.control}
//           name="end_time"
//           render={({ field }) => (
//             <FormItem hidden>
//               <FormControl>
//                 <Input {...field} type="hidden" />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={course_create_form.control}
//           name="publicholiday"
//           render={({ field }) => (
//             <FormItem hidden>
//               <FormControl>
//                 <Input {...field} type="hidden" />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         <FormError message={error} />
//         <FormSuccess message={success} />
//         <Button disabled={isPending} type="submit">
//           建立
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default Course_Create_Form;



"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Course_Create_Schema } from "@/actions/Create-Course/schema";
import { create_Course } from "@/actions/Create-Course";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";

interface TimeTemplate {
  id: string;
  title: string;
  day_start: string;
  day_end: string;
  start_time: string;
  end_time: string;
  days: { date: string; start_time: string; end_time: string; lesson: string }[];
  weekdays: { date: string; start_time: string; end_time: string; lesson: string }[];
  publicholiday_model: string[];
  grade: string;
}

interface ClassRooomData {
  id: string;
  room: string;
}

interface TeacherData {
  id: string;
  username: string;
  role: string;
}

const Course_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [GetTeacherData, setGetTeacherData] = useState<TeacherData[]>([]);
  const [GetSelectedTeacherID, setGetSelectedTeacherID] = useState<string[]>([]);
  const [GetTimeTemplateData, setGetTimeTemplateData] = useState<TimeTemplate[]>([]);
  const [selectedLCSData, setSelectedLCSData] = useState<TimeTemplate | null>(null);
  const [GetClassRoomData, setGetClassRoomData] = useState<ClassRooomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 獲取老師數據
        const teacherRes = await fetch("/api/Course_data_teacher");
        if (!teacherRes.ok) throw new Error("無法獲取老師數據");
        const teacherResult = await teacherRes.json();
        setGetTeacherData(teacherResult);

        // 獲取課室數據
        const classRoomRes = await fetch("/api/ClassRoom_Lists");
        if (!classRoomRes.ok) throw new Error("無法獲取課室數據");
        const classRoomResult = await classRoomRes.json();
        setGetClassRoomData(classRoomResult);

        // 獲取時間模組數據
        const timeTemplateRes = await fetch("/api/TimeTemplate_Lists");
        if (!timeTemplateRes.ok) throw new Error("無法獲取時間模組數據");
        const timeTemplateResult = await timeTemplateRes.json();
        const normalizedData = timeTemplateResult.map((item: any) => ({
          ...item,
          weekdays: Array.isArray(item.weekdays)
            ? item.weekdays.map((w: any) => ({
                date: w.date || "",
                start_time: w.start_time || item.start_time || "",
                end_time: w.end_time || item.end_time || "",
                lesson: w.lesson || "",
              }))
            : [],
          days: Array.isArray(item.days)
            ? item.days.map((d: any) => ({
                date: d.date || "",
                start_time: d.start_time || item.start_time || "",
                end_time: d.end_time || item.end_time || "",
                lesson: d.lesson || "",
              }))
            : [],
        }));
        setGetTimeTemplateData(normalizedData);
      } catch (error: any) {
        console.error("數據獲取失敗:", error);
        setError("無法載入表單數據");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const course_create_form = useForm<z.infer<typeof Course_Create_Schema>>({
    resolver: zodResolver(Course_Create_Schema),
    defaultValues: {
      course_name: "",
      course_subject: "",
      persons: 0,
      grade: 0,
      teacher: "",
      course_teacher_data_id: [],
      TimeTemplateID: "",
      classroom: "",
      day_start: "",
      day_end: "",
      start_time: "",
      end_time: "",
      days: [],
      weekdays: [],
      publicholiday: [],
    },
  });

  const handleTimeTemplateChange = (value: string) => {
    const selectedData = GetTimeTemplateData.find((data: TimeTemplate) => data.title === value);
    setSelectedLCSData(selectedData || null);

    if (selectedData) {
      course_create_form.setValue("TimeTemplateID", selectedData.id, { shouldValidate: true });
      course_create_form.setValue("day_start", selectedData.day_start, { shouldValidate: true });
      course_create_form.setValue("day_end", selectedData.day_end, { shouldValidate: true });
      course_create_form.setValue("start_time", selectedData.start_time, { shouldValidate: true });
      course_create_form.setValue("end_time", selectedData.end_time, { shouldValidate: true });
      course_create_form.setValue("days", selectedData.days, { shouldValidate: true });
      course_create_form.setValue("weekdays", selectedData.weekdays, { shouldValidate: true });
      course_create_form.setValue("publicholiday", selectedData.publicholiday_model, {
        shouldValidate: true,
      });
    } else {
      // 當選擇無效時，重置表單字段
      course_create_form.setValue("TimeTemplateID", "", { shouldValidate: true });
      course_create_form.setValue("day_start", "", { shouldValidate: true });
      course_create_form.setValue("day_end", "", { shouldValidate: true });
      course_create_form.setValue("start_time", "", { shouldValidate: true });
      course_create_form.setValue("end_time", "", { shouldValidate: true });
      course_create_form.setValue("days", [], { shouldValidate: true });
      course_create_form.setValue("weekdays", [], { shouldValidate: true });
      course_create_form.setValue("publicholiday", [], { shouldValidate: true });
    }
  };

  const course_create_form_onSubmit = (values: z.infer<typeof Course_Create_Schema>) => {
    console.log("-- create course輸入 -- : ", JSON.stringify(values, null, 2), "-- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      create_Course(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#e7915b] mb-6">建立新課程</h1>
        <Form {...course_create_form}>
          <form onSubmit={course_create_form.handleSubmit(course_create_form_onSubmit)} className="space-y-6">
            {error && (
              <div className="text-red-500 bg-red-100 p-3 rounded-md">
                <FormError message={error} />
              </div>
            )}
            {success && (
              <div className="text-green-500 bg-green-100 p-3 rounded-md">
                <FormSuccess message={success} />
              </div>
            )}
            <div className="space-y-4">
              <FormField
                control={course_create_form.control}
                name="course_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">課程名稱/課程ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程名稱或課程ID"
                        className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">年級</FormLabel>
                    <FormControl>
                      <SWR_School_Grade field={field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="TimeTemplateID" // 修正為 TimeTemplateID
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">時間模組</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleTimeTemplateChange(value);
                        }}
                        disabled={isPending}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300">
                          <SelectValue placeholder="選擇時間模組" />
                        </SelectTrigger>
                        <SelectContent>
                          {GetTimeTemplateData.map((data) => (
                            <SelectItem value={data.title} key={data.id}>
                              {data.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="course_subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">課程科目</FormLabel>
                    <FormControl>
                      <SWR_School_Subject field={field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">老師</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          const SelectedTeacher = GetTeacherData.find((data) => data.username === value);
                          if (SelectedTeacher?.id) {
                            const updatedIDs = [...GetSelectedTeacherID, SelectedTeacher.id];
                            setGetSelectedTeacherID(updatedIDs);
                            course_create_form.setValue("course_teacher_data_id", updatedIDs, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        disabled={isPending}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300">
                          <SelectValue placeholder="選擇老師" />
                        </SelectTrigger>
                        <SelectContent>
                          {GetTeacherData.map((data) => {
                            if (data.role === "TEACHER") {
                              return (
                                <SelectItem value={data.username} key={data.id}>
                                  {data.username}
                                </SelectItem>
                              );
                            }
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="persons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">人數</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入人數"
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="classroom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">課室</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        disabled={isPending}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300">
                          <SelectValue placeholder="選擇課室" />
                        </SelectTrigger>
                        <SelectContent>
                          {GetClassRoomData?.map((datas) => (
                            <SelectItem value={datas.id} key={datas.id}>
                              {datas.room}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              {/* 隱藏字段 */}
              <FormField
                control={course_create_form.control}
                name="TimeTemplateID"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormControl>
                      <Input {...field} disabled={true} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="course_teacher_data_id"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormControl>
                      <Input {...field} type="text" value={GetSelectedTeacherID.join(", ")} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="day_start"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="day_end"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={course_create_form.control}
                name="publicholiday"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              {isPending ? "正在建立..." : "建立課程"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Course_Create_Form;





// 05-08-2025  原本版本

// "use client";

// import * as z from "zod";
// import { useState, useEffect, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
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
// import { Course_Create_Schema } from "@/actions/Create-Course/schema";
// import { create_Course } from "@/actions/Create-Course";
// import { FormError } from "@/components/form-error";
// import { FormSuccess } from "@/components/form-success";
// import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";

// interface TimeTemplate {
//   id: string;
//   title: string;
//   day_start: string;
//   day_end: string;
//   start_time: string;
//   end_time: string;
//   days: { date: string; start_time: string; end_time: string; lesson: string }[];
//   weekdays: { date: string; start_time: string; end_time: string; lesson: string }[];
//   publicholiday_model: string[];
//   grade: string;
// }

// interface ClassRooomData {
//   id: string;
//   room: string;
// }

// const Course_Create_Form = () => {
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [GetTeacherData, setGetTeacherData] = useState<any[]>([]);
//   const [GetSelectedTeacherID, setGetSelectedTeacherID] = useState<string[]>([]);
//   const [GetTimeTemplateData, setGetTimeTemplateData] = useState<TimeTemplate[]>([]);
//   const [selectedLCSData, setSelectedLCSData] = useState<TimeTemplate | null>(null);
//   const [GetClassRoomData, setGetClassRoomData] = useState<ClassRooomData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         // 獲取老師數據
//         const teacherRes = await fetch("/api/Course_data_teacher");
//         if (!teacherRes.ok) throw new Error("無法獲取老師數據");
//         const teacherResult = await teacherRes.json();
//         setGetTeacherData(teacherResult);

//         // 獲取課室數據
//         const classRoomRes = await fetch("/api/ClassRoom_Lists");
//         if (!classRoomRes.ok) throw new Error("無法獲取課室數據");
//         const classRoomResult = await classRoomRes.json();
//         setGetClassRoomData(classRoomResult);

//         // 獲取時間模組數據
//         const timeTemplateRes = await fetch("/api/TimeTemplate_Lists");
//         if (!timeTemplateRes.ok) throw new Error("無法獲取時間模組數據");
//         const timeTemplateResult = await timeTemplateRes.json();
//         const normalizedData = timeTemplateResult.map((item: any) => ({
//           ...item,
//           weekdays: Array.isArray(item.weekdays)
//             ? item.weekdays.map((w: any) => ({
//                 date: w.date || "",
//                 start_time: w.start_time || item.start_time || "",
//                 end_time: w.end_time || item.end_time || "",
//                 lesson: w.lesson || "",
//               }))
//             : [],
//           days: Array.isArray(item.days)
//             ? item.days.map((d: any) => ({
//                 date: d.date || "",
//                 start_time: d.start_time || item.start_time || "",
//                 end_time: d.end_time || item.end_time || "",
//                 lesson: d.lesson || "",
//               }))
//             : [],
//         }));
//         setGetTimeTemplateData(normalizedData);
//       } catch (error: any) {
//         console.error("數據獲取失敗:", error);
//         setError("無法載入表單數據");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const course_create_form = useForm<z.infer<typeof Course_Create_Schema>>({
//     resolver: zodResolver(Course_Create_Schema),
//     defaultValues: {
//       course_name: "",
//       course_subject: "",
//       persons: 0,
//       grade: 0,
//       teacher: "",
//       course_teacher_data_id: [],
//       TimeTemplateID: "",
//       classroom: "",
//       day_start: "",
//       day_end: "",
//       start_time: "",
//       end_time: "",
//       days: [],
//       weekdays: [],
//       publicholiday: [],
//     },
//   });

//   const handleTimeTemplateChange = (value: string) => {
//     const selectedData = GetTimeTemplateData.find((data: TimeTemplate) => data.title === value);
//     setSelectedLCSData(selectedData || null);
//     if (selectedData) {
//       course_create_form.setValue("TimeTemplateID", selectedData.id, { shouldValidate: true });
//       course_create_form.setValue("day_start", selectedData.day_start, { shouldValidate: true });
//       course_create_form.setValue("day_end", selectedData.day_end, { shouldValidate: true });
//       course_create_form.setValue("start_time", selectedData.start_time, { shouldValidate: true });
//       course_create_form.setValue("end_time", selectedData.end_time, { shouldValidate: true });
//       course_create_form.setValue("days", selectedData.days, { shouldValidate: true });
//       course_create_form.setValue("weekdays", selectedData.weekdays, { shouldValidate: true });
//       course_create_form.setValue("publicholiday", selectedData.publicholiday_model, {
//         shouldValidate: true,
//       });
//     }
//   };

//   const course_create_form_onSubmit = (values: z.infer<typeof Course_Create_Schema>) => {
//     console.log("-- create course輸入 -- : ", JSON.stringify(values, null, 2), "-- End --");
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       create_Course(values).then((data) => {
//         setError(data?.error);
//         setSuccess(data?.success);
//       });
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-gray-600 text-lg">正在加載...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <Form {...course_create_form}>
//       <form onSubmit={course_create_form.handleSubmit(course_create_form_onSubmit)} className="space-y-6">
//         {error && (
//           <div className="text-red-500 bg-red-100 p-3 rounded-md">
//             <FormError message={error} />
//           </div>
//         )}
//         {success && (
//           <div className="text-green-500 bg-green-100 p-3 rounded-md">
//             <FormSuccess message={success} />
//           </div>
//         )}
//         <div className="space-y-4">
//           <FormField
//             control={course_create_form.control}
//             name="course_name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-semibold">課程名稱/課程ID</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入課程名稱或課程ID"
//                     className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
//                   />
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="grade"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-semibold">年級</FormLabel>
//                 <FormControl>
//                   <SWR_School_Grade field={field} />
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="TimeTemplate"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-semibold">時間模組</FormLabel>
//                 <FormControl>
//                   <Select
//                     onValueChange={(value) => {
//                       field.onChange(value);
//                       handleTimeTemplateChange(value);
//                     }}
//                     disabled={isPending}
//                   >
//                     <SelectTrigger className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300">
//                       <SelectValue placeholder="選擇時間模組" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {GetTimeTemplateData.map((data) => (
//                         <SelectItem value={data.title} key={data.id}>
//                           {data.title}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="course_subject"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-semibold">課程科目</FormLabel>
//                 <FormControl>
//                   <SWR_School_Subject field={field} />
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="teacher"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-semibold">老師</FormLabel>
//                 <FormControl>
//                   <Select
//                     defaultValue={field.value}
//                     onValueChange={(value) => {
//                       field.onChange(value);
//                       const SelectedTeacher = GetTeacherData.find((data) => data.username === value);
//                       if (SelectedTeacher?.id) {
//                         const updatedIDs = [...GetSelectedTeacherID, SelectedTeacher.id];
//                         setGetSelectedTeacherID(updatedIDs);
//                         course_create_form.setValue("course_teacher_data_id", updatedIDs);
//                       }
//                     }}
//                     disabled={isPending}
//                   >
//                     <SelectTrigger className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300">
//                       <SelectValue placeholder="選擇老師" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {GetTeacherData.map((data) => {
//                         if (data.role === "TEACHER") {
//                           return (
//                             <SelectItem value={data.username} key={data.id}>
//                               {data.username}
//                             </SelectItem>
//                           );
//                         }
//                       })}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="persons"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-semibold">人數</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入人數"
//                     type="number"
//                     onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
//                     className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
//                   />
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="classroom"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-semibold">課室</FormLabel>
//                 <FormControl>
//                   <Select
//                     defaultValue={field.value}
//                     onValueChange={(value) => field.onChange(value)}
//                     disabled={isPending}
//                   >
//                     <SelectTrigger className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300">
//                       <SelectValue placeholder="選擇課室" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {GetClassRoomData?.map((datas) => (
//                         <SelectItem value={datas.id} key={datas.id}>
//                           {datas.room}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />
//           {/* 隱藏字段 */}
//           <FormField
//             control={course_create_form.control}
//             name="TimeTemplateID"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} disabled={true} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="course_teacher_data_id"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} type="text" value={GetSelectedTeacherID.join(", ")} disabled />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="day_start"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} type="hidden" />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="day_end"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} type="hidden" />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="start_time"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} type="hidden" />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="end_time"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} type="hidden" />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={course_create_form.control}
//             name="publicholiday"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} type="hidden" />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//         </div>
//         <Button
//           disabled={isPending}
//           type="submit"
//           className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//         >
//           {isPending ? "正在建立..." : "建立課程"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default Course_Create_Form;