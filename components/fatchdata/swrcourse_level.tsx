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

// 定義 fetcher 的參數為元組類型
const fetcher = (url: string, init?: RequestInit) => fetch(url, init).then((res) => res.json());

interface SWRCourseLevelProps {
  field: ControllerRenderProps<any, any>;
  className?: string;
  disabled?: boolean;
}

interface CourseLevel {
  id: string;
  course_level: string;
}

export const SWR_Course_Level = ({ field, className, disabled }: SWRCourseLevelProps) => {
  const { data, error, isLoading } = useSWR<CourseLevel[]>(
    "http://127.0.0.1:8000/api/course_data/courselevels",
    fetcher
  );

  if (error) return <div>錯誤: {error.message}</div>;
  if (isLoading) return <div>載入中...</div>;

  return (
    <Select
      defaultValue={String(field.value)}
      onValueChange={(value) => field.onChange(value)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="選擇難度" />
      </SelectTrigger>
      <SelectContent>
        {data?.map((datas) => (
          <SelectItem value={datas.course_level} key={datas.id}>
            {datas.course_level}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};