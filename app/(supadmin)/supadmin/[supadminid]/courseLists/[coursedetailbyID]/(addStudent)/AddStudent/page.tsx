"use client";

import Add_Student_Formbysupadmin from "@/components/CreateForm/SUPADMIN/Sup-AddStudent-Form";
import Link from "next/link";
import { useParams } from "next/navigation";

const AddStudentPagebysupadmin = () => {
  const params = useParams();
  const courseId = params?.coursedetailbyID as string;
  const supadminId = params?.supadminid as string; 

  return (
    <div className="min-h-screen bg-gray-100 pt-20"> {/* 留出空間給固定導航欄 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">添加學生到課程</h1>
          <Link
            href={`/supadmin/${supadminId}/courseLists/${courseId}`}
            className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            返回課程詳情
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Add_Student_Formbysupadmin />
        </div>
      </div>
    </div>
  );
};

export default AddStudentPagebysupadmin;