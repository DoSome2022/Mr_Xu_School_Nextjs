"use client";

import Invoice_Create_Form from "@/components/CreateForm/Invoice-Create-Form";
import Link from "next/link";

const Invoice_Create_Page = () => {
  return (
    <div className="min-h-screen bg-[#80A8BD] flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[#80A8BD]">
            創建發票
          </h1>
          <Link
            href="/admin/InvoiceLists"
            className="inline-block px-3 py-2 text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
          >
            返回單據列表
          </Link>
        </div>
        <Invoice_Create_Form />
      </div>
    </div>
  );
};

export default Invoice_Create_Page;

// "use client";

// import TimeTemplate_Create_Form from "@/components/CreateForm/TimeTemplate-Create-Form";

// const createtimetemplatePage = () => {
//     return (
//         <div className="pt-16 min-h-screen bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                     <div className="p-6">
//                         <h1 className="text-2xl font-bold text-[#80A8BD] mb-6">創建時間模板</h1>
//                         <TimeTemplate_Create_Form />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default createtimetemplatePage;