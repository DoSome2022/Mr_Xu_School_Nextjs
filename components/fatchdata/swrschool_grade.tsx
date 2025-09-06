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

const gradeMapping: { [key: number]: string } = {
  1: "小學1年級",
  2: "小學2年級",
  3: "小學3年級",
  4: "小學4年級",
  5: "小學5年級",
  6: "小學6年級",
  7: "初中1年級",
  8: "初中2年級",
  9: "初中3年級",
  10: "高中1年級",
  11: "高中2年級",
  12: "高中3年級",
};

// 定義 fetcher 的參數為元組類型
const fetcher = (url: string, init?: RequestInit) => fetch(url, init).then((res) => res.json());

interface SWRSchoolGradeProps {
  field: ControllerRenderProps<any, any>;
  className?: string;
  disabled?: boolean;
}


// // SWR_School_Grade.tsx
// interface SWRSchoolGradeProps<T extends Record<string, any> & { grade: number }> {
//   field: ControllerRenderProps<T, "grade" & Path<T>>;
//   disabled?: boolean;
// }

interface SchoolGrade {
  id: string;
  school_grade: number;
}

export const SWR_School_Grade = ({ field, className, disabled }: SWRSchoolGradeProps) => {
  const { data, error, isLoading } = useSWR<SchoolGrade[]>(
    "http://127.0.0.1:8000/api/School_data/schoolgrades/",
    fetcher
  );

  if (error) return <div>error: {error.message}</div>;
  if (isLoading) return <div>載入中...</div>;

  return (
    <Select
      defaultValue={String(field.value)}
      onValueChange={(value) => field.onChange(Number(value))}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue>{gradeMapping[field.value] || "選擇年級"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data?.map((datas) => (
          <SelectItem value={String(datas.school_grade)} key={datas.id}>
            {gradeMapping[datas.school_grade]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};