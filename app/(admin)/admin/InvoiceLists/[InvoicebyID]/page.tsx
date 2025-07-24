"use client";

import { startTransition, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Form,
  // FormControl,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IsPay_Change_Schema } from "@/actions/Change-IsPay/schema";
import { IsPay_Change_Action } from "@/actions/Change-IsPay";



interface InvoiceData {
  id: string;
  title: string;
  studentname: string;
  servetype: string;
  price: number;
  content: string[];
  PaymentMethods: string[];
  createdAt: string;
  updatedAt: string;
  isPayment: boolean;
  student_id: string;
}

const InvoiceDetail = () => {
  const param = useParams();
  const invoiceId = param?.InvoicebyID as string;
  const [GetInvoiceByIdData, setGetInvoiceByIdData] = useState<InvoiceData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ success, setSuccess  ] = useState<string | undefined>("");


  // 初始化表單
  const form = useForm<z.infer<typeof IsPay_Change_Schema>>({
    resolver: zodResolver(IsPay_Change_Schema),
    defaultValues: {
      invoiceId: invoiceId,
      IsPay: true,
    },
  });

  useEffect(() => {
    const fetchInvoiceByIdData = async (id: string) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/InvoiceLists_detail_data_by_id/${id}`);
        if (!res.ok) {
          throw new Error("無法獲取發票數據");
        }
        const result = await res.json();
        setGetInvoiceByIdData(result);
      } catch (error: any) {
        console.error("獲取發票數據失敗:", error);
        setError("無法載入發票數據");
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoiceByIdData(invoiceId);
    }
  }, [invoiceId]);

  // 處理表單提交
  const onSubmit = (values: z.infer<typeof IsPay_Change_Schema>) => {
    // try {
    //   const response = await fetch(`/api/InvoiceLists_detail_data_by_id/${invoiceId}`, {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ isPayment: true }), // 更新 isPayment 為 true
    //   });

    //   if (!response.ok) {
    //     throw new Error("更新付款狀態失敗");
    //   }

    //   // 更新本地數據
    //   setGetInvoiceByIdData((prev) =>
    //     prev.map((invoice) =>
    //       invoice.id === invoiceId ? { ...invoice, isPayment: true } : invoice
    //     )
    //   );
    // } catch (error: any) {
    //   console.error("更新付款狀態失敗:", error);
    //   setError("無法更新付款狀態");
    // }
    console.log("-- change data -- : ",values," -- End -- ");
    setError("");
    setSuccess("");


        startTransition(() => {
          IsPay_Change_Action(values)

        })
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (GetInvoiceByIdData.length === 0) {
    return <div>未找到發票數據</div>;
  }

  return (
    <div className="p-4">
      {GetInvoiceByIdData.map((d) => (
        <div key={d.id} className="mb-4 border-b pb-4">
          <h2 className="text-lg font-bold">{d.title}</h2>
          <p><strong>學生姓名：</strong>{d.studentname}</p>
          <p><strong>服務類型：</strong>{d.servetype}</p>
          <p><strong>價格：</strong>{d.price}</p>
          <p><strong>內容：</strong>{d.content.join(", ")}</p>
          <p><strong>支付方式：</strong></p>
          <ul className="list-disc pl-6">
            {d.PaymentMethods.length > 0 ? (
              d.PaymentMethods.map((pay, payIndex) => (
                <li key={payIndex}>{pay}</li>
              ))
            ) : (
              <li>無支付方式</li>
            )}
          </ul>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4"
            >
              <Button type="submit" disabled={d.isPayment}>
                {d.isPayment ? "已付款" : "未付款" }
              </Button>
            </form>
          </Form>
        </div>
      ))}
    </div>
  );
};

export default InvoiceDetail;