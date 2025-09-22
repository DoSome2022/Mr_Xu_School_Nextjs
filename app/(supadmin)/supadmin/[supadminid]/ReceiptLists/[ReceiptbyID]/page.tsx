
"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";

interface ReceiptByIdPageData {
  id: string;
  title: string;
  price: number;
  Invoice_id: string;
  total: number;
  servetype: string;
  studentname: string;
  PaymentMethods: string[];
  content: string[];
}

const ReceiptByIdPagebysupadmin = () => {
  const params = useParams<{ supadminid: string; ReceiptbyID: string }>();
  const supadminid = params?.supadminid;
  const ReceiptID = params?.ReceiptbyID;

  // 驗證路由參數
  if (!supadminid || !ReceiptID) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = <T,>(url: string, init?: RequestInit): Promise<T> =>
    fetch(url, init).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:8000";

  // 獲取收據詳情
  const { data: receiptData, error, isLoading } = useSWR<ReceiptByIdPageData>(
    `${apiUrl}/api/ReceiptLists_detail_data_by_id/${ReceiptID}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入收據資料 - {error.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (isLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 驗證收據資料
  if (
    !receiptData ||
    !receiptData.id ||
    !receiptData.title ||
    !receiptData.servetype ||
    !receiptData.studentname ||
    !Array.isArray(receiptData.PaymentMethods)
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的收據資料格式
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminid}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/ReceiptLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          收據列表
        </Link>
        <span className="mx-2">/</span>
        <span>{receiptData.title}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">收據詳情</h2>

      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="text-blue-600 font-medium">標題: {receiptData.title}</div>
        <div className="text-blue-600 font-medium">服務類型: {receiptData.servetype}</div>
        <div className="text-blue-600 font-medium">收據編號: {receiptData.Invoice_id}</div>
        <div className="text-blue-600 font-medium">學生姓名: {receiptData.studentname}</div>
        <div className="text-blue-600 font-medium">價錢: {receiptData.price}</div>
        <div className="text-blue-600 font-medium">
          付款方式: {receiptData.PaymentMethods.join(", ") || "無"}
        </div>
        <div className="text-blue-600 font-medium">
          內容: {receiptData.content.join(", ") || "無"}
        </div>
      </div>
    </div>
  );
};

export default ReceiptByIdPagebysupadmin;