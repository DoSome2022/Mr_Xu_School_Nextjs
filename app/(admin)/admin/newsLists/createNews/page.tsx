"use client";

import New_Create_Form from "@/components/CreateForm/New-Create-Form";
import Link from "next/link";

const CreateNews = () => {
  return (
    <div className="min-h-screen bg-[#e7915b] flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-7xl">
        <div className="mb-6">
          <Link
            href="/admin/newsLists"
            className="inline-block px-3 py-2 text-white hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
          >
            返回
          </Link>
        </div>
        <New_Create_Form />
      </div>
    </div>
  );
};

export default CreateNews;