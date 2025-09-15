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

interface SWRClassRoomProps {
  field: ControllerRenderProps<any, any>;
  className?: string;
  disabled?: boolean;
}

interface CourseRoom {
  id: string;
  course_room: string;
}

export const SWR_Class_Room = ({ field, className, disabled }: SWRClassRoomProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR<CourseRoom[]>(
    `${apiUrl}/api/course_data/courserooms/`,
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
        <SelectValue>{field.value || "選擇課室"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data?.map((datas) => (
          <SelectItem value={datas.course_room} key={datas.id}>
            {datas.course_room}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};