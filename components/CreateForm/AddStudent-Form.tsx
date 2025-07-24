"use client";

import { useParams } from "next/navigation";
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
import { AddStudent_Create_Schema } from "@/actions/Create-AddStudent/schema";
import { createAddStudent } from "@/actions/Create-AddStudent";

const Add_Student_Form = () => {
  const params = useParams();
  const courseId = params?.coursedetailbyID as string;
  const [GetStudentData, setGetStudentData] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await fetch(`/api/student/Student_AllLists`);
        if (!res.ok) throw new Error("斷線！");
        const result = await res.json();
        setGetStudentData(result);
      } catch (error) {
        console.error("獲取學生數據失敗:", error);
      }
    };
    fetchStudentData();
  }, []);

  const form = useForm<z.infer<typeof AddStudent_Create_Schema>>({
    resolver: zodResolver(AddStudent_Create_Schema),
    defaultValues: {
      courseId: courseId,
      student: [],
    },
  });

  const onSubmit = (values: z.infer<typeof AddStudent_Create_Schema>) => {
    startTransition(async () => {
      const result = await createAddStudent(values);
      if (result?.error) {
        console.error(result.error);
      }
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]); // 清空結果如果搜索欄為空
      return;
    }
    try {
      const response = await fetch(
        `/api/AddStudent_Lists_search?query=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("搜索請求失敗");
      const data = await response.json();
      setSearchResults(data);
      console.log("搜索結果:", data);
    } catch (error) {
      console.error("搜尋失敗:", error);
      setSearchResults([]);
    }
  };

  const renderCheckbox = (student: any) => {
    // if (student.pay === true) {
      return (
        <FormField
          control={form.control}
          name="student"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
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
                />
              </FormControl>
              <FormLabel className="font-normal">{student.name}</FormLabel>
            </FormItem>
          )}
        />
      );
    // }
    return null;
  };

  const displayData = searchQuery && searchResults.length > 0 ? searchResults : GetStudentData;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="輸入搜索內容..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="button" onClick={handleSearch}>
          搜索
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormLabel>學生</FormLabel>
            {displayData.length === 0 ? (
              <p>{searchQuery ? "沒有找到匹配的學生" : "沒有數據"}</p>
            ) : (
              displayData.map((student: any) => (
                <div key={student.id}>{renderCheckbox(student)}</div>
              ))
            )}
          </div>

          <Button disabled={isPending} type="submit">
            加入
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Add_Student_Form;