"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import useSWR from "swr";
import { Control, ControllerRenderProps } from "react-hook-form";

// 定義 API 返回數據的介面
interface SchoolSubject {
  id: string;
  school_subject: string;
}

// 定義組件的 props 介面
interface SWRSchoolSubjectCheckboxProps {
  teacher_data: Control<{ subject: string[] }>;
}

// 定義 fetcher 的類型，與 fetch API 相符
const fetcher = (url: string, ...args: any[]): Promise<SchoolSubject[]> =>
  fetch(url, ...args).then((res) => res.json());

export const SWR_School_Subject_checkbox = ({ teacher_data }: SWRSchoolSubjectCheckboxProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR<SchoolSubject[], Error>(
    `${apiUrl}/api/School_data/schoolsubjects`,
    fetcher
  );

  if (error) return <div className="text-red-500">錯誤: {error.message}</div>;
  if (isLoading) return <div className="text-gray-500">載入中...</div>;

  return (
    <div className="space-y-4">
      <FormLabel className="text-base">科目</FormLabel>
      {data?.length ? (
        data.map((datas) => (
          <FormField
            key={datas.id}
            control={teacher_data}
            name="subject"
            render={({ field }: { field: ControllerRenderProps<{ subject: string[] }, "subject"> }) => (
              <FormItem
                key={datas.id}
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value.includes(datas.school_subject)}
                    onCheckedChange={(checked) => {
                      console.log(`Checked state for ${datas.school_subject}:`, checked);
                      if (checked) {
                        field.onChange([...field.value, datas.school_subject]);
                        console.log("Updated field value:", [...field.value, datas.school_subject]);
                      } else {
                        field.onChange(field.value.filter((item) => item !== datas.school_subject));
                        console.log(
                          "Updated field value:",
                          field.value.filter((item) => item !== datas.school_subject)
                        );
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">{datas.school_subject}</FormLabel>
              </FormItem>
            )}
          />
        ))
      ) : (
        <div className="text-gray-500">無科目資料</div>
      )}
      <FormMessage />
    </div>
  );
};

export default SWR_School_Subject_checkbox;