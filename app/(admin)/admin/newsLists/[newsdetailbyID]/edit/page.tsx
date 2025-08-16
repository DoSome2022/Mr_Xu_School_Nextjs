"use client";

import New_Update_Form from "@/components/UpdateForm/New-Update_Form";
import Link from "next/link";
import { useParams } from "next/navigation";

const NewDetailEdit = () => {
  const params = useParams();
  const newsId = params?.newsdetailbyID as string;

  return (
    <div className="min-h-screen bg-gray-100 pt-20"> {/* 留出空間給固定導航欄 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">編輯公告</h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/newsLists/${newsId}`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回公告詳情
            </Link>
            <Link
              href="/admin/newsLists"
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回公告列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <New_Update_Form />
        </div>
      </div>
    </div>
  );
};

export default NewDetailEdit;