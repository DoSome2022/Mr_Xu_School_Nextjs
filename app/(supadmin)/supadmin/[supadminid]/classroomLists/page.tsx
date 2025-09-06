"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ClassroomList {
  id: string;
  room: string;
}

const ClassRoomListsbysupadmin = () => {
  const params = useParams();
  const supadminid = params?.supadminid as string;
  const [GetClassRoom, setGetClassRoom] = useState<ClassroomList[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassRoom = async () => {
      try {
        const res = await fetch("/api/ClassRoom_Lists");
        if (!res.ok) {
          throw new Error("無法獲取教室列表數據");
        }
        const result = await res.json();
        setGetClassRoom(result);
      } catch (error: any) {
        console.error("獲取教室數據失敗:", error);
        setError("無法載入教室列表");
      }
    };
    fetchClassRoom();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600">教室列表</h1>
          <Link
            href={`/supadmin/${supadminid}/classroomLists/createclassroom`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
          >
            創建教室
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {GetClassRoom.length === 0 ? (
            <p className="text-gray-500 text-sm font-medium">
              正在載入數據或無教室記錄...
            </p>
          ) : (
            <div className="space-y-4">
              {GetClassRoom.map((d) => (
                <div
                  key={d.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <Link
                    href={`/supadmin/${supadminid}/classroomLists/${d.id}`}
                    className="text-blue-600 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                  >
                    教室: {d.room}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassRoomListsbysupadmin;