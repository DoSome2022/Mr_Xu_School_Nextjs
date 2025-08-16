// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface InvoiceData {
//   id:string;
//   title:string;
//   content: string;
//   price: number;
//   servetype: string;
// }

// const InvoiceListsPage = () => {

//   const [GetInvoiceData , setGetInvoiceData] = useState<InvoiceData[]>([]);

//   useEffect(()=>{
//     const GetInvoiceData = async () => {
//       const res = await fetch('/api/Invoice_Lists');
//       if(!res){
//         throw new Error("斷線！")
//       }
//       const result = await res.json()
//       setGetInvoiceData(result)
//     }
//     GetInvoiceData()
//   },[])

//   console.log("GetInvoiceData : ",GetInvoiceData,"-- End --")

//   return (
//     <>
//     <div>
//     <Link href={"/admin/InvoiceLists/createInvoice"}>
//       Create Invoice
//     </Link>
//     </div>    
    
//     <div>
//       <h1>InvoiceListsPage</h1>
//         <br />
//           {GetInvoiceData.map((d)=>{
//             return (
//               <div key={d.id}>
//                 <Link href={`/admin/InvoiceLists/${d.id}`}>
//                   Title: {d.title}
//                   <br />
//                   服務類型: {d.servetype}
//                 </Link>
//               </div>
//             )
//           })}
//         <br />
//     </div>
//     </>
//   );
// };

// export default InvoiceListsPage;

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface InvoiceData {
  id: string;
  title: string;
  content: string;
  price: number;
  servetype: string;
}

const InvoiceListsPage = () => {
  const [GetInvoiceData, setGetInvoiceData] = useState<InvoiceData[]>([]);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const res = await fetch("/api/Invoice_Lists");
        if (!res.ok) {
          throw new Error("斷線！");
        }
        const result = await res.json();
        setGetInvoiceData(result);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        setGetInvoiceData([]);
      }
    };
    fetchInvoiceData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-semibold text-[#e7915b] mb-6">
          單據列表
        </h1>
        <Link
          href="/admin/InvoiceLists/createInvoice"
          className="inline-block bg-[#e7915b] text-white px-4 py-2 rounded-md font-medium hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300 mb-6"
        >
          建立單據
        </Link>
        <div className="space-y-4">
          {GetInvoiceData.length > 0 ? (
            GetInvoiceData.map((d) => (
              <Link
                key={d.id}
                href={`/admin/InvoiceLists/${d.id}`}
                className="block bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors duration-300"
              >
                <p className="text-[#e7915b] font-medium">標題: {d.title}</p>
                <p className="text-gray-700">服務類型: {d.servetype}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">無單據資料</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceListsPage;