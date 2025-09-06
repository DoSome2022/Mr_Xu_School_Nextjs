"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import { ControllerRenderProps, Path } from "react-hook-form";

// 定義 API 返回數據的介面
interface UserRole {
  id: string;
  user_role: string;
}

// 使用泛型定義 props，確保表單結構包含指定的字段
interface SWRUserRoleProps<T extends Record<string, any> & { user_role: string }> {
  field: ControllerRenderProps<T, "user_role" & Path<T>>;
  disabled?: boolean;
}

// 定義 fetcher 的類型，與 fetch API 相符
const fetcher = (...args: Parameters<typeof fetch>): Promise<UserRole[]> =>
  fetch(...args).then((res) => res.json());

export const SWR_User_Role = <T extends Record<string, any> & { user_role: string }>({
  field,
  disabled,
}: SWRUserRoleProps<T>) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR<UserRole[], Error>(
    `${apiUrl}/api/user_role/userroles/`,
    fetcher
  );

  if (error) return <div className="text-red-500">錯誤: {error.message || "無法載入角色資料"}</div>;
  if (isLoading) return <div className="text-gray-500">載入中...</div>;

  return (
    <Select defaultValue={field.value} onValueChange={field.onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="選擇權限" />
      </SelectTrigger>
      <SelectContent>
        {data?.length ? (
          data.map((datas) => (
            <SelectItem value={datas.user_role} key={datas.id}>
              {datas.user_role}
            </SelectItem>
          ))
        ) : (
          <div className="text-gray-500 p-2">無角色資料</div>
        )}
      </SelectContent>
    </Select>
  );
};

export default SWR_User_Role;