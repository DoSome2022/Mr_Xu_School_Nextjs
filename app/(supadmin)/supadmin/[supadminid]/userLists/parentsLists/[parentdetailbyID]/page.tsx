"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";


interface ParentData {
  nickname: string;
  username: string;
}

interface StudentData {
  id: string;
  name: string;
  school: string;
  grade: number;
  Parent_data: ParentData;
}

const ParentDetailbysupadmin = () => {
  const params = useParams();
  const parentId = params?.parentdetailbyID as string;
  const supadminId = params?.supadminid as string;
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parentId) {
      const fetchStudentData = async (parentdataid: string) => {
        try {
          setLoading(true);
          const res = await fetch(`/api/student/Student_Lists/${parentdataid}`);
          if (!res.ok) {
            throw new Error("無法獲取學生數據");
          }
          const result: StudentData[] = await res.json();
          setStudentData(result);
        } catch (error: any) {
          console.error("獲取學生數據失敗:", error);
          setError("無法載入學生列表");
        } finally {
          setLoading(false);
        }
      };
      fetchStudentData(parentId);
    }
  }, [parentId]);

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
          <h1 className="text-3xl font-semibold text-blue-600">家長詳情</h1>
          <div className="flex space-x-4">
            <Link
              href={`/supadmin/${supadminId}/userLists/parentsLists/${parentId}/createstudent`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
            >
              建立學生
            </Link>
            <Link
              href={`/supadmin/${supadminId}/userLists/parentsLists/${parentId}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
            >
              修改家長
            </Link>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {studentData.length > 0 ? (
            <div className="space-y-4">
              {studentData.map((student) => (
                <div
                  key={student.id}
                  className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <Link
                    href={`/supadmin/${supadminId}/userLists/parentsLists/${parentId}/studentLists/${student.id}`}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    <p>學生名: {student.name}</p>
                    <p>學校: {student.school}</p>
                    <p>年級: {student.grade}</p>
                    <p>
                      家長名: {student.Parent_data.nickname} /{" "}
                      {student.Parent_data.username}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">無學生數據</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDetailbysupadmin;