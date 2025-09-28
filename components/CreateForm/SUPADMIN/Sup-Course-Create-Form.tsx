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
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { useParams } from "next/navigation";
import { SupCourse_Create_Schema } from "@/actions/supadmin/Create-Course/schema";
import { Supcreate_Course } from "@/actions/supadmin/Create-Course";

interface User {
  id: string;
  username: string;
  role: "PARENT" | "TEACHER" | "ADMIN" | "SUPADMIN";
}

interface TimeTemplate {
  id: string;
  title: string;
  day_start: string;
  day_end: string;
  start_time: string;
  end_time: string;
  days: { date: string; start_time: string; end_time: string; lesson: string }[];
  weekdays: { date: string; start_time: string; end_time: string; lesson: string }[];
  publicHoliday_model: string[];
  grade: string;
}

interface ClassroomData {
  id: string;
  room: string;
}

const SupCourseCreateForm = () => {
  const param = useParams();
  const supadminid = param?.supadminid as string;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [GetTeacherData, setGetTeacherData] = useState<User[]>([]);
  const [GetSelectedTeacherID, setGetSelectedTeacherID] = useState<string[]>([]);
  const [GetTimeTemplateData, setGetTimeTemplateData] = useState<TimeTemplate[]>([]);
  const [selectedLCSData, setSelectedLCSData] = useState<TimeTemplate | null>(null);
  const [GetClassroomData, setGetClassroomData] = useState<ClassroomData[]>([]);

  useEffect(() => {
    const getTeacherData = async () => {
      try {
        const res = await fetch("/api/Course_data_teacher", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result: User[] = await res.json();
        setGetTeacherData(result);
      } catch (error) {
        console.error("獲取教師數據失敗:", error);
        setError("無法載入教師數據，請稍後重試");
      }
    };

    const getClassroomData = async () => {
      try {
        const res = await fetch("/api/ClassRoom_Lists", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result: ClassroomData[] = await res.json();
        setGetClassroomData(result);
      } catch (error) {
        console.error("獲取教室數據失敗:", error);
        setError("無法載入教室數據，請稍後重試");
      }
    };

    const getTTdata = async () => {
      try {
        const res = await fetch("/api/TimeTemplate_Lists", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();
        const normalizedData = result.map((item: any) => ({
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
          publicHoliday_model: Array.isArray(item.publicHoliday_model) ? item.publicHoliday_model : [],
        }));
        setGetTimeTemplateData(normalizedData);
      } catch (error) {
        console.error("獲取時間模組失敗:", error);
        setError("無法載入時間模組數據，請稍後重試");
      }
    };

    getTeacherData();
    getClassroomData();
    getTTdata();
  }, []);

  const courseCreateForm = useForm<z.infer<typeof SupCourse_Create_Schema>>({
    resolver: zodResolver(SupCourse_Create_Schema),
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
      publicHoliday_model: [], // 修正拼寫
      supadminid: supadminid,
    },
  });

  const handleTimeTemplateChange = (value: string) => {
    const selectedData = GetTimeTemplateData.find((data) => data.title === value);
    setSelectedLCSData(selectedData || null);
    if (selectedData) {
      courseCreateForm.setValue("TimeTemplateID", selectedData.id, { shouldValidate: true });
      courseCreateForm.setValue("day_start", selectedData.day_start, { shouldValidate: true });
      courseCreateForm.setValue("day_end", selectedData.day_end, { shouldValidate: true });
      courseCreateForm.setValue("start_time", selectedData.start_time, { shouldValidate: true });
      courseCreateForm.setValue("end_time", selectedData.end_time, { shouldValidate: true });
      courseCreateForm.setValue("days", selectedData.days, { shouldValidate: true });
      courseCreateForm.setValue("weekdays", selectedData.weekdays, { shouldValidate: true });
      courseCreateForm.setValue("publicHoliday_model", selectedData.publicHoliday_model || [], {
        shouldValidate: true,
      });
    } else {
      courseCreateForm.setValue("TimeTemplateID", "", { shouldValidate: true });
      courseCreateForm.setValue("day_start", "", { shouldValidate: true });
      courseCreateForm.setValue("day_end", "", { shouldValidate: true });
      courseCreateForm.setValue("start_time", "", { shouldValidate: true });
      courseCreateForm.setValue("end_time", "", { shouldValidate: true });
      courseCreateForm.setValue("days", [], { shouldValidate: true });
      courseCreateForm.setValue("weekdays", [], { shouldValidate: true });
      courseCreateForm.setValue("publicHoliday_model", [], { shouldValidate: true });
    }
  };

  const course_create_form_onSubmit = (values: z.infer<typeof SupCourse_Create_Schema>) => {
    console.log("-- create course輸入 -- : ", JSON.stringify(values, null, 2), "-- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      Supcreate_Course(values).then((result) => {
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          setSuccess(typeof result.success === "string" ? result.success : "課程創建成功");
        }
      });
    });
  };

  return (
    <Form {...courseCreateForm}>
      <form
        onSubmit={courseCreateForm.handleSubmit(course_create_form_onSubmit)}
        className="space-y-6 max-w-lg mx-auto p-4 bg-white rounded-md shadow"
      >
        <div className="space-y-4">
          <FormField
            control={courseCreateForm.control}
            name="course_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>課程名稱/課程ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="輸入課程名稱/課程ID" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={courseCreateForm.control}
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
            control={courseCreateForm.control}
            name="TimeTemplateID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>時間模組</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleTimeTemplateChange(value);
                    }}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇時間模組" />
                    </SelectTrigger>
                    <SelectContent>
                      {GetTimeTemplateData.length > 0 ? (
                        GetTimeTemplateData.map((data) => (
                          <SelectItem value={data.title} key={data.id}>
                            標題: {data.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          無時間模組可用
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={courseCreateForm.control}
            name="course_subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>課程科目</FormLabel>
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
            control={courseCreateForm.control}
            name="teacher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>老師</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const SelectedTeacher = GetTeacherData.find((data) => data.username === value);
                      if (SelectedTeacher?.id) {
                        const updatedIDs = [...GetSelectedTeacherID, SelectedTeacher.id];
                        setGetSelectedTeacherID(updatedIDs);
                        courseCreateForm.setValue("course_teacher_data_id", updatedIDs, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇老師" />
                    </SelectTrigger>
                    <SelectContent>
                      {GetTeacherData.length > 0 ? (
                        GetTeacherData.map((data) =>
                          data.role === "TEACHER" ? (
                            <SelectItem value={data.username} key={data.id}>
                              名：{data.username}
                            </SelectItem>
                          ) : null
                        )
                      ) : (
                        <SelectItem value="none" disabled>
                          無教師可用
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4" hidden>
          <FormField
            control={courseCreateForm.control}
            name="course_teacher_data_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="text" value={GetSelectedTeacherID.join(", ")} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={courseCreateForm.control}
            name="persons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>人數</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入人數"
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={courseCreateForm.control}
            name="classroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>課室</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇課室" />
                    </SelectTrigger>
                    <SelectContent>
                      {GetClassroomData.length > 0 ? (
                        GetClassroomData.map((data) => (
                          <SelectItem value={data.id} key={data.id}>
                            {data.room}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          無課室可用
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 隱藏字段 */}
        <div hidden>
          <FormField
            control={courseCreateForm.control}
            name="day_start"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={courseCreateForm.control}
            name="day_end"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={courseCreateForm.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={courseCreateForm.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={courseCreateForm.control}
            name="publicHoliday_model"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="hidden" value={field.value.join(", ")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={error} />
        <FormSuccess
          message={typeof success === "string" ? success : success ? "課程創建成功" : undefined}
        />
        <Button disabled={isPending} type="submit">
          建立
        </Button>
      </form>
    </Form>
  );
};

export default SupCourseCreateForm;