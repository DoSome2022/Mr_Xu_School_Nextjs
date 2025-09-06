// "use client";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import useSWR from "swr";
// import { ControllerRenderProps } from "react-hook-form";

// // 定義 API 返回數據的介面
// interface SchoolYear {
//   id: string;
//   school_year: string;
// }

// // 定義組件的 props 介面，與 BookList_Create_Form 的 schema 匹配
// interface SWRSchoolYearProps {
//   field: ControllerRenderProps<
//     { name: string; grade: number; img: string; school_booklist_id: string; school_name: string; year: string },
//     "year"
//   >;
//   disabled?: boolean;
// }

// // 定義 fetcher 的類型，與 fetch API 相符
// const fetcher = (url: string, ...args: any[]): Promise<SchoolYear[]> =>
//   fetch(url, ...args).then((res) => res.json());

// export const SWR_School_Year = ({ field, disabled }: SWRSchoolYearProps) => {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
//   const { data, error, isLoading } = useSWR<SchoolYear[], Error>(
//     `${apiUrl}/api/School_data/schoolyears`,
//     fetcher
//   );

//   if (error) return <div className="text-red-500">錯誤: {error.message}</div>;
//   if (isLoading) return <div className="text-gray-500">載入中...</div>;

//   return (
//     <Select defaultValue={field.value} onValueChange={field.onChange} disabled={disabled}>
//       <SelectTrigger>
//         <SelectValue placeholder="選擇年份" />
//       </SelectTrigger>
//       <SelectContent>
//         {data?.length ? (
//           data.map((datas) => (
//             <SelectItem value={datas.school_year} key={datas.id}>
//               {datas.school_year}
//             </SelectItem>
//           ))
//         ) : (
//           <div className="text-gray-500 p-2">無年份資料</div>
//         )}
//       </SelectContent>
//     </Select>
//   );
// };

// export default SWR_School_Year;



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
interface SchoolYear {
  id: string;
  school_year: string;
}

// 使用泛型定義 props，確保表單結構包含 year 字段
interface SWRSchoolYearProps<T extends Record<string, any> & { year: string }> {
  field: ControllerRenderProps<T, "year" & Path<T>>;
  disabled?: boolean;
}

// 定義 fetcher 的類型，與 fetch API 相符
const fetcher = (url: string, ...args: any[]): Promise<SchoolYear[]> =>
  fetch(url, ...args).then((res) => res.json());

export const SWR_School_Year = <T extends Record<string, any> & { year: string }>({
  field,
  disabled,
}: SWRSchoolYearProps<T>) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR<SchoolYear[], Error>(
    `${apiUrl}/api/School_data/schoolyears`,
    fetcher
  );

  if (error) return <div className="text-red-500">錯誤: {error.message || "無法載入年份資料"}</div>;
  if (isLoading) return <div className="text-gray-500">載入中...</div>;

  return (
    <Select defaultValue={field.value} onValueChange={field.onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="選擇年份" />
      </SelectTrigger>
      <SelectContent>
        {data?.length ? (
          data.map((datas) => (
            <SelectItem value={datas.school_year} key={datas.id}>
              {datas.school_year}
            </SelectItem>
          ))
        ) : (
          <div className="text-gray-500 p-2">無年份資料</div>
        )}
      </SelectContent>
    </Select>
  );
};

export default SWR_School_Year;