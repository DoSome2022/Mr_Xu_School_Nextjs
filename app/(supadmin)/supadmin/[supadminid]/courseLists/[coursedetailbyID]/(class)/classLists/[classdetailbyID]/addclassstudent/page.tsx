"use client";


import AddClass_Create_Formbysupadmin from "@/components/CreateForm/SUPADMIN/Sup-AddClass-Create-Form";
import Link from "next/link";
import { useParams } from "next/navigation";

const AddClassStudentbysupadmin = () => {
  const params = useParams();
  const courseId = params?.coursedetailbyID as string;
  const classId = params?.classdetailbyID as string;
  const supadminId = params?.supadminid as string;

  return (
    <div className="min-h-screen bg-gray-100 pt-20"> {/* 留出空間給固定導航欄 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">加入加堂學生</h1>
          <div className="flex space-x-4">
            <Link
              href={`/supadmin/${supadminId}/courseLists/${courseId}/classLists/${classId}`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回課堂詳情
            </Link>
            <Link
              href={`/supadmin/${supadminId}/courseLists/${courseId}/classLists`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回課堂列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <AddClass_Create_Formbysupadmin />
        </div>
      </div>
    </div>
  );
};

export default AddClassStudentbysupadmin;