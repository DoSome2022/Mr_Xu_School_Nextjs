"use client";

import CreateClassRoomForm from "@/components/CreateForm/ClassRoom-Create-Form";
import Link from "next/link";

const CreateClassRoomPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-20"> {/* 留出空間給固定導航欄 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">創建課室</h1>
          <Link
            href="/admin/classroomLists"
            className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            返回課室列表
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <CreateClassRoomForm />
        </div>
      </div>
    </div>
  );
};

export default CreateClassRoomPage;