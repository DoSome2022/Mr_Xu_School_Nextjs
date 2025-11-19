"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";
import useSWR from "swr";

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
import { parent_student_ex_pager_create_schema } from "@/actions/Create-Parent_Student_Ex_pager/schema";
import { createparentstudentexpager } from "@/actions/Create-Parent_Student_Ex_pager";

interface SchoolData {
  id: string;
  school_name: string;
}

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

const Parent_Student_ExpageLists_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{
    parentId: string;
    studentid: string;
  }>();
  const router = useRouter();
  const ParentID = params?.parentId;
  const StudentID = params?.studentid;

  // 驗證路由參數
  if (!ParentID || !StudentID) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [fileBase64, setFileBase64] = useState<string>("");
  const [originalFileName, setOriginalFileName] = useState<string>("");

  const form = useForm<z.infer<typeof parent_student_ex_pager_create_schema>>({
    resolver: zodResolver(parent_student_ex_pager_create_schema),
    defaultValues: {
      parentid: ParentID,
      name: "",
      student_ex_paper_id: StudentID,
      student_name: "",
      grade: 0,
      year: "",
      school: "",
      img: "",
      quarter: 0,
      subject: "",
      originalFileName: "",
    },
  });

  const fetcher = <T,>(url: string, init?: RequestInit): Promise<T> =>
    fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        ...init?.headers,
        "Cache-Control": "no-cache",
      },
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://localhost:3000";

  // 獲取學校資料
  const { data: schoolData, error: schoolError, isLoading: schoolLoading } = useSWR<SchoolData[]>(
    `${apiUrl}/api/School_Lists/`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 獲取學生資料
  const { data: studentData, error: studentError, isLoading: studentLoading } = useSWR<StudentData[]>(
    `${apiUrl}/api/Parents_Student/Parents_Student_Lists_detail_data_by_id/${StudentID}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 設置學生名稱
  useEffect(() => {
    if (studentData && studentData.length > 0 && studentData[0]?.name && !form.getValues("student_name")) {
      form.setValue("student_name", studentData[0].name);
    }
  }, [studentData, form]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("schoolData:", schoolData, "-- End --");
    console.log("studentData:", studentData, "-- End --");
    console.log("form.student_name:", form.getValues("student_name"), "-- End --");
  }

  // 錯誤處理
  if (schoolError || studentError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入資料 - {(schoolError || studentError)?.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (schoolLoading || studentLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 驗證學校資料
  const validSchoolData = schoolData?.filter((d) => d.school_name && d.school_name.trim() !== "") || [];
  if (!schoolData || validSchoolData.length === 0) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無有效的學校資料
      </div>
    );
  }

  // 驗證學生資料
  if (
    !studentData ||
    !Array.isArray(studentData) ||
    studentData.length === 0 ||
    !studentData.every((item) => item.id && item.name && typeof item.grade === "number" && item.school)
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的學生資料格式
      </div>
    );
  }

  // 文件處理函數
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        form.setError("img", { message: "文件大小不能超過 10MB" });
        return;
      }
      setOriginalFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFileBase64(base64String);
        form.setValue("img", base64String);
        form.setValue("originalFileName", file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof parent_student_ex_pager_create_schema>) => {
    console.log("Upload started:", values);
    startTransition(async () => {
      try {
        const result = await createparentstudentexpager(values);
        if (result.success === "true" && result.data) {
          toast.success("上傳成功");
          await mutate(`/api/Parents_Student/Parents_Student_Lists_detail_data_by_id/${StudentID}`);
          router.push(`/parent/${ParentID}/profiles/${StudentID}/upload/expageLists`);
          form.reset();
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>檔案名稱</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="檔案名稱" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="student_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>學生名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending || !!studentData?.[0]?.name}
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
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>學校</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇學校" />
                    </SelectTrigger>
                    <SelectContent>
                      {validSchoolData.map((d) => (
                        <SelectItem value={d.school_name} key={d.id}>
                          {d.school_name}
                        </SelectItem>
                      ))}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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

        <div className="space-y-4">
          <FormField
            control={form.control}
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
        </div>

        {fileBase64 && (
          <div className="text-sm text-gray-500">
            已選擇文件: {originalFileName}
          </div>
        )}

        <Button disabled={isPending} type="submit">
          建立
        </Button>
      </form>
    </Form>
  );
};

export default Parent_Student_ExpageLists_Create_Form;