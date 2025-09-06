"use client";

import VoidCreateForm from "@/components/CreateForm/Void-Create-Form";
import Link from "next/link";

const CreateVoidPage = () => {
  return (
    <div className="min-h-screen bg-[#e7915b] flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[#e7915b]">
            建立補單
          </h1>
          <Link
            href="/admin/ReceiptLists"
            className="inline-block px-3 py-2 text-[#e7915b] hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
          >
            返回收據列表
          </Link>
        </div>
        <VoidCreateForm />
      </div>
    </div>
  );
};

export default CreateVoidPage;