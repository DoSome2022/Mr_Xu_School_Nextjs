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
import { z } from "zod";
import { AcceptApplyClass } from "@/actions/Apply-Accept";
import { RejectApplyClass } from "@/actions/Apply-Reject";
import WhatsAppButton from "@/components/whatappsButton/whatappsbtn";
import { Sup_Apply_Accept_Schema } from "@/actions/supadmin/Apply-Accept/schema";
import { Sup_Apply_Reject_Schema } from "@/actions/supadmin/Apply-Reject/schema";
import { SupAcceptApplyClass } from "@/actions/supadmin/Apply-Accept";
import { SupRejectApplyClass } from "@/actions/supadmin/Apply-Reject";

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

const ApplyDetailbysupadmin = () => {
  const params = useParams();
  const applydetailbyID = params.applydetailbyID as string;
  const supadminid = params.supadminid as string;


  // 使用正確的初始狀態和類型
  const [GetApplyByIdData, setGetApplyByIdData] = useState<ApplyData | null>(null);
  const [GetParentDatabyid, setGetParentDatabyid] = useState<ParentData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 獲取申請數據
  useEffect(() => {
    const fetchApplyByIdData = async (id: string) => {
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
      }
    };
    if (applydetailbyID) {
      fetchApplyByIdData(applydetailbyID);
    }
  }, [applydetailbyID]);

  // 獲取家長數據，僅在 parentId 存在時觸發
  useEffect(() => {
    const fetchParentByIdData = async (id: string) => {
      try {
        const res = await fetch(`/api/Parents_Lists_by_id/${id}`);
        if (!res.ok) {
          throw new Error("無法獲取家長數據");
        }
        const result = await res.json();
        setGetParentDatabyid(result); // 假設 API 返回單個對象
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
  const apply_status_Accept = useForm<z.infer<typeof Sup_Apply_Accept_Schema>>({
    resolver: zodResolver(Sup_Apply_Accept_Schema),
    defaultValues: {
      applyId: applydetailbyID,
      supadminId: supadminid,
    },
  });

  const apply_status_Reject = useForm<z.infer<typeof Sup_Apply_Reject_Schema>>({
    resolver: zodResolver(Sup_Apply_Reject_Schema),
    defaultValues: {
      applyId: applydetailbyID,
      supadminId: supadminid,
    },
  });

  // 提交處理
  const apply_status_Accept_onSubmit = (values: z.infer<typeof Sup_Apply_Accept_Schema>) => {
    console.log("-- apply_status_Accept_onSubmit-sup -- : ", values, "-- End --");
    startTransition(async () => {
      try {
        const result = await SupAcceptApplyClass(values);
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

  const apply_status_Reject_onSubmit = (values: z.infer<typeof Sup_Apply_Reject_Schema>) => {
    console.log("-- apply_status_Reject_onSubmit-sup -- : ", values, "-- End --");
    startTransition(async () => {
      try {
        const result = await SupRejectApplyClass(values);
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
  if (!GetApplyByIdData) {
    return <div className="p-4">載入中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  console.log("-- GetApplyByIdData -- : ", GetApplyByIdData, "-- End --");

  console.log("-- GetParentDatabyid -- : ", GetParentDatabyid, "-- End --");


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">申請詳情</h1>
      <p>標題: {GetApplyByIdData.title}</p>
      <p>主題: {GetApplyByIdData.subject}</p>
      <p>內容: {GetApplyByIdData.content}</p>
      <p>申請狀態: {GetApplyByIdData.apply ? "申請中" : "未申請"}</p>
      <p>處理狀態: {GetApplyByIdData.isapply ? "已處理" : "未處理"}</p>

      {GetParentDatabyid ? (
        <WhatsAppButton whatappmessage={GetParentDatabyid[0]?.phone} />
      ) : (
        <p>載入家長資料中...</p>
      )}

      {GetApplyByIdData.isapply ? (
        <p className="text-green-600 font-semibold">已處理</p>
      ) : (
        <div className="mt-4 space-y-4">
          <Form {...apply_status_Accept}>
            <form onSubmit={apply_status_Accept.handleSubmit(apply_status_Accept_onSubmit)}>
              <Button type="submit" variant="default">
                接受
              </Button>
            </form>
          </Form>

          <Form {...apply_status_Reject}>
            <form onSubmit={apply_status_Reject.handleSubmit(apply_status_Reject_onSubmit)}>
              <Button type="submit" variant="destructive">
                拒絕
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ApplyDetailbysupadmin;