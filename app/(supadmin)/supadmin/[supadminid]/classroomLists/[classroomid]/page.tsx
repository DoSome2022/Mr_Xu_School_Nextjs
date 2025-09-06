"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ClassRoomData {
  id: string;
  room: string;
}

const ClassRoomByIdBySupadmin = () => {
  const params = useParams();
  const classroomid = params?.classroomid as string;
  const supadminid = params?.supadminid as string;
  const [classroombyidData, setClassroombyidData] = useState<ClassRoomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    console.log("supadminid:",supadminid);

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
      } catch (error: any) {
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


console.log("classroombyidData:", classroombyidData);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-medium">正在載入...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
 
 
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">教室詳情</h1>
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
    

  );
};

export default ClassRoomByIdBySupadmin;