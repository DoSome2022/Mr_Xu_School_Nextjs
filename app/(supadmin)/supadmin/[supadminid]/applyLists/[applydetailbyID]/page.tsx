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
import { Sup_Apply_Accept_Schema } from "@/actions/supadmin/Apply-Accept/schema";
import { Sup_Apply_Reject_Schema } from "@/actions/supadmin/Apply-Reject/schema";
import { SupAcceptApplyClass } from "@/actions/supadmin/Apply-Accept";
import { SupRejectApplyClass } from "@/actions/supadmin/Apply-Reject";
import WhatsAppButton from "@/components/whatappsButton/whatappsbtn";

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

interface ParentData {
  id: string;
  phone: string;
}

const ApplyDetailbysupadmin = () => {
  const params = useParams();
  const applydetailbyID = params.applydetailbyID as string;
  const supadminid = params.supadminid as string;

  const [GetApplyByIdData, setGetApplyByIdData] = useState<ApplyData | null>(null);
  const [GetParentDatabyid, setGetParentDatabyid] = useState<ParentData | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const apply_status_Accept_onSubmit = (values: z.infer<typeof Sup_Apply_Accept_Schema>) => {
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

  if (!GetApplyByIdData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-medium">載入中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">申請詳情</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 text-sm font-medium">
                <span className="font-semibold">標題:</span> {GetApplyByIdData.title}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">主題:</span> {GetApplyByIdData.subject}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">內容:</span> {GetApplyByIdData.content}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">申請狀態:</span>{" "}
                {GetApplyByIdData.apply ? "申請中" : "未申請"}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">處理狀態:</span>{" "}
                {GetApplyByIdData.isapply ? "已處理" : "未處理"}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">課程名稱:</span> {GetApplyByIdData.course_name}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">申請學生:</span> {GetApplyByIdData.student.name}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">學校:</span> {GetApplyByIdData.student.school}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">年級:</span> {GetApplyByIdData.student.grade}
              </p>
            </div>
            <div>
              <p className="text-gray-700 text-sm font-medium">
                <span className="font-semibold">申請時間:</span> {GetApplyByIdData.craetedAt}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">更新時間:</span> {GetApplyByIdData.updatedAt}
              </p>
              {GetParentDatabyid ? (
                <div className="mt-4">
                  <p className="text-gray-700 text-sm font-medium">
                    <span className="font-semibold">家長電話:</span> {GetParentDatabyid.phone}
                  </p>
                  <div className="mt-2">
                    <WhatsAppButton whatappmessage={GetParentDatabyid.phone} />
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm font-medium mt-2">載入家長資料中...</p>
              )}
            </div>
          </div>

          {GetApplyByIdData.isapply ? (
            <p className="text-green-600 font-semibold mt-6">申請已處理</p>
          ) : (
            <div className="mt-6 flex space-x-4">
              <Form {...apply_status_Accept}>
                <form
                  onSubmit={apply_status_Accept.handleSubmit(apply_status_Accept_onSubmit)}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    接受申請
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
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-500 text-white"
                  >
                    拒絕申請
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyDetailbysupadmin;