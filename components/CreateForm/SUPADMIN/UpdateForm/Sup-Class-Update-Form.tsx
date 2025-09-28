"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation"; // 添加 useRouter
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
import { Switch } from "@/components/ui/switch";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { z } from "zod";
import Link from "next/link";
import { SWR_Class_Time } from "@/components/fatchdata/swrclass_tiime";
import { SWR_Class_Room } from "@/components/fatchdata/swrclass_room";
import { SWR_Class_Lesson } from "@/components/fatchdata/swrclass_lesson";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SupClass_Update_Schema } from "@/actions/supadmin/Update-Class/schema";
import { SupupdateClass } from "@/actions/supadmin/Update-Class";

interface Teacher {
  id: string;
  username: string;
  role: string;
}

interface Course {
  id: string;
  course_name: string;
  persons: number;
  teacher: string;
  grade: number;
}

interface Class {
  id: string;
  title: string;
  class_lesson: string;
  classroom: string;
  teacher: string;
  class_start_time: string;
  class_end_time: string;
  class_time_h: number;
  grade: number;
  persons: number;
  node: number;
  class_date: string;
  class_subject: string;
  class_course_id: string;
  freq: string;
  cram: string;
  attend_number: number;
  allDay: boolean;
  isSubmittedform: boolean;
  isshow: boolean;
  attend_name: string[];
  addClass: any[];
  student: any[];
}

const Class_Updata_Custom_Form_v1bysupadmin = () => {
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const router = useRouter(); // 添加 useRouter
  const courseId = params?.coursedetailbyID as string;
  const classId = params?.classdetailbyID as string;
  const supadminId = params?.supadminid as string;
  const [selectedDates, setSelectedDates] = useState<Date | null>(null);
  const [countvalue, setCountvalue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [GetTeacherData, setGetTeacherData] = useState<Teacher[]>([]);
  const [GetCourseData, setGetCourseData] = useState<Course | null>(null);
  const [GetClassData, setGetClassData] = useState<Class[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [teacherRes, courseRes, classRes] = await Promise.all([
          fetch("/api/Course_data_teacher", {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          }),
          fetch(`/api/Course_detail_data_by_id_findMany/${courseId}`, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          }),
          fetch(`/api/Class_detail_data_by_id/${classId}`, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          }),
        ]);

        if (!teacherRes.ok) throw new Error("無法獲取教師數據");
        const teacherResult = await teacherRes.json();
        setGetTeacherData(teacherResult);

        if (!courseRes.ok) throw new Error("無法獲取課程數據");
        const courseResult = await courseRes.json();
        setGetCourseData(courseResult);

        if (!classRes.ok) throw new Error("無法獲取課堂數據");
        const classResult = await classRes.json();
        setGetClassData(Array.isArray(classResult) ? classResult : [classResult]);
      } catch (error: any) {
        console.error("數據獲取失敗:", error);
        setError("無法載入數據");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && classId) {
      fetchData();
    } else {
      setError("無效的課程或課堂ID");
      setLoading(false);
    }
  }, [courseId, classId]);

  const class_updata_custom_form = useForm<z.infer<typeof SupClass_Update_Schema>>({
    resolver: zodResolver(SupClass_Update_Schema),
    defaultValues: {
      classId: classId,
      freq: "",
      title: "",
      byweekday: "",
      allDay: false,
      class_start_time: "",
      class_end_time: "",
      class_time_h: 0,
      classroom: "",
      class_lesson: "",
      class_course_id: courseId,
      attend_number: 0,
      persons: 0,
      node: 0,
      teacher: "",
      grade: 0,
      cram: "",
      class_date: [],
    },
  });

  useEffect(() => {
    if (GetClassData.length > 0) {
      const classData = GetClassData[0];
      class_updata_custom_form.setValue("title", classData.title || "");
      class_updata_custom_form.setValue("class_lesson", classData.class_lesson || "");
      class_updata_custom_form.setValue("classroom", classData.classroom || "");
      class_updata_custom_form.setValue("teacher", classData.teacher || "");
      class_updata_custom_form.setValue("class_start_time", classData.class_start_time || "");
      class_updata_custom_form.setValue("class_end_time", classData.class_end_time || "");
      class_updata_custom_form.setValue("class_time_h", classData.class_time_h || 0);
      class_updata_custom_form.setValue("grade", classData.grade || 0);
      class_updata_custom_form.setValue("persons", classData.persons || 0);
      class_updata_custom_form.setValue("node", classData.node || 0);
      if (classData.class_date) {
        const date = new Date(classData.class_date);
        if (!isNaN(date.getTime())) {
          class_updata_custom_form.setValue("class_date", [date.toISOString().split("T")[0]]);
          setSelectedDates(date);
        }
      }
    }
    if (GetCourseData) {
      class_updata_custom_form.setValue("persons", GetCourseData.persons || 0);
      class_updata_custom_form.setValue("node", GetCourseData.persons || 0);
      class_updata_custom_form.setValue("teacher", GetCourseData.teacher || "");
      class_updata_custom_form.setValue("grade", GetCourseData.grade || 0);
    }
  }, [GetClassData, GetCourseData, class_updata_custom_form]);

  const handleChange = (newValues: any) => {
    const newDate = new Date(newValues);
    if (!isNaN(newDate.getTime())) {
      setSelectedDates(newDate);
      const formattedDate = newDate.toISOString().split("T")[0];
      class_updata_custom_form.setValue("class_date", [formattedDate]);
    }
  };

  const formatDate = (date: Date | string) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    if (isNaN(parsedDate.getTime())) return "無效日期";
    const dayOfWeek = ["(日)", "(一)", "(二)", "(三)", "(四)", "(五)", "(六)"];
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear() % 100;
    return `${year}-${month}-${day} ${dayOfWeek[parsedDate.getDay()]}`;
  };

  const allDay = class_updata_custom_form.watch("allDay");
  const startTime = class_updata_custom_form.watch("class_start_time");
  const endTime = class_updata_custom_form.watch("class_end_time");

  useEffect(() => {
    if (allDay) {
      class_updata_custom_form.setValue("class_start_time", "");
      class_updata_custom_form.setValue("class_end_time", "");
      class_updata_custom_form.setValue("class_time_h", 24);
    } else if (startTime && endTime) {
      const parseTime = (timeString: string) => {
        const cleanTime = timeString.replace(/\s+/g, "");
        const hours = parseInt(cleanTime.slice(0, 2), 10);
        const minutes = parseInt(cleanTime.slice(2, 4), 10);
        return isNaN(hours) || isNaN(minutes) ? NaN : hours * 60 + minutes;
      };

      const startMinutes = parseTime(startTime);
      const endMinutes = parseTime(endTime);
      const diffMinutes = endMinutes - startMinutes;
      const diff = diffMinutes / 60;

      if (diff <= 0 || isNaN(diff)) {
        class_updata_custom_form.setValue("class_time_h", 0);
        setCountvalue(0);
      } else {
        class_updata_custom_form.setValue("class_time_h", diff);
        setCountvalue(diff);
      }
    }
  }, [allDay, startTime, endTime, class_updata_custom_form]);

  const onSubmit = async (values: z.infer<typeof SupClass_Update_Schema>) => {
    console.log("表單提交數據:", values); // 除錯用
    startTransition(async () => {
      try {
        const result = await SupupdateClass(values);
        if (result?.error) {
          setError(result.error);
        } else {
          class_updata_custom_form.reset();
          router.push(`/supadmin/${supadminId}/courseLists/${courseId}/classLists/${classId}`); // 客戶端重定向
        }
      } catch (error: any) {
        if (error.message !== "NEXT_REDIRECT") {
          setError("更新班級失敗，請檢查輸入數據");
          console.error("表單提交錯誤:", error);
        }
      }
    });
  };

  if (loading) {
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
      <nav className="bg-[#e7915b] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">修改課堂</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`/admin/courseLists/${courseId}/classLists/${classId}`}
                className="text-white hover:bg-cyan-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                返回課堂詳情
              </Link>
              <Link
                href={`/admin/courseLists/${courseId}/classLists`}
                className="text-white hover:bg-cyan-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                返回課堂列表
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#e7915b] mb-6">
          課程名稱: {GetCourseData?.course_name || "載入中..."}
        </h2>
        {GetClassData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">當前課堂詳情</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">標題：</span>
                  {GetClassData[0].title}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">科目：</span>
                  {GetClassData[0].class_subject}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">日期：</span>
                  {formatDate(GetClassData[0].class_date)}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">老師：</span>
                  {GetClassData[0].teacher}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">開始時間：</span>
                  {GetClassData[0].class_start_time}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">結束時間：</span>
                  {GetClassData[0].class_end_time}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">課堂時數：</span>
                  {GetClassData[0].class_time_h} 小時
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">人數：</span>
                  {GetClassData[0].persons}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Form {...class_updata_custom_form}>
            <form
              onSubmit={class_updata_custom_form.handleSubmit(onSubmit)} // 使用新的 onSubmit 函數
              className="space-y-6"
            >
              {error && (
                <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>
              )}
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="class_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">日期</FormLabel>
                      <FormControl>
                        <div>
                          <DatePicker
                            value={selectedDates}
                            onChange={handleChange}
                            plugins={[<DatePanel key="date-panel" />]}
                            className="w-full border border-gray-300 rounded-md p-2 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                            containerStyle={{
                              width: "100%",
                            }}
                          />
                          <Input
                            {...field}
                            type="text"
                            value={selectedDates ? formatDate(selectedDates) : ""}
                            readOnly
                            className="mt-2 border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                            disabled={isPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">標題</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="輸入課堂標題"
                          type="text"
                          className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="allDay"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="text-gray-700 font-semibold">全日課程</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                          className="data-[state=checked]:bg-[#e7915b]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="class_start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">課堂開始時間</FormLabel>
                      <FormControl>
                        <SWR_Class_Time
                          field={field}
                          className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                          disabled={isPending || allDay}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="class_end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">課堂完結時間</FormLabel>
                      <FormControl>
                        <SWR_Class_Time
                          field={field}
                          className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                          disabled={isPending || allDay}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="class_time_h"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">課堂時數</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="課堂時數"
                          type="number"
                          value={countvalue}
                          readOnly
                          className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="classroom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">課堂課室</FormLabel>
                      <FormControl>
                        <SWR_Class_Room
                          field={field}
                          className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="class_lesson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">課堂節數</FormLabel>
                      <FormControl>
                        <SWR_Class_Lesson
                          field={field}
                          className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">年級</FormLabel>
                      <FormControl>
                        <SWR_School_Grade
                          field={field}
                          className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="persons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">課堂人數</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="輸入課堂人數"
                          type="number"
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                          className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="node"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">筆記數量</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="輸入筆記數量"
                          type="number"
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                          className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={class_updata_custom_form.control}
                  name="teacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">老師</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value}
                          disabled={isPending}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300">
                            <SelectValue placeholder="選擇老師" />
                          </SelectTrigger>
                          <SelectContent>
                            {GetTeacherData.length > 0 ? (
                              GetTeacherData.map(
                                (data) =>
                                  data.role === "TEACHER" && (
                                    <SelectItem key={data.id} value={data.username}>
                                      {data.username}
                                    </SelectItem>
                                  )
                              )
                            ) : (
                              <SelectItem value="none" disabled>
                                無教師可用
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={isPending}
                type="submit"
                className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
              >
                {isPending ? "正在提交..." : "修改課堂"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Class_Updata_Custom_Form_v1bysupadmin;