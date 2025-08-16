"use client";

import School_Update_Form from "@/components/UpdateForm/School-Update-Form";
import Link from "next/link";
import { useParams } from "next/navigation";

const SchoolDetailEdit = () => {
  const params = useParams();
  const schoolId = params?.schooldetailbyID as string;

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">編輯學校</h1>
          <Link
            href={`/admin/schoolLists/${schoolId}`}
            className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            返回學校詳情
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <School_Update_Form />
        </div>
      </div>
    </div>
  );
};

export default SchoolDetailEdit;