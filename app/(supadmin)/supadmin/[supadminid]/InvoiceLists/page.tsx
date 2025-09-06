"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface InvoiceData {
  id: string;
  title: string;
  content: string;
  price: number;
  servetype: string;
}

const InvoiceListsPage = () => {
  const params = useParams();
  const supadminid = params?.supadminid as string;
  const [GetInvoiceData, setGetInvoiceData] = useState<InvoiceData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/Invoice_Lists");
        if (!res.ok) {
          throw new Error("無法獲取發票列表數據");
        }
        const result = await res.json();
        setGetInvoiceData(result);
      } catch (error: any) {
        console.error("獲取發票數據失敗:", error);
        setError("無法載入發票列表");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoiceData();
  }, []);

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600">發票列表</h1>
          <Link
            href={`/supadmin/${supadminid}/InvoiceLists/createInvoice`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
          >
            創建發票
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {GetInvoiceData.length === 0 ? (
            <p className="text-gray-500 text-sm font-medium">
              正在載入數據或無發票記錄...
            </p>
          ) : (
            <div className="space-y-4">
              {GetInvoiceData.map((d) => (
                <div
                  key={d.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <Link
                    href={`/supadmin/${supadminid}/InvoiceLists/${d.id}`}
                    className="text-blue-600 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span>標題: {d.title}</span>
                      <span className="sm:ml-4 mt-2 sm:mt-0">服務類型: {d.servetype}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceListsPage;