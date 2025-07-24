"use client";

import { useParams } from "next/navigation";
import { useEffect, useState ,useTransition} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Leave_Student_schema } from "@/actions/Leave-Student/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Leave_Student_Action } from "@/actions/Leave-Student";
import { Checkbox } from "@/components/ui/checkbox";

// 定義接口
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
  const [isPending, startTransition] = useTransition();
  const CourseId = params?.coursedetailbyID as string;
  const ClassId = params?.classdetailbyID as string;

  const [GetClassDataById, setGetClassDataById] = useState<ClassData | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // 初始化表單
  const form = useForm<z.infer<typeof Leave_Student_schema>>({
    resolver: zodResolver(Leave_Student_schema),
    defaultValues: {
      name: [],
      CourseId: CourseId,
      targetclassId: ClassId,
      currentclassId: ClassId,
      class_date: "",
      date: "",
    },
  });

  // 獲取課程詳情並設置 class_date
  useEffect(() => {
    if (ClassId) {
      const getClassDetail = async (id: string) => {
        try {
          const res = await fetch(`/api/Class_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法載入課程資料！");
          }
          const result = await res.json();
          setGetClassDataById(result[0]);
          if (result[0]?.class_date) {
            form.setValue("class_date", result[0].class_date);
          } else {
            setError("課程日期不可用");
          }
        } catch (err) {
          console.error("載入錯誤:", err);
          setError("無法載入課程資料");
        }
      };
      getClassDetail(ClassId);
    }
  }, [ClassId, form]);

  // 表單提交處理
  const onSubmit = (values: z.infer<typeof Leave_Student_schema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        // 設置當前系統時間（格式：YYYY-MM-DD）
        const currentDate = new Date().toISOString().split("T")[0]; // 例如 "2025-05-21"

        // 驗證 currentDate 格式
        if (!/^\d{4}-\d{2}-\d{2}$/.test(currentDate)) {
          throw new Error("生成的提交日期格式無效");
        }


        console.log(" currentDate : ", currentDate , "-- END")

        const updatedValues = {
          ...values,
          date: currentDate,
        };

        const result = await Leave_Student_Action(updatedValues);
        if (result.success) {
          setSuccess("提交成功！");
          form.reset({
            name: [],
            CourseId: CourseId,
            targetclassId: ClassId,
            currentclassId: ClassId,
            class_date: GetClassDataById?.class_date || "",
            date: "",
          });
          alert("請假記錄已提交。");
        } else {
          setError(result.error || "提交失敗，請重試。");
          alert(result.error || "提交失敗，請重試。");
          console.error("提交結果錯誤:", result.error);
        }
      } catch (err: any) {
        // 捕獲 NEXT_REDIRECT 錯誤，表示伺服器端重定向已觸發
        if (err.message === "NEXT_REDIRECT") {
          setSuccess("提交成功！");
          form.reset({
            name: [],
            CourseId: CourseId,
            targetclassId: ClassId,
            currentclassId: ClassId,
            class_date: GetClassDataById?.class_date || "",
            date: "",
          });
          alert("請假記錄已提交。");
        } else if (err instanceof z.ZodError) {
          // 處理 zod 驗證錯誤
          const errorMessage = err.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join("; ");
          setError(errorMessage || "表單資料格式錯誤");
          alert(errorMessage || "表單資料格式錯誤");
          console.error("Zod 驗證錯誤:", err.errors);
        } else {
          setError(err.message || "提交時發生錯誤，請稍後再試。");
          alert(err.message || "提交時發生錯誤，請稍後再試。");
          console.error("提交錯誤:", err);
        }
      }
    });
  };
  const currentDate = new Date().toISOString().split("T")[0]; // 例如 "2025-05-21"

  console.log(" currentDate : ", currentDate , "-- END")
  console.log("GetClassDataById : ", GetClassDataById);
  console.log("-- Bug --",  form.formState.errors ,"--END--")
 

  return (
    <div className="p-4">
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>選擇請假學生</FormLabel>
                <div className="space-y-2">
                  {GetClassDataById?.student?.length ? (
                    GetClassDataById.student.map((student) => (
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
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{student.name}</FormLabel>
                      </FormItem>
                    ))
                  ) : (
                    <p className="text-gray-500">沒有可用的學生資料</p>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 顯示 class_date 以供確認 */}
          <FormField
            control={form.control}
            name="class_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>課程日期</FormLabel>
                <FormControl>
                  <input type="text" readOnly value={field.value} className="border p-2 rounded" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? "提交中..." : "提交請假"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LeaveStudentForm;