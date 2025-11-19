"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

const ReceiptByIdPage = () => {
  const params = useParams();
  const router = useRouter();
  const ReceiptID = params?.ReceiptbyID as string;
  const [GetReceiptByIdData, setGetReceiptByIdData] = useState<ReceiptByIdPageData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReceiptData = async (id: string) => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ReceiptLists_detail_data_by_id/${id}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) {
          throw new Error("無法獲取收據數據");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("無效的收據數據格式");
        }
        setGetReceiptByIdData(data);
      } catch (error: any) {
        console.error("獲取收據數據失敗:", error);
        setError(error.message || "無法載入收據數據");
      } finally {
        setLoading(false);
      }
    };

    if (ReceiptID) {
      fetchReceiptData(ReceiptID);
    }
  }, [ReceiptID]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <span className="text-[#80A8BD] animate-pulse">載入收據數據中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-red-500 font-medium">錯誤: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  if (GetReceiptByIdData.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">未找到收據數據</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#80A8BD] mb-6">收據詳情</h1>

            {GetReceiptByIdData.map((d) => (
              <div key={d.id} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 基本信息 */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{d.title}</h2>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700"><span className="font-medium">學生姓名：</span>{d.studentname}</p>
                      <p className="text-gray-700"><span className="font-medium">服務類型：</span>{d.servetype}</p>
                      <p className="text-gray-700"><span className="font-medium">價格：</span>${d.price}</p>
                      <p className="text-gray-700"><span className="font-medium">總計：</span>${d.total}</p>
                      <p className="text-gray-700"><span className="font-medium">發票編號：</span>{d.Invoice_id}</p>
                    </div>
                  </div>
                </div>

                {/* 內容詳情 */}
                <div className="bg-gray-50 p-4 rounded-lg border border-[#80A8BD]">
                  <h3 className="text-lg font-semibold text-[#80A8BD] mb-3">內容詳情</h3>
                  <div className="space-y-2">
                    {d.content.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {d.content.map((item, index) => (
                          <li key={index} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">無內容</p>
                    )}
                  </div>
                </div>

                {/* 支付方式 */}
                <div className="bg-gray-50 p-4 rounded-lg border border-[#80A8BD]">
                  <h3 className="text-lg font-semibold text-[#80A8BD] mb-3">支付方式</h3>
                  <div className="space-y-2">
                    {d.PaymentMethods.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {d.PaymentMethods.map((pay, payIndex) => (
                          <li key={payIndex} className="text-gray-700">{pay}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">無支付方式</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptByIdPage;

// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface ReceiptByIdPageData {
//   id: string;
//   title: string;
//   price: number;
//   Invoice_id: string;
//   total: number;
//   servetype: string;
//   studentname: string;
//   PaymentMethods: string[];
//   content: string[];
// }

// const ReceiptByIdPage = () => {
//   const params = useParams();
//   const ReceiptID = params?.ReceiptbyID as string;
//   const [GetReceiptByIdData, setGetReceiptByIdData] = useState<
//     ReceiptByIdPageData[]
//   >([]);

//   useEffect(() => {
//     const fetchReceiptData = async (id: string) => {
//       try {
//         const response = await fetch(`/api/ReceiptLists_detail_data_by_id/${id}`, {
//                 cache: 'no-store',  // 強制不快取，確保每次請求新數據
//                 headers: {
//                     'Cache-Control': 'no-cache',
//                 },
//             });
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setGetReceiptByIdData(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setGetReceiptByIdData([]);
//       }
//     };
//     fetchReceiptData(ReceiptID);
//   }, [ReceiptID]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-釋放6 pt-16">
//       <div className="bg-white shadow-lg rounded-md p-6">
//         <h1 className="text-2xl font-semibold text-[#80A8BD] mb-6">
//           收據詳情
//         </h1>
//         {GetReceiptByIdData.length > 0 ? (
//           GetReceiptByIdData.map((d) => (
//             <div
//               key={d.id}
//               className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors duration-300 space-y-2"
//             >
//               <p className="text-[#80A8BD] font-medium">標題: {d.title}</p>
//               <p className="text-gray-700">服務類型: {d.servetype}</p>
//               <p className="text-gray-700">收據編號: {d.Invoice_id}</p>
//               <p className="text-gray-700">學生姓名: {d.studentname}</p>
//               <p className="text-gray-700">價錢: {d.price}</p>
//               <p className="text-gray-700">
//                 付款方法:{" "}
//                 {d.PaymentMethods.length > 0
//                   ? d.PaymentMethods.join(", ")
//                   : "無"}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">無收據資料</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReceiptByIdPage;