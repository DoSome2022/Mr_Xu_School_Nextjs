// app/[您的路徑]/Course_Update_Form.tsx

"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams ,useRouter} from "next/navigation";
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
// import { SWR_Course_Level } from "../fatchdata/swrcourse_level";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { Course_Update_Schema } from "@/actions/Update-Course/schema";
import { update_Course } from "@/actions/Update-Course";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

// 定義介面
interface Teacher {
  id: string;
  username: string;
  role: string;
}

interface Course {
  id: string;
  course_name: string;
  course_subject: string;
  persons: number;
  grade: number;
  teacher: string;
  course_teacher_data_id: string[];
  day_start: string;
  day_end: string;
  start_time: string;
  end_time: string;
  publicholiday_model: string[];
  weekdays: string[];
}

// 輔助函數：格式化日期
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
};

// 輔助函數：格式化時間
const formatTime = (timeStr: string | undefined): string => {
  if (!timeStr) return "N/A";
  const hours = timeStr.slice(0, 2);
  const minutes = timeStr.slice(2, 4);
  return `${hours}:${minutes}`;
};

const Course_Update_Form = () => {
  const params = useParams();
  const router = useRouter(); // 新增 useRouter
  const courseId = params?.coursedetailbyID as string;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [GetTeacherData, setGetTeacherData] = useState<Teacher[]>([]);
  const [GetCourseData, setGetCourseData] = useState<Course[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [teacherRes, courseRes] = await Promise.all([
          fetch("/api/Course_data_teacher", {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          }),
          fetch(`/api/Course_detail_data_by_id_findMany/${courseId}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          }),
        ]);

        if (!teacherRes.ok) throw new Error("無法獲取教師數據");
        const teacherResult = await teacherRes.json();
        setGetTeacherData(Array.isArray(teacherResult) ? teacherResult : []);

        if (!courseRes.ok) throw new Error("無法獲取課程數據");
        const courseResult = await courseRes.json();
        setGetCourseData(Array.isArray(courseResult) ? courseResult : [courseResult]);
      } catch (error: any) {
        console.error("數據獲取失敗:", error);
        setError("無法載入數據");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    } else {
      setError("無效的課程ID");
      setLoading(false);
    }
  }, [courseId]);

  const course_create_form = useForm<z.infer<typeof Course_Update_Schema>>({
    resolver: zodResolver(Course_Update_Schema),
    defaultValues: {
      courseId: courseId,
      course_name: "",
      course_subject: "",
      persons: 0,
      grade: 0,
      teacher: "",
      course_teacher_data_id: [],
    },
  });

  useEffect(() => {
    if (GetCourseData && GetCourseData[0]) {
      course_create_form.setValue("course_name", GetCourseData[0].course_name || "");
      course_create_form.setValue("course_subject", GetCourseData[0].course_subject || "");
      course_create_form.setValue("persons", GetCourseData[0].persons || 0);
      course_create_form.setValue("grade", GetCourseData[0].grade || 0);
      course_create_form.setValue("teacher", GetCourseData[0].teacher || "");
      course_create_form.setValue("course_teacher_data_id", GetCourseData[0].course_teacher_data_id || []);
    }
  }, [GetCourseData, course_create_form]);

  const course_create_form_onSubmit = (values: z.infer<typeof Course_Update_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      update_Course(values).then((result) => {
        if (result?.success) {
          setSuccess("課程更新成功！");
          course_create_form.reset({
            courseId: courseId,
            course_name: values.course_name,
            course_subject: values.course_subject,
            persons: values.persons,
            grade: values.grade,
            teacher: values.teacher,
            course_teacher_data_id: values.course_teacher_data_id,
          });
          // 客戶端重定向
          router.push(`/admin/courseLists/${courseId}`);
        } else {
          setError(result?.error || "更新失敗，請重試。");
        }
      });
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

  console.log("CourseData : ", GetCourseData, "-- End --");

  return (
    <div className="min-h-screen bg-gray-100 pt-20 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
        {/* 課程數據顯示區域 */}
        {GetCourseData && GetCourseData[0] ? (
          <div className="mb-8 border-b pb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">課程詳情</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-medium">課程名稱:</p>
                <p className="text-gray-800">{GetCourseData[0].course_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">課程科目:</p>
                <p className="text-gray-800">{GetCourseData[0].course_subject || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">人數:</p>
                <p className="text-gray-800">{GetCourseData[0].persons || 0}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">年級:</p>
                <p className="text-gray-800">{GetCourseData[0].grade || 0}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">老師:</p>
                <p className="text-gray-800">{GetCourseData[0].teacher || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">開始日期:</p>
                <p className="text-gray-800">{formatDate(GetCourseData[0].day_start)}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">結束日期:</p>
                <p className="text-gray-800">{formatDate(GetCourseData[0].day_end)}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">開始時間:</p>
                <p className="text-gray-800">{formatTime(GetCourseData[0].start_time)}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">結束時間:</p>
                <p className="text-gray-800">{formatTime(GetCourseData[0].end_time)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 font-medium">公眾假期:</p>
                <p className="text-gray-800">
                  {GetCourseData[0].publicholiday_model?.length > 0
                    ? GetCourseData[0].publicholiday_model.map((date) => formatDate(date)).join(", ")
                    : "無"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 font-medium">工作日:</p>
                <p className="text-gray-800">
                  {GetCourseData[0].weekdays?.length > 0
                    ? GetCourseData[0].weekdays.map((date) => formatDate(date)).join(", ")
                    : "無"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 text-center">
            <p className="text-gray-600">無課程數據可顯示</p>
          </div>
        )}

        {/* 表單標題已移除，因為課程名稱已包含在課程詳情中 */}

        {/* 表單內容 */}
        <Form {...course_create_form}>
          <form onSubmit={course_create_form.handleSubmit(course_create_form_onSubmit)} className="space-y-6">
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className="space-y-4">
              <FormField
                control={course_create_form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">課程ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        placeholder={courseId}
                        type="text"
                        className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={course_create_form.control}
                name="course_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">課程名稱</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程名稱"
                        type="text"
                        className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={course_create_form.control}
                name="course_subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">課程科目</FormLabel>
                    <FormControl>
                      <SWR_School_Subject
                        field={field}
                        className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
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
                        className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={course_create_form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">年級</FormLabel>
                    <FormControl>
                      <SWR_School_Grade
                        field={field}
                        className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
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
                control={course_create_form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">老師</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedTeacher = GetTeacherData.find((data) => data.username === value);
                          if (selectedTeacher?.id) {
                            course_create_form.setValue("course_teacher_data_id", [selectedTeacher.id]);
                          }
                        }}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300">
                          <SelectValue placeholder="選擇老師" />
                        </SelectTrigger>
                        <SelectContent>
                          {GetTeacherData.map(
                            (data) =>
                              data.role === "TEACHER" && (
                                <SelectItem key={data.id} value={data.username}>
                                  {data.username}
                                </SelectItem>
                              )
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
              className="w-full bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              {isPending ? "正在提交..." : "更改課程"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Course_Update_Form;