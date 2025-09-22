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
interface SchoolBranch {
  id: string;
  school_branch: string;
}

// 定義組件的 props 介面
interface SWRSchoolBranchDataProps {
  field: ControllerRenderProps<{ school_branch: string }, "school_branch">;
}

// 定義 fetcher 的類型，與 fetch API 相符
const fetcher = (url: string, ...args: any[]): Promise<SchoolBranch[]> =>
  fetch(url, ...args).then((res) => res.json());

export const SWR_School_Branch_Data = ({ field }: SWRSchoolBranchDataProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR<SchoolBranch[], Error>(
    `${apiUrl}/api/school_branch_campus/schoolbranchDatas`,
    fetcher
  );

  if (error) return <div className="text-red-500">錯誤: {error.message}</div>;
  if (isLoading) return <div className="text-gray-500">載入中...</div>;

  return (
    <Select defaultValue={field.value} onValueChange={field.onChange}>
      <SelectTrigger>
        <SelectValue placeholder="選擇學校分校" />
      </SelectTrigger>
      <SelectContent>
        {data?.length ? (
          data.map((datas) => (
            <SelectItem value={datas.school_branch} key={datas.id}>
              {datas.school_branch}
            </SelectItem>
          ))
        ) : (
          <div className="text-gray-500 p-2">無分校資料</div>
        )}
      </SelectContent>
    </Select>
  );
};

export default SWR_School_Branch_Data;