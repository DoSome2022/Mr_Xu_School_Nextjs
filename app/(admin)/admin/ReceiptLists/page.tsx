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
  PaymentMethods: [];
  content: [];
}

interface VoidData {
  title: string;
  price: number;
}

const ReceiptListsPage = () => {
  const [GetReceiptData, setGetReceiptData] = useState<ReceiptData[]>([]);
  const [GetVoidData, setGetVoidData] = useState<VoidData[]>([]);

  useEffect(() => {
    const fetchReceiptData = async () => {
      const res = await fetch("/api/Receipt_Lists");
      if (!res.ok) {
        throw new Error("斷線！");
      }
      const result = await res.json();
      setGetReceiptData(result);
    };

    const fetchVoidData = async () => {
      const res = await fetch("/api/Void_Lists");
      if (!res.ok) {
        throw new Error("斷線！");
      }
      const result = await res.json();
      setGetVoidData(result);
    };

    fetchReceiptData();
    fetchVoidData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-semibold text-[#e7915b] mb-6">
          收據列表
        </h1>
        <Link
          href="/admin/ReceiptLists/createvoid"
          className="inline-block bg-[#e7915b] text-white px-4 py-2 rounded-md font-medium hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300 mb-6"
        >
          建立補單
        </Link>
        <div className="space-y-6">
          {GetReceiptData.length > 0 ? (
            GetReceiptData.map((d) => (
              <Link
                key={d.id}
                href={`/admin/ReceiptLists/${d.id}`}
                className="block bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors duration-300"
              >
                <p className="text-[#e7915b] font-medium">{d.title}</p>
                <p className="text-gray-700">服務類型: {d.servetype}</p>
                <p className="text-gray-700">學生姓名: {d.studentname}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">無收據資料</p>
          )}
          <h2 className="text-xl font-semibold text-[#e7915b] mt-8">
            補單列表
          </h2>
          {GetVoidData.length > 0 ? (
            GetVoidData.map((d, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors duration-300"
              >
                <p className="text-[#e7915b] font-medium">{d.title}</p>
                <p className="text-gray-700">價錢: {d.price}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">無補單資料</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptListsPage;