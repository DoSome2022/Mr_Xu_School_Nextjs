"use client";

import Booklist_uploadForm from "@/components/uploadForm/school/Booklist_uploadForm";
import Link from "next/link";
import { useParams } from "next/navigation";

const BookLists_upload = () => {
  const params = useParams();
  const schoolId = params?.schooldetailbyID as string;

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">上傳書單</h1>
          <Link
            href={`/admin/schoolLists/${schoolId}/bookLists`}
            className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            返回年份列表
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Booklist_uploadForm SchoolId={schoolId} />
        </div>
      </div>
    </div>
  );
};

export default BookLists_upload;