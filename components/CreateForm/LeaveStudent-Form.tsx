// components/LeaveStudentForm.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Leave_Student_schema } from "@/actions/Leave-Student/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Leave_Student_Action } from "@/actions/Leave-Student";

interface ClassData {
  id: string;
  class_date: string;
  student: StudentData[];
}

interface StudentData {
  name: string;
}

const LeaveStudentForm = () => {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const courseId = params?.coursedetailbyID as string;
  const classId = params?.classdetailbyID as string;

  const [GetClassDataById, setGetClassDataById] = useState<ClassData[] | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);

  const form = useForm<z.infer<typeof Leave_Student_schema>>({
    resolver: zodResolver(Leave_Student_schema),
    defaultValues: {
      name: [],
      CourseId: courseId,
      targetclassId: classId,
      currentclassId: classId,
      class_date: "",
      date: "",
    },
  });

  useEffect(() => {
    if (classId) {
      const getClassDetail = async (id: string) => {
        setLoading(true);
        setError("");
        try {
          const res = await fetch(`/api/Class_detail_data_by_id/${id}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error("無法載入課程資料！");
          }
          const result = await res.json();
          setGetClassDataById(result);
          if (result[0]?.class_date) {
            form.setValue("class_date", result[0].class_date);
          } else {
            setError("課程日期不可用");
          }
        } catch (err: any) {
          console.error("載入錯誤:", err);
          setError("無法載入課程資料");
        } finally {
          setLoading(false);
        }
      };
      getClassDetail(classId);
    } else {
      setError("無效的課堂ID");
      setLoading(false);
    }
  }, [classId, form]);

  const onSubmit = (values: z.infer<typeof Leave_Student_schema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0];
        if (!/^\d{4}-\d{2}-\d{2}$/.test(currentDate)) {
          throw new Error("生成的提交日期格式無效");
        }

        const updatedValues = {
          ...values,
          date: currentDate,
        };

        const result = await Leave_Student_Action(updatedValues);
        if (result.success) {
          setSuccess("請假記錄創建成功，正在跳轉...");
          form.reset({
            name: [],
            CourseId: courseId,
            targetclassId: classId,
            currentclassId: classId,
            class_date: GetClassDataById && GetClassDataById[0]?.class_date || "",
            date: "",
          });
          setTimeout(() => {
            router.push(`/admin/courseLists/${courseId}/classLists/${classId}`);
          }, 2000); // 2秒後跳轉
        } else {
          setError(result.error || "提交失敗，請重試。");
        }
      } catch (err: any) {
        setError(err.message || "提交時發生錯誤，請稍後再試。");
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

  const classData = GetClassDataById && GetClassDataById[0];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">
        課堂日期: {classData?.class_date || "載入中..."}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {success && (
            <div className="text-green-500 bg-green-100 p-3 rounded-md">{success}</div>
          )}
          {error && (
            <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>
          )}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">選擇請假學生</FormLabel>
                <div className="space-y-2">
                  {classData?.student?.length ? (
                    classData.student.map((student) => (
                      <FormItem
                        key={student.name}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value.includes(student.name)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...field.value, student.name]
                                : field.value.filter((name) => name !== student.name);
                              field.onChange(updatedValue);
                            }}
                            className="border-gray-300 data-[state=checked]:bg-[#e7915b] data-[state=checked]:border-[#e7915b]"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormLabel className="text-gray-600 font-normal">
                          {student.name}
                        </FormLabel>
                      </FormItem>
                    ))
                  ) : (
                    <p className="text-gray-500">沒有可用的學生資料</p>
                  )}
                </div>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="class_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">課程日期</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    readOnly
                    value={field.value}
                    className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            {isPending ? "正在提交..." : "提交請假"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LeaveStudentForm;