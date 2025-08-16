"use client";

import Ex_pager_uploadForm from "@/components/uploadForm/school/Ex_pager_uploadForm";
import { useParams } from "next/navigation";

const ExpageLists_upload = () => {
  const params = useParams();
  const SchoolId = params.schooldetailbyID as string;

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">上傳試卷</h1>
        <Ex_pager_uploadForm SchoolId={SchoolId} />
      </div>
    </div>
  );
};

export default ExpageLists_upload;