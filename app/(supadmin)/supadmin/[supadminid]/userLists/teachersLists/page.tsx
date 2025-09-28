"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";


interface Teacher {
  id: string;
  username: string;
  role: string;
}

const TeacherListsbysupadmin = () => {
  const params = useParams();
  const supadminId = params?.supadminid as string;
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTeacherData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/Course_data_teacher", {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("無法獲取老師數據");
        }
        const result: Teacher[] = await res.json();
        setTeacherData(result.filter((item) => item.role === "TEACHER"));
      } catch (error: any) {
        console.error("獲取老師數據失敗:", error);
        setError("無法載入老師列表");
      } finally {
        setLoading(false);
      }
    };
    getTeacherData();
  }, []);

  if (loading) {
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600">老師列表</h1>
          <Link
            href={`/supadmin/${supadminId}/userLists/teachersLists/createTeacher`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
          >
            建立老師
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {teacherData.length > 0 ? (
            <div className="space-y-4">
              {teacherData.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <Link
                    href={`/supadmin/${supadminId}/userLists/teachersLists/${teacher.id}`}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                     名稱: {teacher.username}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">無老師數據</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherListsbysupadmin;