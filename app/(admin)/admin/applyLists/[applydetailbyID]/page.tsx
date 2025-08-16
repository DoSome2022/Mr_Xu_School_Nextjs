// "use client";

// import { useParams } from "next/navigation";
// import { startTransition, useEffect, useState } from "react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Apply_Accept_Schema } from "@/actions/Apply-Accept/schema";
// import { Apply_Reject_Schema } from "@/actions/Apply-Reject/schema";
// import { z } from "zod";
// import { AcceptApplyClass } from "@/actions/Apply-Accept";
// import { RejectApplyClass } from "@/actions/Apply-Reject";
// import WhatsAppButton from "@/components/whatappsButton/whatappsbtn";

// // 定義 ApplyData 的類型，根據 API 回傳數據
// interface ApplyData {
//   id: string;
//   title: string;
//   subject: string;
//   content: string;
//   apply: boolean;
//   isapply: boolean;
//   apply_student_id: string;
//   course_id: string;
//   course_name: string;
//   craetedAt: string;
//   createdata: string;
//   parent_id: string;
//   product_id: string;
//   username: string;
//   student: {
//     id: string;
//     name: string;
//     school: string;
//     grade: number;
//     student_id: string;
//   };
//   updatedAt: string;
// }

// // 定義 ParentData 的類型，根據 API 回傳數據
// interface ParentData {
//   id: string;
//   phone: string;
//   // 根據實際 API 回傳添加其他屬性
// }

// const ApplyDetail = () => {
//   const params = useParams();
//   const applydetailbyID = params.applydetailbyID as string;

//   // 使用正確的初始狀態和類型
//   const [GetApplyByIdData, setGetApplyByIdData] = useState<ApplyData | null>(null);
//   const [GetParentDatabyid, setGetParentDatabyid] = useState<ParentData[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   // 獲取申請數據
//   useEffect(() => {
//     const fetchApplyByIdData = async (id: string) => {
//       try {
//         const res = await fetch(`/api/Apply_Lists_By_Id/${id}`);
//         if (!res.ok) {
//           throw new Error("無法獲取申請數據");
//         }
//         const result = await res.json();
//         setGetApplyByIdData(result);
//       } catch (error: any) {
//         console.error("獲取申請數據失敗:", error);
//         setError("無法載入申請數據");
//       }
//     };
//     if (applydetailbyID) {
//       fetchApplyByIdData(applydetailbyID);
//     }
//   }, [applydetailbyID]);

//   // 獲取家長數據，僅在 parentId 存在時觸發
//   useEffect(() => {
//     const fetchParentByIdData = async (id: string) => {
//       try {
//         const res = await fetch(`/api/Parents_Lists_by_id/${id}`);
//         if (!res.ok) {
//           throw new Error("無法獲取家長數據");
//         }
//         const result = await res.json();
//         setGetParentDatabyid(result); // 假設 API 返回單個對象
//       } catch (error: any) {
//         console.error("獲取家長數據失敗:", error);
//         setError("無法載入家長數據");
//       }
//     };
//     if (GetApplyByIdData?.parent_id) {
//       fetchParentByIdData(GetApplyByIdData.parent_id);
//     }
//   }, [GetApplyByIdData?.parent_id]);

//   // 表單設置
//   const apply_status_Accept = useForm<z.infer<typeof Apply_Accept_Schema>>({
//     resolver: zodResolver(Apply_Accept_Schema),
//     defaultValues: {
//       applyId: applydetailbyID,
//     },
//   });

//   const apply_status_Reject = useForm<z.infer<typeof Apply_Reject_Schema>>({
//     resolver: zodResolver(Apply_Reject_Schema),
//     defaultValues: {
//       applyId: applydetailbyID,
//     },
//   });

//   // 提交處理
//   const apply_status_Accept_onSubmit = (values: z.infer<typeof Apply_Accept_Schema>) => {
//     console.log("-- apply_status_Accept_onSubmit -- : ", values, "-- End --");
//     startTransition(async () => {
//       try {
//         const result = await AcceptApplyClass(values);
//         if (result?.error) {
//           setError(result.error);
//         } else {
//           setError(null);
//           setGetApplyByIdData((prev) => (prev ? { ...prev, isapply: true } : prev));
//         }
//       } catch (error: any) {
//         console.error("接受申請失敗:", error);
//         setError("提交失敗，請稍後重試");
//       }
//     });
//   };

//   const apply_status_Reject_onSubmit = (values: z.infer<typeof Apply_Reject_Schema>) => {
//     console.log("-- apply_status_Reject_onSubmit -- : ", values, "-- End --");
//     startTransition(async () => {
//       try {
//         const result = await RejectApplyClass(values);
//         if (result?.error) {
//           setError(result.error);
//         } else {
//           setError(null);
//           setGetApplyByIdData((prev) => (prev ? { ...prev, isapply: true } : prev));
//         }
//       } catch (error: any) {
//         console.error("拒絕申請失敗:", error);
//         setError("提交失敗，請稍後重試");
//       }
//     });
//   };

//   // 載入中或錯誤狀態
//   if (!GetApplyByIdData) {
//     return <div className="p-4">載入中...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-red-500">{error}</div>;
//   }

//   console.log("-- GetApplyByIdData -- : ", GetApplyByIdData, "-- End --");

//   console.log("-- GetParentDatabyid -- : ", GetParentDatabyid, "-- End --");


//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold">申請詳情</h1>
//       <p>標題: {GetApplyByIdData.title}</p>
//       <p>主題: {GetApplyByIdData.subject}</p>
//       <p>內容: {GetApplyByIdData.content}</p>
//       <p>申請狀態: {GetApplyByIdData.apply ? "申請中" : "未申請"}</p>
//       <p>處理狀態: {GetApplyByIdData.isapply ? "已處理" : "未處理"}</p>

//       {GetParentDatabyid ? (
//         <WhatsAppButton whatappmessage={GetParentDatabyid[0]?.phone} />
//       ) : (
//         <p>載入家長資料中...</p>
//       )}

//       {GetApplyByIdData.isapply ? (
//         <p className="text-green-600 font-semibold">已處理</p>
//       ) : (
//         <div className="mt-4 space-y-4">
//           <Form {...apply_status_Accept}>
//             <form onSubmit={apply_status_Accept.handleSubmit(apply_status_Accept_onSubmit)}>
//               <Button type="submit" variant="default">
//                 接受
//               </Button>
//             </form>
//           </Form>

//           <Form {...apply_status_Reject}>
//             <form onSubmit={apply_status_Reject.handleSubmit(apply_status_Reject_onSubmit)}>
//               <Button type="submit" variant="destructive">
//                 拒絕
//               </Button>
//             </form>
//           </Form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ApplyDetail;


"use client";

import { useParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Apply_Accept_Schema } from "@/actions/Apply-Accept/schema";
import { Apply_Reject_Schema } from "@/actions/Apply-Reject/schema";
import { z } from "zod";
import { AcceptApplyClass } from "@/actions/Apply-Accept";
import { RejectApplyClass } from "@/actions/Apply-Reject";
import WhatsAppButton from "@/components/whatappsButton/whatappsbtn";
import Link from "next/link";

// 定義 ApplyData 的類型，根據 API 回傳數據
interface ApplyData {
  id: string;
  title: string;
  subject: string;
  content: string;
  apply: boolean;
  isapply: boolean;
  apply_student_id: string;
  course_id: string;
  course_name: string;
  craetedAt: string;
  createdata: string;
  parent_id: string;
  product_id: string;
  username: string;
  student: {
    id: string;
    name: string;
    school: string;
    grade: number;
    student_id: string;
  };
  updatedAt: string;
}

// 定義 ParentData 的類型，根據 API 回傳數據
interface ParentData {
  id: string;
  phone: string;
  // 根據實際 API 回傳添加其他屬性
}

const ApplyDetail = () => {
  const params = useParams();
  const applydetailbyID = params.applydetailbyID as string;

  const [GetApplyByIdData, setGetApplyByIdData] = useState<ApplyData | null>(null);
  const [GetParentDatabyid, setGetParentDatabyid] = useState<ParentData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 獲取申請數據
  useEffect(() => {
    const fetchApplyByIdData = async (id: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/Apply_Lists_By_Id/${id}`);
        if (!res.ok) {
          throw new Error("無法獲取申請數據");
        }
        const result = await res.json();
        setGetApplyByIdData(result);
      } catch (error: any) {
        console.error("獲取申請數據失敗:", error);
        setError("無法載入申請數據");
      } finally {
        setIsLoading(false);
      }
    };
    if (applydetailbyID) {
      fetchApplyByIdData(applydetailbyID);
    }
  }, [applydetailbyID]);

  // 獲取家長數據
  useEffect(() => {
    const fetchParentByIdData = async (id: string) => {
      try {
        const res = await fetch(`/api/Parents_Lists_by_id/${id}`);
        if (!res.ok) {
          throw new Error("無法獲取家長數據");
        }
        const result = await res.json();
        setGetParentDatabyid(result);
      } catch (error: any) {
        console.error("獲取家長數據失敗:", error);
        setError("無法載入家長數據");
      }
    };
    if (GetApplyByIdData?.parent_id) {
      fetchParentByIdData(GetApplyByIdData.parent_id);
    }
  }, [GetApplyByIdData?.parent_id]);

  // 表單設置
  const apply_status_Accept = useForm<z.infer<typeof Apply_Accept_Schema>>({
    resolver: zodResolver(Apply_Accept_Schema),
    defaultValues: {
      applyId: applydetailbyID,
    },
  });

  const apply_status_Reject = useForm<z.infer<typeof Apply_Reject_Schema>>({
    resolver: zodResolver(Apply_Reject_Schema),
    defaultValues: {
      applyId: applydetailbyID,
    },
  });

  // 提交處理
  const apply_status_Accept_onSubmit = (values: z.infer<typeof Apply_Accept_Schema>) => {
    console.log("-- apply_status_Accept_onSubmit -- : ", values, "-- End --");
    startTransition(async () => {
      try {
        const result = await AcceptApplyClass(values);
        if (result?.error) {
          setError(result.error);
        } else {
          setError(null);
          setGetApplyByIdData((prev) => (prev ? { ...prev, isapply: true } : prev));
        }
      } catch (error: any) {
        console.error("接受申請失敗:", error);
        setError("提交失敗，請稍後重試");
      }
    });
  };

  const apply_status_Reject_onSubmit = (values: z.infer<typeof Apply_Reject_Schema>) => {
    console.log("-- apply_status_Reject_onSubmit -- : ", values, "-- End --");
    startTransition(async () => {
      try {
        const result = await RejectApplyClass(values);
        if (result?.error) {
          setError(result.error);
        } else {
          setError(null);
          setGetApplyByIdData((prev) => (prev ? { ...prev, isapply: true } : prev));
        }
      } catch (error: any) {
        console.error("拒絕申請失敗:", error);
        setError("提交失敗，請稍後重試");
      }
    });
  };

  // 載入中或錯誤狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  console.log("-- GetApplyByIdData -- : ", GetApplyByIdData, "-- End --");
  console.log("-- GetParentDatabyid -- : ", GetParentDatabyid, "-- End --");

 return (
  <div className="min-h-screen bg-gray-100 pt-20">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#e7915b]">申請詳情</h1>
        <Link
          href="/admin/applyLists"
          className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
        >
          返回申請列表
        </Link>
      </div>
      {GetApplyByIdData ? (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="grid gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">標題</h2>
              <p className="text-gray-600">{GetApplyByIdData.title ?? "無標題"}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">主題</h2>
              <p className="text-gray-600">{GetApplyByIdData.subject ?? "無主題"}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">內容</h2>
              <p className="text-gray-600">{GetApplyByIdData.content ?? "無內容"}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">申請狀態</h2>
              <p className="text-gray-600">
                {GetApplyByIdData.apply ? "申請中" : "未申請"}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">處理狀態</h2>
              <p
                className={
                  GetApplyByIdData.isapply ? "text-green-600" : "text-red-600"
                }
              >
                {GetApplyByIdData.isapply ? "已處理" : "未處理"}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">課程名稱</h2>
              <Link
                href={`/admin/courseLists/${GetApplyByIdData.course_id}`}
                className="text-[#e7915b] hover:text-cyan-200 transition-colors duration-300"
              >
                {GetApplyByIdData.course_name ?? "無課程名稱"}
              </Link>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">學生信息</h2>
              <p className="text-gray-600">姓名: {GetApplyByIdData.student?.name ?? "無姓名"}</p>
              <p className="text-gray-600">學校: {GetApplyByIdData.student?.school ?? "無學校"}</p>
              <p className="text-gray-600">年級: {GetApplyByIdData.student?.grade ?? "無年級"}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">家長聯繫方式</h2>
              {GetParentDatabyid.length > 0 ? (
                <WhatsAppButton
                  whatappmessage={GetParentDatabyid[0]?.phone}
                  className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                />
              ) : (
                <p className="text-gray-600">載入家長資料中...</p>
              )}
            </div>
          </div>
          {!GetApplyByIdData.isapply && (
            <div className="mt-6 flex space-x-4">
              <Form {...apply_status_Accept}>
                <form
                  onSubmit={apply_status_Accept.handleSubmit(apply_status_Accept_onSubmit)}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                    disabled={apply_status_Accept.formState.isSubmitting}
                  >
                    {apply_status_Accept.formState.isSubmitting ? "處理中..." : "接受"}
                  </Button>
                </form>
              </Form>
              <Form {...apply_status_Reject}>
                <form
                  onSubmit={apply_status_Reject.handleSubmit(apply_status_Reject_onSubmit)}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    className="w-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
                    disabled={apply_status_Reject.formState.isSubmitting}
                  >
                    {apply_status_Reject.formState.isSubmitting ? "處理中..." : "拒絕"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">無法載入申請數據</p>
      )}
    </div>
  </div>
);
};

export default ApplyDetail;