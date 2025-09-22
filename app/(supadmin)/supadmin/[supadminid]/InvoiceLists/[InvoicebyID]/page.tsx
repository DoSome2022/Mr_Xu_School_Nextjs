// "use client";

// import { startTransition, useEffect, useState, useTransition } from "react";
// import { useParams } from "next/navigation";
// import { Form } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { IsPay_Change_Schema } from "@/actions/Change-IsPay/schema";
// import { IsPay_Change_Action } from "@/actions/Change-IsPay";


// interface InvoiceData {
//   id: string;
//   title: string;
//   studentname: string;
//   servetype: string;
//   price: number;
//   content: string[];
//   PaymentMethods: string[];
//   createdAt: string;
//   updatedAt: string;
//   isPayment: boolean;
//   student_id: string;
// }

// const InvoiceDetail = () => {
//   const params = useParams();
//   const invoiceId = params?.InvoicebyID as string;
//   const supadminid = params?.supadminid as string;
//   const [GetInvoiceByIdData, setGetInvoiceByIdData] = useState<InvoiceData | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition(); // 添加 useTransition 以定義 isPending

//   const form = useForm<z.infer<typeof IsPay_Change_Schema>>({
//     resolver: zodResolver(IsPay_Change_Schema),
//     defaultValues: {
//       invoiceId: invoiceId,
//       IsPay: true,
//     },
//   });

//   useEffect(() => {
//     const fetchInvoiceByIdData = async (id: string) => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/InvoiceLists_detail_data_by_id/${id}`);
//         if (!res.ok) {
//           throw new Error("無法獲取發票數據");
//         }
//         const result = await res.json();
//         setGetInvoiceByIdData(result);
//       } catch (error: any) {
//         console.error("獲取發票數據失敗:", error);
//         setError("無法載入發票數據");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (invoiceId) {
//       fetchInvoiceByIdData(invoiceId);
//     }
//   }, [invoiceId]);

//   const onSubmit = (values: z.infer<typeof IsPay_Change_Schema>) => {
//     setError("");
//     setSuccess("");

//     startTransition(() => {
//       IsPay_Change_Action(values).then((data) => {
//         if (data?.error) {
//           setError(data.error);
//         } else {
//           setSuccess(data?.success || "付款狀態更新成功");
//           setGetInvoiceByIdData((prev) =>
//             prev ? { ...prev, isPayment: true } : prev
//           );
//         }
//       });
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <p className="text-gray-500 text-sm font-medium">正在載入...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <p className="text-red-500 text-sm font-medium">{error}</p>
//       </div>
//     );
//   }

//   if (!GetInvoiceByIdData) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <p className="text-gray-500 text-sm font-medium">未找到發票數據</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-semibold text-blue-600 mb-6">發票詳情</h1>
//         <div className="bg-white shadow-lg rounded-lg p-6">
//           {error && (
//             <div className="text-red-500 bg-red-100 p-3 rounded-md text-sm font-medium mb-4">
//               {error}
//             </div>
//           )}
//           {success && (
//             <div className="text-green-500 bg-green-100 p-3 rounded-md text-sm font-medium mb-4">
//               {success}
//             </div>
//           )}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-gray-700 text-sm font-medium">
//                 <span className="font-semibold">標題:</span> {GetInvoiceByIdData.title}
//               </p>
//               <p className="text-gray-700 text-sm font-medium mt-2">
//                 <span className="font-semibold">學生姓名:</span> {GetInvoiceByIdData.studentname}
//               </p>
//               <p className="text-gray-700 text-sm font-medium mt-2">
//                 <span className="font-semibold">服務類型:</span> {GetInvoiceByIdData.servetype}
//               </p>
//               <p className="text-gray-700 text-sm font-medium mt-2">
//                 <span className="font-semibold">價格:</span> ${GetInvoiceByIdData.price}
//               </p>
//               <p className="text-gray-700 text-sm font-medium mt-2">
//                 <span className="font-semibold">內容:</span>{" "}
//                 {GetInvoiceByIdData.content.join(", ")}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-700 text-sm font-medium">
//                 <span className="font-semibold">支付方式:</span>
//               </p>
//               <ul className="list-disc pl-6 text-gray-600 text-sm font-medium mt-2">
//                 {GetInvoiceByIdData.PaymentMethods.length > 0 ? (
//                   GetInvoiceByIdData.PaymentMethods.map((pay, payIndex) => (
//                     <li key={payIndex}>{pay}</li>
//                   ))
//                 ) : (
//                   <li>無支付方式</li>
//                 )}
//               </ul>
//               <p className="text-gray-700 text-sm font-medium mt-2">
//                 <span className="font-semibold">創建時間:</span> {GetInvoiceByIdData.createdAt}
//               </p>
//               <p className="text-gray-700 text-sm font-medium mt-2">
//                 <span className="font-semibold">更新時間:</span> {GetInvoiceByIdData.updatedAt}
//               </p>
//               <p className="text-gray-700 text-sm font-medium mt-2">
//                 <span className="font-semibold">付款狀態:</span>{" "}
//                 {GetInvoiceByIdData.isPayment ? "已付款" : "未付款"}
//               </p>
//             </div>
//           </div>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
//               <Button
//                 type="submit"
//                 disabled={GetInvoiceByIdData.isPayment || isPending}
//                 className="w-full bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
//               >
//                 {GetInvoiceByIdData.isPayment ? "已付款" : isPending ? "正在更新..." : "標記為已付款"}
//               </Button>
//             </form>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceDetail;




"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { Form } from "@/components/ui/form";
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
  const params = useParams();
  const invoiceId = params?.InvoicebyID as string;
  const supadminid = params?.supadminid as string;
  const [GetInvoiceByIdData, setGetInvoiceByIdData] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

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

  const onSubmit = (values: z.infer<typeof IsPay_Change_Schema>) => {
    setError(null);
    setSuccess("");

    startTransition(() => {
      IsPay_Change_Action(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          // 確保 success 為字符串
          const successMessage = typeof data?.success === "string" 
            ? data.success 
            : "付款狀態更新成功"; // 預設值，應從未觸發
          setSuccess(successMessage);
          setGetInvoiceByIdData((prev) =>
            prev ? { ...prev, isPayment: true } : prev
          );
        }
      });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-medium">正在載入...</p>
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

  if (!GetInvoiceByIdData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-medium">未找到發票數據</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">發票詳情</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {error && (
            <div className="text-red-500 bg-red-100 p-3 rounded-md text-sm font-medium mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 bg-green-100 p-3 rounded-md text-sm font-medium mb-4">
              {success}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 text-sm font-medium">
                <span className="font-semibold">標題:</span> {GetInvoiceByIdData.title}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">學生姓名:</span> {GetInvoiceByIdData.studentname}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">服務類型:</span> {GetInvoiceByIdData.servetype}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">價格:</span> ${GetInvoiceByIdData.price}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">內容:</span>{" "}
                {GetInvoiceByIdData.content.join(", ")}
              </p>
            </div>
            <div>
              <p className="text-gray-700 text-sm font-medium">
                <span className="font-semibold">支付方式:</span>
              </p>
              <ul className="list-disc pl-6 text-gray-600 text-sm font-medium mt-2">
                {GetInvoiceByIdData.PaymentMethods.length > 0 ? (
                  GetInvoiceByIdData.PaymentMethods.map((pay, payIndex) => (
                    <li key={payIndex}>{pay}</li>
                  ))
                ) : (
                  <li>無支付方式</li>
                )}
              </ul>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">創建時間:</span> {GetInvoiceByIdData.createdAt}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">更新時間:</span> {GetInvoiceByIdData.updatedAt}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                <span className="font-semibold">付款狀態:</span>{" "}
                {GetInvoiceByIdData.isPayment ? "已付款" : "未付款"}
              </p>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
              <Button
                type="submit"
                disabled={GetInvoiceByIdData.isPayment || isPending}
                className="w-full bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
              >
                {GetInvoiceByIdData.isPayment ? "已付款" : isPending ? "正在更新..." : "標記為已付款"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;