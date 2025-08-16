"use client";

import Ex_timetable_uploadForm from "@/components/uploadForm/school/Ex_timetable_uploadForm";
import { useParams } from "next/navigation";

const ExTimeLists_upload = () => {
  const params = useParams();
  const SchoolId = params.schooldetailbyID as string;

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">上傳考試時間表</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Ex_timetable_uploadForm SchoolId={SchoolId} />
        </div>
      </div>
    </div>
  );
};

export default ExTimeLists_upload;