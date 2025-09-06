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
interface SchoolPrice {
  id: string;
  primary_school_price: number;
  middle_school_price: number;
  high_school_price: number;
}

// 定義組件的 props 介面
interface SWRSchoolPriceProps {
  field: ControllerRenderProps<{ school_price: string }, "school_price">;
}

// 定義 fetcher 的類型，與 fetch API 相符
const fetcher = (url: string, ...args: any[]): Promise<SchoolPrice[]> =>
  fetch(url, ...args).then((res) => res.json());

export const SWR_School_Price = ({ field }: SWRSchoolPriceProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR<SchoolPrice[], Error>(
    `${apiUrl}/api/School_data/schoolprices`,
    fetcher
  );

  if (error) return <div className="text-red-500">錯誤: {error.message}</div>;
  if (isLoading) return <div className="text-gray-500">載入中...</div>;

  return (
    <Select defaultValue={field.value} onValueChange={field.onChange}>
      <SelectTrigger>
        <SelectValue placeholder="選擇價格" />
      </SelectTrigger>
      <SelectContent>
        {data?.length ? (
          data.map((datas) => (
            <SelectItem value={datas.id} key={datas.id}>
              小學: {datas.primary_school_price} | 中學: {datas.middle_school_price} | 高中: {datas.high_school_price}
            </SelectItem>
          ))
        ) : (
          <div className="text-gray-500 p-2">無價格資料</div>
        )}
      </SelectContent>
    </Select>
  );
};

export default SWR_School_Price;