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

// 定義 API 返回數據的介面，基於 Prisma 的 School_branch_campus 模型
interface SchoolBranchArea {
  id: string;
  school_branch_Area: string;
}

// 定義組件的 props 介面
interface SWRSchoolBranchAreaDataProps {
  field: ControllerRenderProps<{ school_branch_area: string }, "school_branch_area">;
}

// 定義 fetcher 的類型，與 fetch API 相符
const fetcher = (url: string, ...args: any[]): Promise<SchoolBranchArea[]> =>
  fetch(url, ...args).then((res) => res.json());

export const SWR_School_Branch_Area_Data = ({ field }: SWRSchoolBranchAreaDataProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR<SchoolBranchArea[], Error>(
    `${apiUrl}/api/school_branch_campus/schoolbranchareaDatas`,
    fetcher
  );

  if (error) return <div className="text-red-500">錯誤: {error.message}</div>;
  if (isLoading) return <div className="text-gray-500">載入中...</div>;

  return (
    <Select defaultValue={field.value} onValueChange={field.onChange}>
      <SelectTrigger>
        <SelectValue placeholder="選擇分校區" />
      </SelectTrigger>
      <SelectContent>
        {data?.length ? (
          data.map((datas) => (
            <SelectItem value={datas.school_branch_Area} key={datas.id}>
              {datas.school_branch_Area}
            </SelectItem>
          ))
        ) : (
          <div className="text-gray-500 p-2">無分校區資料</div>
        )}
      </SelectContent>
    </Select>
  );
};