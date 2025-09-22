"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import { ControllerRenderProps } from "react-hook-form";

// 定義 API 返回數據的介面
interface SchoolLanguage {
  id: string;
  school_language: string;
}

// 定義組件的 props 介面，與 Node_Create_Form 的 schema 匹配
interface SWRSchoolLanguageProps {
  field: ControllerRenderProps<
    { name: string; grade: number; title: string; subject: string; img: string; teacher: string; author: string; answer: boolean; node_lesson: string; language: string },
    "language"
  >;
}

// 定義 fetcher 的類型，與 fetch API 相符
const fetcher = (url: string, ...args: any[]): Promise<SchoolLanguage[]> =>
  fetch(url, ...args).then((res) => res.json());

export const SWR_School_Language = ({ field }: SWRSchoolLanguageProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR<SchoolLanguage[], Error>(
    `${apiUrl}/api/School_data/schoollanguages`,
    fetcher
  );

  if (error) return <div className="text-red-500">錯誤: {error.message}</div>;
  if (isLoading) return <div className="text-gray-500">載入中...</div>;

  return (
    <Select defaultValue={field.value} onValueChange={field.onChange}>
      <SelectTrigger>
        <SelectValue placeholder="選擇語言" />
      </SelectTrigger>
      <SelectContent>
        {data?.length ? (
          data.map((datas) => (
            <SelectItem value={datas.school_language} key={datas.id}>
              {datas.school_language}
            </SelectItem>
          ))
        ) : (
          <div className="text-gray-500 p-2">無語言資料</div>
        )}
      </SelectContent>
    </Select>
  );
};

export default SWR_School_Language;