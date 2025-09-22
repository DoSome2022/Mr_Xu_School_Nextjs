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

interface SWRSchoolSubjectProps {
  field: ControllerRenderProps<any, any>;
  className?: string;
  disabled?: boolean;
}

interface SchoolSubject {
  id: string;
  school_subject: string;
}

export const SWR_School_Subject = ({ field, className, disabled }: SWRSchoolSubjectProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR<SchoolSubject[]>(
    "http://127.0.0.1:8000/api/School_data/schoolsubjects/",
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
        <SelectValue placeholder="選擇科目" />
      </SelectTrigger>
      <SelectContent>
        {data?.map((datas) => (
          <SelectItem value={datas.school_subject} key={datas.id}>
            {datas.school_subject}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};