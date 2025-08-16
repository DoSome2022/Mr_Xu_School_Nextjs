"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ClassroomList {
  id: string;
  room: string;
}

const ClassRoomLists = () => {
  const [GetClassRoom, setGetClassRoom] = useState<ClassroomList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClassRoom = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/ClassRoom_Lists");
        if (!res.ok) {
          throw new Error("無法連線！");
        }
        const result = await res.json();
        setGetClassRoom(result);
      } catch (error) {
        console.error("獲取課室數據失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassRoom();
  }, []);

  console.log("GetClassRoom:", GetClassRoom, "-- End --");

  return (
    <div className="min-h-screen bg-gray-100 pt-20"> {/* 留出空間給固定導航欄 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">課室列表</h1>
          <Link
            href="/admin/classroomLists/createclassroom"
            className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            創建課室
          </Link>
        </div>
        <div className="grid gap-6">
          {isLoading ? (
            <p className="text-gray-600">正在加載...</p>
          ) : GetClassRoom.length === 0 ? (
            <p className="text-gray-600">暫無課室數據</p>
          ) : (
            GetClassRoom.map((d) => (
              <div
                key={d.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Link
                  href={`/admin/classroomLists/${d.id}`}
                  className="text-xl text-[#e7915b] font-semibold hover:text-cyan-200 transition-colors duration-300"
                >
                  {d.room}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassRoomLists;