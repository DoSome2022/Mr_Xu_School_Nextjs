
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SupAddStudent_Create_Schema } from "@/actions/supadmin/Create-AddStudent/schema";
import { SupcreateAddStudent } from "@/actions/supadmin/Create-AddStudent";
import { FormSuccess } from "@/components/form-success";

interface StudentData {
  id: string;
  name: string;
  pay?: boolean;
}

const Add_Student_Formbysupadmin = () => {
  const params = useParams();
  const courseId = params?.coursedetailbyID as string;
  const supadminId = params?.supadminid as string;
  const [GetStudentData, setGetStudentData] = useState<StudentData[]>([]);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentData[]>([]);
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/student/Student_AllLists`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) throw new Error("無法獲取學生數據");
        const result = await res.json();
        setGetStudentData(result);
      } catch (error: any) {
        console.error("獲取學生數據失敗:", error);
        setError("無法載入學生數據");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  const form = useForm<z.infer<typeof SupAddStudent_Create_Schema>>({
    resolver: zodResolver(SupAddStudent_Create_Schema),
    defaultValues: {
      courseId: courseId,
      student: [],
    },
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/AddStudent_Lists_search?query=${encodeURIComponent(searchQuery)}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            }
      );
      if (!response.ok) throw new Error("搜索請求失敗");
      const data = await response.json();
      setSearchResults(data);
      console.log("搜索結果:", data);
    } catch (error) {
      console.error("搜尋失敗:", error);
      setError("搜尋失敗，請稍後重試");
    }
  };

const onSubmit = (values: z.infer<typeof SupAddStudent_Create_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      SupcreateAddStudent(values).then((result) => {
        if (result?.success) {
          setSuccess("學生添加成功！");
          form.reset({
            courseId: courseId,
            student: [],
          });
          // 客戶端重定向
          router.push(`/supadmin/${supadminId}/courseLists/${courseId}`);
        } else {
          setError(result?.error || "添加學生失敗，請重試。");
        }
      });
    });
  };

  const renderCheckbox = (student: StudentData) => {
    // 僅顯示已支付的學生（根據原邏輯）
    if (student.pay === true) {
      return (
        <FormField
          control={form.control}
          name="student"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 py-2">
              <FormControl>
                <Checkbox
                  checked={field.value.includes(student.name)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      field.onChange([...field.value, student.name]);
                    } else {
                      field.onChange(
                        field.value.filter((item: string) => item !== student.name)
                      );
                    }
                  }}
                  disabled={isPending}
                  className="border-gray-300 focus:ring-[#e7915b]"
                />
              </FormControl>
              <FormLabel className="text-gray-600 font-normal">{student.name}</FormLabel>
            </FormItem>
          )}
        />
      );
    }
    return null;
  };

  const displayData = searchQuery && searchResults.length > 0 ? searchResults : GetStudentData;

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>
        )}
        <FormSuccess message={success} />
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <Input
              type="text"
              placeholder="輸入學生姓名進行搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e7915b] transition-colors duration-300"
              disabled={isPending}
            />
            <Button
              type="button"
              onClick={handleSearch}
              className="bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
              disabled={isPending}
            >
              搜索
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300"
              disabled={isPending}
            >
              清除
            </Button>
          </div>
          <FormField
            control={form.control}
            name="student"
            render={() => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">學生</FormLabel>
                <div className="grid gap-2 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-md">
                  {displayData.length === 0 ? (
                    <p className="text-gray-600">
                      {searchQuery ? "沒有找到匹配的學生" : "沒有可用的學生數據"}
                    </p>
                  ) : (
                    displayData.map((student) => renderCheckbox(student))
                  )}
                </div>
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
          {isPending ? "正在加入..." : "加入學生"}
        </Button>
      </form>
    </Form>
  );
};

export default Add_Student_Formbysupadmin;


