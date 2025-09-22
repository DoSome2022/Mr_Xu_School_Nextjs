// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface ReceiptData {
//   id: string;
//   title: string;
//   price: number;
//   Invoice_id: string;
//   total: number;
//   servetype: string;
//   studentname: string;
//   PaymentMethods:[];
//   content:[];
// }

// interface VoidData {
//   title: string;
//   price: number;
// }

// const ReceiptListsPage = () => {

//     const param = useParams();
//     console.log("param :",  param ,"--end --"  )
//     const supadminid = param?.supadminid as string;
//     console.log("supadminid :", supadminid);

//   const [ GetReceiptData, setGetReceiptData] = useState<ReceiptData[]>([]);
//   const [ GetVoidData , setGetVoidData ] = useState<VoidData[]>([]);


//   useEffect(()=>{
//     const fetchReceiptData = async () =>{
//       const res = await fetch('/api/Receipt_Lists');
//       if(!res){
//         throw new Error("斷線！")
//       }
      
//       const result = await res.json()

//       setGetReceiptData(result)

//     }
//     fetchReceiptData()

//     const fetchVoidData = async () =>{
//       const res = await fetch('/api/Void_Lists');
//       if(!res){
//         throw new Error("斷線！")
//       }
      
//       const result = await res.json()

//       setGetVoidData(result)

//     }
//     fetchVoidData()


//   },[])
//   console.log("GetReceiptData : ",GetReceiptData)
//   console.log("GetVoidData : ",GetVoidData)
//   return (
//     <div>
//       <h1>ReceiptListsPage</h1>
//       <Link  href={`/supadmin/${supadminid}/ReceiptLists/createvoid`}>
//       建立補單
//       </Link>
//       {GetReceiptData.map((d)=>{
//         return (
//       <Link href={`/supadmin/${supadminid}/ReceiptLists/${d.id}`}>
//         <br />
//         標題:{d.title}
//         <br />
//         服務類型:{d.servetype}
//         <br />
//         學生姓名:{d.studentname}
//       </Link>
//         )
//       })}

//       {GetVoidData.map((d)=>{
//         return(
//           <>
//           <br />
//           標題:{d.title}
//           <br />
//           價錢:{d.price}
//           <br />
//           </>
//         )
//       })}




//     </div>
//   );
// };

// export default ReceiptListsPage;


"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";

interface ReceiptData {
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

interface VoidData {
  title: string;
  price: number;
}

const ReceiptListsPage = () => {
  const params = useParams<{ supadminid: string }>();
  const supadminid = params?.supadminid;

  // 驗證路由參數
  if (!supadminid) {
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

  // 獲取收據資料
  const { data: receiptData, error: receiptError, isLoading: receiptLoading } = useSWR<ReceiptData[]>(
    `${apiUrl}/api/Receipt_Lists`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 獲取補單資料
  const { data: voidData, error: voidError, isLoading: voidLoading } = useSWR<VoidData[]>(
    `${apiUrl}/api/Void_Lists`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (receiptError || voidError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入資料 - {(receiptError || voidError)?.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (receiptLoading || voidLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 驗證收據資料
  if (
    !receiptData ||
    !Array.isArray(receiptData) ||
    !receiptData.every((item) => item.id && item.title && item.servetype && item.studentname)
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的收據資料格式
      </div>
    );
  }

  // 驗證補單資料
  if (
    !voidData ||
    !Array.isArray(voidData) ||
    !voidData.every((item) => item.title && typeof item.price === "number")
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的補單資料格式
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
        <span>收據列表</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">收據與補單列表</h2>

      <Link
        href={`/supadmin/${supadminid}/ReceiptLists/createvoid`}
        className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        建立補單
      </Link>

      <div className="flex flex-col space-y-6">
        <div>
          <h3 className="text-xl font-medium text-blue-600 mb-2">收據</h3>
          {receiptData.length === 0 && <div className="text-gray-600">無收據資料</div>}
          <div className="flex flex-col space-y-4">
            {receiptData.map((d) => (
              <Link
                key={d.id}
                href={`/supadmin/${supadminid}/ReceiptLists/${d.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <div>標題: {d.title}</div>
                  <div>服務類型: {d.servetype}</div>
                  <div>學生姓名: {d.studentname}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium text-blue-600 mb-2">補單</h3>
          {voidData.length === 0 && <div className="text-gray-600">無補單資料</div>}
          <div className="flex flex-col space-y-4">
            {voidData.map((d) => (
              <div key={d.title} className="p-4 bg-white rounded-lg shadow-md">
                <div>標題: {d.title}</div>
                <div>價錢: {d.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptListsPage;