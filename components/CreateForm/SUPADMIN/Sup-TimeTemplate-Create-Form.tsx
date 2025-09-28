// "use client"

// import React, { useState, useEffect, useTransition } from "react";
// import * as z from "zod";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import DatePicker from "react-multi-date-picker";
// import { timetemplate_create_Schema } from "@/actions/Create-TimeTemplate/schema";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import useSWR from "swr";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import { SWR_Class_Lesson } from "../fatchdata/swrclass_lesson";
// import { SWR_Class_Time } from "../fatchdata/swrclass_tiime";
// import { createtimetemplate } from "@/actions/Create-TimeTemplate";



// // 輔助函數：檢查日期是否有效並格式化
// const formatDate = (dateStr) => {
//     if (!dateStr || typeof dateStr !== 'string') return null;
//     const date = new Date(dateStr);
//     return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
// };

// const timeTemplateCreateForm = () => {
//     const fetcher = (...args) => fetch(...args).then((res) => res.json());
//     const { data } = useSWR('http://127.0.0.1:8000/api/course_data/courselessons/', fetcher);
//     const [isPending, startTransition] = useTransition();
//     const [selectedDays, setSelectedDays] = useState([]);
//     const [dayStart, setDayStart] = useState('');
//     const [dayEnd, setDayEnd] = useState('');
//     const [selectedWeekdays, setSelectedWeekdays] = useState({});
//     const [GetPublicHolidays, setGetPublicHolidays] = useState([]);
//     const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);

//     const timeTemplateCreateForm = useForm<z.infer<typeof timetemplate_create_Schema>>({
//         resolver: zodResolver(timetemplate_create_Schema),
//         defaultValues: {
//             title: "",
//             day_start: "",
//             day_end: "",
//             publicholiday: [],
//             weekdays: [],
//             days: [],
//             start_time: "",
//             end_time: "",
//             grade: 0,
//             lesson: ""
//         }
//     });

//     useEffect(() => {
//         const fetchpublicholidaysData = async () => {
//             try {
//                 setIsLoadingHolidays(true);
//                 const res = await fetch('/api/PublicHoliday_Lists');
//                 if (!res.ok) {
//                     throw new Error("無法獲取公眾假期數據！");
//                 }
//                 const result = await res.json();
//                 console.log("Raw API response:", result);
//                 const holidays = Array.isArray(result) ? result : [];
//                 setGetPublicHolidays(holidays);
//             } catch (error) {
//                 console.error("獲取公眾假期失敗:", error);
//                 setGetPublicHolidays([]);
//             } finally {
//                 setIsLoadingHolidays(false);
//             }
//         };
//         fetchpublicholidaysData();
//     }, []);

//     useEffect(() => {
//         // 從 GetPublicHolidays[0].publicholiday 提取日期陣列
//         const holidaysArray = Array.isArray(GetPublicHolidays) && GetPublicHolidays.length > 0 && GetPublicHolidays[0].publicholiday 
//             ? GetPublicHolidays[0].publicholiday 
//             : [];
//         console.log("holidaysArray before mapping:", holidaysArray);
//         const PublicHolidays = holidaysArray
//             .map((date) => formatDate(date))
//             .filter((date) => date !== null);
//         console.log("Formatted PublicHolidays:", PublicHolidays);
//         timeTemplateCreateForm.setValue("publicholiday", PublicHolidays);
//     }, [GetPublicHolidays, timeTemplateCreateForm]);

//     const watchedStartTime = timeTemplateCreateForm.watch('start_time');
//     const watchedEndTime = timeTemplateCreateForm.watch('end_time');

//     useEffect(() => {
//         if (dayStart && dayEnd && data && Object.values(selectedWeekdays).some(Boolean)) {
//             const startDate = new Date(dayStart);
//             const endDate = new Date(dayEnd);
//             const weekdays = [];
//             const currentDate = new Date(startDate);
//             let courseIndex = 0;

//             while (currentDate <= endDate) {
//                 const dayOfWeek = currentDate.getDay();
//                 if (selectedWeekdays[dayOfWeek + 1]) {
//                     const course = data[courseIndex % data.length];
//                     weekdays.push({
//                         date: currentDate.toISOString().split('T')[0],
//                         start_time: timeTemplateCreateForm.getValues('start_time') || "",
//                         end_time: timeTemplateCreateForm.getValues('end_time') || "",
//                         lesson: course ? course.course_lesson : ""
//                     });
//                     courseIndex++;
//                 }
//                 currentDate.setDate(currentDate.getDate() + 1);
//             }

//             timeTemplateCreateForm.setValue('weekdays', weekdays.sort((a, b) => new Date(a.date) - new Date(b.date)));
//         } else {
//             timeTemplateCreateForm.setValue('weekdays', []);
//         }
//     }, [dayStart, dayEnd, selectedWeekdays, data, watchedStartTime, watchedEndTime, timeTemplateCreateForm]);

//     useEffect(() => {
//         if (selectedDays.length > 0) {
//             const days = selectedDays.map(day => ({
//                 date: day.format("YYYY-MM-DD"),
//                 start_time: "",
//                 end_time: "",
//                 lesson: ""
//             }));
//             timeTemplateCreateForm.setValue('days', days);
//         } else {
//             timeTemplateCreateForm.setValue('days', []);
//         }
//     }, [selectedDays, timeTemplateCreateForm]);

//     const timeTemplateCreateForm_onSubmit = (values: z.infer<typeof timetemplate_create_Schema>) => {
//         console.log("-- create timetemplate -- : ", values, "-- End --");
//         startTransition(()=>{
//             createtimetemplate(values)
//         })
//     };

//     const handleWeekdayChange = (dayIndex, checked) => {
//         setSelectedWeekdays(prev => ({ ...prev, [dayIndex]: checked }));
//     };

//     const isDateRangeSelected = dayStart && dayEnd;
//     const isWeekdaySelected = Object.values(selectedWeekdays).some(Boolean);

//     const updateDayField = (index, fieldName, value) => {
//         const currentDays = timeTemplateCreateForm.getValues('days');
//         const updatedDays = [...currentDays];
//         updatedDays[index] = { ...updatedDays[index], [fieldName]: value };
//         timeTemplateCreateForm.setValue('days', updatedDays);
//     };

//     console.log("bug : ", timeTemplateCreateForm.formState.errors, "--End--");

//     return (
//         <>
//             <br />
//             <Form {...timeTemplateCreateForm}>
//                 <form onSubmit={timeTemplateCreateForm.handleSubmit(timeTemplateCreateForm_onSubmit)} className="space-y-4">
//                     {/* Day Start */}
//                     <FormField
//                         control={timeTemplateCreateForm.control}
//                         name="day_start"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>開始日子</FormLabel>
//                                 <FormControl>
//                                     <Controller
//                                         name="day_start"
//                                         control={timeTemplateCreateForm.control}
//                                         render={({ field: { onChange, value } }) => (
//                                             <DatePicker
//                                                 value={value ? new Date(value) : null}
//                                                 format="YYYY-MM-DD"
//                                                 onChange={(date) => {
//                                                     const isoDate = date ? date.format("YYYY-MM-DD") : "";
//                                                     onChange(isoDate);
//                                                     setDayStart(isoDate);
//                                                 }}
//                                             />
//                                         )}
//                                     />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     {/* Day End */}
//                     <FormField
//                         control={timeTemplateCreateForm.control}
//                         name="day_end"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>完結日子</FormLabel>
//                                 <FormControl>
//                                     <Controller
//                                         name="day_end"
//                                         control={timeTemplateCreateForm.control}
//                                         render={({ field: { onChange, value } }) => (
//                                             <DatePicker
//                                                 value={value ? new Date(value) : null}
//                                                 format="YYYY-MM-DD"
//                                                 onChange={(date) => {
//                                                     const isoDate = date ? date.format("YYYY-MM-DD") : "";
//                                                     onChange(isoDate);
//                                                     setDayEnd(isoDate);
//                                                 }}
//                                             />
//                                         )}
//                                     />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     {/* Public Holidays */}
//                     <div>
//                         公眾假期：
//                         {isLoadingHolidays ? (
//                             <span>載入中...</span>
//                         ) : Array.isArray(GetPublicHolidays) && GetPublicHolidays.length > 0 && GetPublicHolidays[0].publicholiday ? (
//                             GetPublicHolidays[0].publicholiday.map((date, index) => {
//                                 const formattedDate = formatDate(date);
//                                 return formattedDate ? (
//                                     <span key={index}>{formattedDate} </span>
//                                 ) : null;
//                             })
//                         ) : (
//                             <span>無公眾假期數據</span>
//                         )}
//                     </div>

//                     {/* Title */}
//                     <FormField
//                         control={timeTemplateCreateForm.control}
//                         name="title"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>標題</FormLabel>
//                                 <FormControl>
//                                     <Input {...field} disabled={isPending} placeholder="標題" type="text" />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     {/* Grade */}
//                     <FormField
//                         control={timeTemplateCreateForm.control}
//                         name="grade"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>年級</FormLabel>
//                                 <FormControl>
//                                     <SWR_School_Grade field={field} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     {/* Weekdays */}
//                     <FormField
//                         control={timeTemplateCreateForm.control}
//                         name="weekdays"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>選週日子</FormLabel>
//                                 <FormControl>
//                                     <div>
//                                         {isDateRangeSelected ? (
//                                             <>
//                                                 {["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"].map((day, index) => (
//                                                     <div key={index}>
//                                                         <label>
//                                                             <input
//                                                                 type="checkbox"
//                                                                 checked={selectedWeekdays[index + 1] || false}
//                                                                 onChange={(e) => handleWeekdayChange(index + 1, e.target.checked)}
//                                                                 disabled={!isDateRangeSelected}
//                                                             />
//                                                             {day}
//                                                         </label>
//                                                     </div>
//                                                 ))}
//                                                 {isWeekdaySelected && (
//                                                     <div className="mt-4 space-y-2">
//                                                         <div>
//                                                             <FormLabel>開始時間</FormLabel>
//                                                             <SWR_Class_Time
//                                                                 field={{
//                                                                     value: timeTemplateCreateForm.getValues('start_time') || "",
//                                                                     onChange: (value) => timeTemplateCreateForm.setValue('start_time', value)
//                                                                 }}
//                                                                 disabled={!isDateRangeSelected}
//                                                             />
//                                                         </div>
//                                                         <div>
//                                                             <FormLabel>完結時間</FormLabel>
//                                                             <SWR_Class_Time
//                                                                 field={{
//                                                                     value: timeTemplateCreateForm.getValues('end_time') || "",
//                                                                     onChange: (value) => timeTemplateCreateForm.setValue('end_time', value)
//                                                                 }}
//                                                                 disabled={!isDateRangeSelected}
//                                                             />
//                                                         </div>
//                                                         <div>
//                                                             <FormLabel>課程</FormLabel>
//                                                             <p>課程將根據後端數據自動分配</p>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </>
//                                         ) : (
//                                             <p>請先選擇開始和完結日子</p>
//                                         )}
//                                     </div>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     {/* Days */}
//                     <FormField
//                         control={timeTemplateCreateForm.control}
//                         name="days"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>選日子</FormLabel>
//                                 <FormControl>
//                                     <div>
//                                         <Controller
//                                             name="days"
//                                             control={timeTemplateCreateForm.control}
//                                             render={({ field: { onChange, value } }) => (
//                                                 <DatePicker
//                                                     multiple
//                                                     value={value ? value.map(day => new Date(day.date)) : []}
//                                                     minDate={dayStart ? new Date(dayStart) : null}
//                                                     maxDate={dayEnd ? new Date(dayEnd) : null}
//                                                     onChange={(dates) => {
//                                                         setSelectedDays(dates);
//                                                         const formattedDays = dates.map(date => ({
//                                                             date: date.format("YYYY-MM-DD"),
//                                                             start_time: "",
//                                                             end_time: "",
//                                                             lesson: ""
//                                                         }));
//                                                         onChange(formattedDays);
//                                                     }}
//                                                     format="YYYY-MM-DD"
//                                                     disabled={!isDateRangeSelected}
//                                                 />
//                                             )}
//                                         />
//                                         {selectedDays.length > 0 && (
//                                             <ul className="space-y-4 mt-2">
//                                                 {selectedDays.map((day, index) => (
//                                                     <li key={index} className="border p-2 rounded">
//                                                         <div><strong>日期:</strong> {day.format("YYYY-MM-DD")}</div>
//                                                         <div className="flex space-x-2 mt-1">
//                                                             <div>
//                                                                 <label>開始時間:</label>
//                                                                 <SWR_Class_Time
//                                                                     field={{
//                                                                         value: field.value[index]?.start_time || "",
//                                                                         onChange: (value) => updateDayField(index, 'start_time', value)
//                                                                     }}
//                                                                 />
//                                                             </div>
//                                                             <div>
//                                                                 <label>完結時間:</label>
//                                                                 <SWR_Class_Time
//                                                                     field={{
//                                                                         value: field.value[index]?.end_time || "",
//                                                                         onChange: (value) => updateDayField(index, 'end_time', value)
//                                                                     }}
//                                                                 />
//                                                             </div>
//                                                             <div>
//                                                                 <label>課程:</label>
//                                                                 <SWR_Class_Lesson
//                                                                     field={{
//                                                                         value: field.value[index]?.lesson || "",
//                                                                         onChange: (value) => updateDayField(index, 'lesson', value)
//                                                                     }}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </div>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     {/* Hidden Start Time */}
//                     <FormField
//                         control={timeTemplateCreateForm.control}
//                         name="start_time"
//                         render={({ field }) => (
//                             <FormItem className="hidden">
//                                 <FormLabel>開始時間</FormLabel>
//                                 <FormControl>
//                                     <SWR_Class_Time field={field} disabled={!isDateRangeSelected} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     {/* Hidden End Time */}
//                     <FormField
//                         control={timeTemplateCreateForm.control}
//                         name="end_time"
//                         render={({ field }) => (
//                             <FormItem className="hidden">
//                                 <FormLabel>完結時間</FormLabel>
//                                 <FormControl>
//                                     <SWR_Class_Time field={field} disabled={!isDateRangeSelected} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     {/* Hidden Lesson */}
//                     <FormField
//                         control={timeTemplateCreateForm.control}
//                         name="lesson"
//                         render={({ field }) => (
//                             <FormItem className="hidden">
//                                 <FormLabel>課程</FormLabel>
//                                 <FormControl>
//                                     <SWR_Class_Lesson field={field} disabled={!isDateRangeSelected} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <Button type="submit" disabled={!isDateRangeSelected}>提交</Button>
//                 </form>
//             </Form>
//         </>
//     );
// };

// export default timeTemplateCreateForm;

"use client";

import React, { useState, useEffect, useTransition } from "react";
import * as z from "zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation"; // 引入 useRouter
import DatePicker, { DateObject } from "react-multi-date-picker";
import { daySchema, timetemplate_create_Schema } from "@/actions/Create-TimeTemplate/schema";
import useSWR from "swr";
import { createtimetemplate } from "@/actions/Create-TimeTemplate";
import { SWR_Class_Time } from "@/components/fatchdata/swrclass_tiime";
import { SWR_Class_Lesson } from "@/components/fatchdata/swrclass_lesson";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


// 定義 API 回應數據的類型
interface PublicHoliday {
  publicholiday: string[];
}

interface CourseLesson {
  course_lesson: string;
}

// 輔助函數：檢查日期是否有效並格式化
const formatDate = (dateStr: string | undefined): string | null => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
};
const SupTimeTemplateCreateForm = () => {
  const params = useParams();
  const SupadminId = params.supadminid as string;
    const router = useRouter(); // 初始化 useRouter
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const fetcher = (...args: Parameters<typeof fetch>): Promise<CourseLesson[]> =>
    fetch(...args).then((res) => res.json());
  const { data } = useSWR(`${apiUrl}/api/course_data/courselessons/`, fetcher);
  const [isPending, startTransition] = useTransition();
  const [selectedDays, setSelectedDays] = useState<DateObject[]>([]);
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState<{ [key: number]: boolean }>({});
  const [GetPublicHolidays, setGetPublicHolidays] = useState<PublicHoliday[]>([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);

  

  
  const timeTemplateCreateForm = useForm<z.infer<typeof timetemplate_create_Schema>>({
    resolver: zodResolver(timetemplate_create_Schema),
    defaultValues: {
      title: "",
      day_start: "",
      day_end: "",
      publicHoliday: [],
      weekdays: [],
      days: [],
      start_time: "",
      end_time: "",
      lesson: "",
    },
  });

  const { fields } = useFieldArray({
    control: timeTemplateCreateForm.control,
    name: "days",
  });

  useEffect(() => {
    const fetchPublicHolidaysData = async () => {
      try {
        setIsLoadingHolidays(true);
        const res = await fetch("/api/PublicHoliday_Lists", {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result: PublicHoliday[] = await res.json();
        console.log("Raw API response:", result);
        setGetPublicHolidays(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("獲取公眾假期失敗:", error);
        setGetPublicHolidays([]);
      } finally {
        setIsLoadingHolidays(false);
      }
    };
    fetchPublicHolidaysData();
  }, []);

  // useEffect(() => {
  //   const holidaysArray =
  //     Array.isArray(GetPublicHolidays) && GetPublicHolidays.length > 0 && GetPublicHolidays[0].publicholiday
  //       ? GetPublicHolidays[0].publicholiday
  //       : [];
  //   console.log("holidaysArray before mapping:", holidaysArray);
  //   const PublicHolidays = holidaysArray
  //     .map((date) => formatDate(date))
  //     .filter((date): date is string => date !== null);
  //   console.log("Formatted PublicHolidays:", PublicHolidays);
  //   timeTemplateCreateForm.setValue("publicHoliday", PublicHolidays);
  // }, [GetPublicHolidays, timeTemplateCreateForm]);

  useEffect(() => {
      // 扁平化所有 publicholiday 陣列並去重
      const holidaysArray = GetPublicHolidays
        .flatMap((record) => record.publicholiday) // 將所有 publicholiday 陣列扁平化
        .map((date) => formatDate(date)) // 格式化日期
        .filter((date): date is string => date !== null) // 過濾無效日期
        .filter((date, index, self) => self.indexOf(date) === index); // 去重
      console.log("Formatted and deduplicated PublicHolidays:", holidaysArray);
      timeTemplateCreateForm.setValue("publicHoliday", holidaysArray);
    }, [GetPublicHolidays, timeTemplateCreateForm]);

  const watchedStartTime = timeTemplateCreateForm.watch("start_time");
  const watchedEndTime = timeTemplateCreateForm.watch("end_time");

  useEffect(() => {
    if (dayStart && dayEnd && data && Object.values(selectedWeekdays).some(Boolean)) {
      const startDate = new Date(dayStart);
      const endDate = new Date(dayEnd);
      const weekdays: z.infer<typeof daySchema>[] = [];
      const currentDate = new Date(startDate);
      let courseIndex = 0;

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (selectedWeekdays[dayOfWeek + 1]) {
          const course = data[courseIndex % data.length];
          weekdays.push({
            date: currentDate.toISOString().split("T")[0],
            start_time: timeTemplateCreateForm.getValues("start_time") || "",
            end_time: timeTemplateCreateForm.getValues("end_time") || "",
            lesson: course ? course.course_lesson : "",
          });
          courseIndex++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      timeTemplateCreateForm.setValue(
        "weekdays",
        weekdays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
    } else {
      timeTemplateCreateForm.setValue("weekdays", []);
    }
  }, [dayStart, dayEnd, selectedWeekdays, data, watchedStartTime, watchedEndTime, timeTemplateCreateForm]);

  useEffect(() => {
    if (selectedDays.length > 0) {
      const days: z.infer<typeof daySchema>[] = selectedDays.map((day: DateObject) => ({
        date: day.format("YYYY-MM-DD"),
        start_time: "",
        end_time: "",
        lesson: "",
      }));
      timeTemplateCreateForm.setValue("days", days);
    } else {
      timeTemplateCreateForm.setValue("days", []);
    }
  }, [selectedDays, timeTemplateCreateForm]);

  const handleWeekdayChange = (dayIndex: number, checked: boolean) => {
    setSelectedWeekdays((prev) => ({ ...prev, [dayIndex]: checked }));
  };

  const isDateRangeSelected = dayStart && dayEnd && !isNaN(new Date(dayStart).getTime()) && !isNaN(new Date(dayEnd).getTime());
  const isWeekdaySelected = Object.values(selectedWeekdays).some(Boolean);

  const timeTemplateCreateFormOnSubmit = (values: z.infer<typeof timetemplate_create_Schema>) => {
    startTransition(async () => {
      const result = await createtimetemplate(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("時間表創建成功！");
        // 客戶端跳轉
        router.push(`/supadmin/${SupadminId}/timetemplateLists`);
      }
    });
  };

  return (
      <>
        <br />
        <Form {...timeTemplateCreateForm}>
          <form onSubmit={timeTemplateCreateForm.handleSubmit(timeTemplateCreateFormOnSubmit)} className="space-y-4">
            {/* Day Start */}
            <FormField
              control={timeTemplateCreateForm.control}
              name="day_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>開始日子</FormLabel>
                  <FormControl>
                    <Controller
                      name="day_start"
                      control={timeTemplateCreateForm.control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value || ""}
                          format="YYYY-MM-DD"
                          onChange={(date: DateObject) => {
                            const isoDate = date ? date.format("YYYY-MM-DD") : "";
                            onChange(isoDate);
                            setDayStart(isoDate);
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            {/* Day End */}
            <FormField
              control={timeTemplateCreateForm.control}
              name="day_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>完結日子</FormLabel>
                  <FormControl>
                    <Controller
                      name="day_end"
                      control={timeTemplateCreateForm.control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value || ""}
                          format="YYYY-MM-DD"
                          onChange={(date: DateObject) => {
                            const isoDate = date ? date.format("YYYY-MM-DD") : "";
                            onChange(isoDate);
                            setDayEnd(isoDate);
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
{/* Public Holidays */}
          <div>
            <FormLabel>公眾假期：</FormLabel>
            {isLoadingHolidays ? (
              <span>載入中...</span>
            ) : Array.isArray(GetPublicHolidays) && GetPublicHolidays.length > 0 ? (
              <div>
                {GetPublicHolidays
                  .flatMap((record) => record.publicholiday) // 扁平化所有 publicholiday
                  .map((date) => formatDate(date)) // 格式化日期
                  .filter((date): date is string => date !== null) // 過濾無效日期
                  .filter((date, index, self) => self.indexOf(date) === index) // 去重
                  .map((date, index) => (
                    <span key={index} className="inline-block mr-2">
                      {date}
                    </span>
                  ))}
              </div>
            ) : (
              <span>無公眾假期數據</span>
            )}
          </div>
  
            {/* Title */}
            <FormField
              control={timeTemplateCreateForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>標題</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="標題" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            {/* Weekdays */}
            <FormField
              control={timeTemplateCreateForm.control}
              name="weekdays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>選週日子</FormLabel>
                  <FormControl>
                    <div>
                      {isDateRangeSelected ? (
                        <>
                          {["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"].map((day, index) => (
                            <div key={index}>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={selectedWeekdays[index + 1] || false}
                                  onChange={(e) => handleWeekdayChange(index + 1, e.target.checked)}
                                  disabled={!isDateRangeSelected}
                                />
                                {day}
                              </label>
                            </div>
                          ))}
                          {Object.values(selectedWeekdays).some(Boolean) && (
                            <div className="mt-4 space-y-2">
                              <div>
                                <FormLabel>開始時間</FormLabel>
                                <FormField
                                  control={timeTemplateCreateForm.control}
                                  name="start_time"
                                  render={({ field }) => (
                                    <FormControl>
                                      <SWR_Class_Time field={field} disabled={!isDateRangeSelected} />
                                    </FormControl>
                                  )}
                                />
                              </div>
                              <div>
                                <FormLabel>完結時間</FormLabel>
                                <FormField
                                  control={timeTemplateCreateForm.control}
                                  name="end_time"
                                  render={({ field }) => (
                                    <FormControl>
                                      <SWR_Class_Time field={field} disabled={!isDateRangeSelected} />
                                    </FormControl>
                                  )}
                                />
                              </div>
                              <div>
                                <FormLabel>課程</FormLabel>
                                <p>課程將根據後端數據自動分配</p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p>請先選擇開始和完結日子</p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            {/* Days */}
            <FormField
              control={timeTemplateCreateForm.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>選日子</FormLabel>
                  <FormControl>
                    <div>
                      <Controller
                        name="days"
                        control={timeTemplateCreateForm.control}
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            multiple
                            value={value ? value.map((day) => day.date) : []}
                            minDate={dayStart && !isNaN(new Date(dayStart).getTime()) ? new Date(dayStart) : undefined}
                            maxDate={dayEnd && !isNaN(new Date(dayEnd).getTime()) ? new Date(dayEnd) : undefined}
                            onChange={(dates: DateObject[]) => {
                              setSelectedDays(dates);
                              const formattedDays: z.infer<typeof daySchema>[] = dates.map((date) => ({
                                date: date.format("YYYY-MM-DD"),
                                start_time: "",
                                end_time: "",
                                lesson: "",
                              }));
                              onChange(formattedDays);
                            }}
                            format="YYYY-MM-DD"
                            disabled={!isDateRangeSelected}
                          />
                        )}
                      />
                      {selectedDays.length > 0 && (
                        <ul className="space-y-4 mt-2">
                          {selectedDays.map((day: DateObject, index) => (
                            <li key={index} className="border p-2 rounded">
                              <div>
                                <strong>日期:</strong> {day.format("YYYY-MM-DD")}
                              </div>
                              <div className="flex space-x-2 mt-1">
                                <div>
                                  <label>開始時間:</label>
                                  <Controller
                                    name={`days.${index}.start_time`}
                                    control={timeTemplateCreateForm.control}
                                    render={({ field }) => <SWR_Class_Time field={field} />}
                                  />
                                </div>
                                <div>
                                  <label>完結時間:</label>
                                  <Controller
                                    name={`days.${index}.end_time`}
                                    control={timeTemplateCreateForm.control}
                                    render={({ field }) => <SWR_Class_Time field={field} />}
                                  />
                                </div>
                                <div>
                                  <label>課程:</label>
                                  <Controller
                                    name={`days.${index}.lesson`}
                                    control={timeTemplateCreateForm.control}
                                    render={({ field }) => <SWR_Class_Lesson field={field} />}
                                  />
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            {/* Hidden Start Time */}
            <FormField
              control={timeTemplateCreateForm.control}
              name="start_time"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>開始時間</FormLabel>
                  <FormControl>
                    <SWR_Class_Time field={field} disabled={!isDateRangeSelected} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            {/* Hidden End Time */}
            <FormField
              control={timeTemplateCreateForm.control}
              name="end_time"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>完結時間</FormLabel>
                  <FormControl>
                    <SWR_Class_Time field={field} disabled={!isDateRangeSelected} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            {/* Hidden Lesson */}
            <FormField
              control={timeTemplateCreateForm.control}
              name="lesson"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>課程</FormLabel>
                  <FormControl>
                    <SWR_Class_Lesson field={field} disabled={!isDateRangeSelected} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <Button type="submit" disabled={!isDateRangeSelected || isPending}>
              提交
            </Button>
          </form>
        </Form>
      </>
    );
};

export default SupTimeTemplateCreateForm;