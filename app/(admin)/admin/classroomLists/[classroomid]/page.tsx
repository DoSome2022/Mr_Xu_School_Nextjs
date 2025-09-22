"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ClassRoomData {
  id: string;
  room: string;
}

const ClassRoomById = () => {
  const params = useParams();
  const classroomid = params?.classroomid as string;
  const [classroombyidData, setClassroombyidData] = useState<ClassRoomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassRoom = async (id: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/ClassRoomLists_detail_data_by_id/${id}`);
        if (!res.ok) {
          throw new Error("無法獲取教室數據");
        }
        const result = await res.json();
        setClassroombyidData(result);
      } catch {
        console.error("獲取教室數據失敗:", error);
        setError("無法載入教室數據");
      } finally {
        setIsLoading(false);
      }
    };

    if (classroomid) {
      fetchClassRoom(classroomid);
    }
  }, [classroomid]);

  console.log("classroombyidData:", classroombyidData, "-- End --");

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 導航欄 */}
      <nav className="bg-[#80A8BD] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">教室管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/classroomLists"
                className="text-white hover:bg-cyan-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                返回教室列表
              </Link>
              <Link
                href="/admin"
                className="text-white hover:bg-cyan-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                管理面板
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主內容 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#80A8BD] mb-6">教室詳情</h1>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          {classroombyidData.length > 0 ? (
            <div className="grid gap-4">
              {classroombyidData.map((item) => (
                <div key={item.id}>
                  <h2 className="text-xl font-semibold text-gray-700">教室名稱</h2>
                  <p className="text-gray-600">{item.room}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">無教室數據</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassRoomById;