// components/fatchdata/swrschool_quarter.tsx
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

const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then((res) => res.json());

// 定义 API 回应数据的类型
interface SchoolQuarter {
  id: string;
  school_quarter: string;
}

// 修改泛型定义，使 field 类型更灵活
interface SWR_School_QuarterProps {
  field: ControllerRenderProps<any, any>; // 放宽类型限制
  disabled?: boolean;
}

export const SWR_School_Quarter = ({ field, disabled }: SWR_School_QuarterProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR<SchoolQuarter[]>(
    `${apiUrl}/api/School_data/schoolquarters/`,
    fetcher
  );

  if (error) return <div>錯誤: {error.message}</div>;
  if (isLoading) return <div>載入中...</div>;

  return (
    <Select
      value={field.value?.toString() || ""}
      onValueChange={(value) => field.onChange(Number(value))}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="選擇季度" />
      </SelectTrigger>
      <SelectContent>
        {data?.map((datas) => (
          <SelectItem key={datas.id} value={datas.school_quarter}>
            {datas.school_quarter}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
// // components/fatchdata/swrschool_quarter.tsx
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
// import { Score_Create_Schema } from "@/actions/Create-Score/schema";
// import { z } from "zod";

// const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then((res) => res.json());

// // 定義 API 回應數據的類型
// interface SchoolQuarter {
//   id: string;
//   school_quarter: string;
// }

// // 定義 props 介面
// interface SWR_School_QuarterProps {
//   field: ControllerRenderProps<z.infer<typeof Score_Create_Schema>, "quarter">;
//   disabled?: boolean;
// }

// export const SWR_School_Quarter = ({ field, disabled }: SWR_School_QuarterProps) => {
//   const { data, error, isLoading } = useSWR<SchoolQuarter[]>(
//     "http://127.0.0.1:8000/api/School_data/schoolquarters/",
//     fetcher
//   );

//   if (error) return <div>錯誤: {error.message}</div>;
//   if (isLoading) return <div>載入中...</div>;

//   return (
//     <Select
//       value={field.value?.toString() || ""}
//       onValueChange={(value) => field.onChange(Number(value))}
//       disabled={disabled}
//     >
//       <SelectTrigger>
//         <SelectValue placeholder="選擇季度" />
//       </SelectTrigger>
//       <SelectContent>
//         {data?.map((datas) => (
//           <SelectItem key={datas.id} value={datas.school_quarter}>
//             {datas.school_quarter}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// };