// "use client";

// import Link from "next/link";
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
//       <Link  href={'/admin/ReceiptLists/createvoid'}>
//       建立補單
//       </Link>
//       {GetReceiptData.map((d)=>{
//         return (
//       <Link href={`/admin/ReceiptLists/${d.id}`}>
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
import { useEffect, useState } from "react";

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
  const [GetReceiptData, setGetReceiptData] = useState<ReceiptData[]>([]);
  const [GetVoidData, setGetVoidData] = useState<VoidData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>("");

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const res = await fetch("/api/Receipt_Lists");
        if (!res.ok) {
          throw new Error("無法載入收據資料");
        }
        const result = await res.json();
        setGetReceiptData(Array.isArray(result) ? result : []);
      } catch (err: any) {
        console.error("載入錯誤:", err);
        setError("無法載入收據資料");
      }
    };

    const fetchVoidData = async () => {
      try {
        const res = await fetch("/api/Void_Lists");
        if (!res.ok) {
          throw new Error("無法載入補單資料");
        }
        const result = await res.json();
        setGetVoidData(Array.isArray(result) ? result : []);
      } catch (err: any) {
        console.error("載入錯誤:", err);
        setError("無法載入補單資料");
      }
    };

    Promise.all([fetchReceiptData(), fetchVoidData()]).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#80A8BD] flex justify-center items-center pt-20">
        <p className="text-[#80A8BD] text-lg">正在加載...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#80A8BD] flex justify-center items-center pt-20">
        <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#80A8BD] flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[#80A8BD]">
            收據列表
          </h1>
          <Link
            href="/admin/ReceiptLists/createvoid"
            className="inline-block px-3 py-2 text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
          >
            建立補單
          </Link>
        </div>
        <div className="space-y-6">
          {GetReceiptData.length > 0 ? (
            GetReceiptData.map((d) => (
              <Link
                key={d.id}
                href={`/admin/ReceiptLists/${d.id}`}
                className="block bg-white border border-[#80A8BD]/20 p-4 rounded-md hover:bg-[#80A8BD]/10 transition-colors duration-300"
              >
                <p className="text-[#80A8BD] font-medium">{d.title || "無標題"}</p>
                <p className="text-gray-900">服務類型: {d.servetype || "無"}</p>
                <p className="text-gray-900">學生姓名: {d.studentname || "無"}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-900">無收據資料</p>
          )}
          <h2 className="text-xl font-bold tracking-tight text-[#80A8BD] mt-8">
            補單列表
          </h2>
          {GetVoidData.length > 0 ? (
            GetVoidData.map((d, index) => (
              <div
                key={index}
                className="bg-white border border-[#80A8BD]/20 p-4 rounded-md hover:bg-[#80A8BD]/10 transition-colors duration-300"
              >
                <p className="text-[#80A8BD] font-medium">{d.title || "無標題"}</p>
                <p className="text-gray-900">價錢: {d.price ?? "無"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-900">無補單資料</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptListsPage;