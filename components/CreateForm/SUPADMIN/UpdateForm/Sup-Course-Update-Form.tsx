// app/[您的路徑]/Course_Update_Formbysupadmin.tsx

"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation"; // 新增 useRouter
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

import { Supupdate_Course } from "@/actions/supadmin/Update-Course"; // 更新為 Supupdate_Course
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SupCourse_Update_Schema } from "@/actions/supadmin/Update-Course/schema";

// 定義介面（保持不變）
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
  course_level?: string;
  teacher: string;
  course_teacher_data_id: string[];
  TimeTemplateID?: string;
  craetedAt?: string;
  updatedAt?: string;
  day_start: string;
  day_end: string;
  start_time: string;
  end_time: string;
  publicholiday_model: string[];
  weekdays: string[];
  isshow?: boolean;
}

// 輔助函數（保持不變）
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
};

const formatTime = (timeStr: string | undefined): string => {
  if (!timeStr) return "N/A";
  const hours = timeStr.slice(0, 2);
  const minutes = timeStr.slice(2, 4);
  return `${hours}:${minutes}`;
};

const formatArray = (arr: string[] | undefined): string => {
  if (!arr || arr.length === 0) return "無";
  return arr.map((item) => item || "N/A").join(", ");
};

const Course_Update_Formbysupadmin = () => {
  const params = useParams<{ coursedetailbyID: string; supadminid: string }>();
  const router = useRouter(); // 新增 useRouter
  const courseId = params?.coursedetailbyID as string;
  const supadminId = params?.supadminid as string; // 新增 supadminId
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
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          }),
          fetch(`/api/Course_detail_data_by_id_findMany/${courseId}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
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

  const course_create_form = useForm<z.infer<typeof SupCourse_Update_Schema>>({
    resolver: zodResolver(SupCourse_Update_Schema),
    defaultValues: {
      courseId: courseId,
      course_name: "",
      course_subject: "",
      persons: 0,
      grade: 0,
      teacher: "",
      course_teacher_data_id: [],
      supadminId: supadminId, // 新增 supadminId
    },
  });

  useEffect(() => {
    if (GetCourseData?.[0]) {
      course_create_form.reset({
        courseId: courseId,
        course_name: GetCourseData[0].course_name || "",
        course_subject: GetCourseData[0].course_subject || "",
        persons: GetCourseData[0].persons || 0,
        grade: GetCourseData[0].grade || 0,
        teacher: GetCourseData[0].teacher || "",
        course_teacher_data_id: GetCourseData[0].course_teacher_data_id || [],
        supadminId: supadminId,
      });
    }
  }, [GetCourseData, courseId, supadminId, course_create_form]);

  const course_create_form_onSubmit = (values: z.infer<typeof SupCourse_Update_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      Supupdate_Course(values).then((result) => { // 更新為 Supupdate_Course
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
            supadminId: supadminId,
          });
          // 客戶端重定向
          router.push(`/supadmin/${supadminId}/courseLists/${courseId}`);
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

  console.log("GetCourseData : ", GetCourseData, "-- End --");

  return (
    <div className="min-h-screen bg-gray-100 pt-20 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
        {/* 課程詳情區域（保持不變，參考之前的修改） */}
        {GetCourseData && GetCourseData[0] ? (
          <div className="mb-8 border-b pb-6">
            <h2 className="text-2xl font-semibold text-[#e7915b] mb-4">課程詳情</h2>
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
                <p className="text-gray-800">{GetCourseData[0].persons ?? "0"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">年級:</p>
                <p className="text-gray-800">{GetCourseData[0].grade ?? "0"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">老師:</p>
                <p className="text-gray-800">{GetCourseData[0].teacher || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">教師數據 ID:</p>
                <p className="text-gray-800">{formatArray(GetCourseData[0].course_teacher_data_id)}</p>
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
                <p className="text-gray-800">{formatArray(GetCourseData[0].publicholiday_model)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 font-medium">工作日:</p>
                <p className="text-gray-800">{formatArray(GetCourseData[0].weekdays)}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">時間模板 ID:</p>
                <p className="text-gray-800">{GetCourseData[0].TimeTemplateID || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">創建時間:</p>
                <p className="text-gray-800">{formatDate(GetCourseData[0].craetedAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">更新時間:</p>
                <p className="text-gray-800">{formatDate(GetCourseData[0].updatedAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">是否顯示:</p>
                <p className="text-gray-800">{GetCourseData[0].isshow ? "是" : "否"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 text-center">
            <p className="text-gray-600">無課程數據可顯示</p>
          </div>
        )}

        <h2 className="text-xl font-semibold text-[#e7915b] mb-6">編輯課程</h2>
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
                        className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
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
                        className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
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
                        <SelectTrigger className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300">
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
              className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              {isPending ? "正在提交..." : "更改課程"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Course_Update_Formbysupadmin;