"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface StudentData {
  id: string;
  name: string;
  school: string;
  grade: number;
  quarter: number;
  subject: string;
}

const ExScope_Grade_Quarter_Subject_Lists = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    school: string;
    grade: string;
    quarter: string;
    subject: string;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const SchoolName = params?.school as string;
  const Grade = params?.grade as string;
  const Quarter = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";

  // 驗證路由參數
  if (!ParentID || !StudentID || !SchoolName || !Grade || !Quarter || !SubjectId) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentExScopeLists, setGetStudentExScopeLists] = useState<StudentData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (StudentID) {
      const getstudentexscopelist = async (studentId: string) => {
        try {
          const res = await fetch(`/api/student/Student_ExScope_by_id_Lists/${studentId}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error(`無法連線：${res.statusText}`);
          }
          const result = await res.json();
          if (!Array.isArray(result)) {
            throw new Error("無效的資料格式");
          }
          setGetStudentExScopeLists(result);
        } catch (error) {
          console.error("獲取範圍列表失敗:", error);
          setError("無法載入範圍列表，請稍後重試");
          toast.error("無法載入範圍列表，請稍後重試");
        }
      };
      getstudentexscopelist(StudentID);
    }
  }, [StudentID]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("params:", params);
    console.log("GetStudentExScopeLists:", GetStudentExScopeLists, "-- END --");
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* 麵包屑導航，採用 navbar 風格 */}
      <nav className="flex items-center justify-between bg-gray-900 p-4 shadow-md">
        <div className="flex flex-row gap-6">
          <Link
            href={`/parent/${ParentID}`}
            prefetch={false} // 禁用預取以避免 404
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            苜頁
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            學生資料
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/exscopeLists`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            範圍列表
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${encodeURIComponent(SubjectId)}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            {SchoolName} {Grade} 第{Quarter}季 {SubjectId}
          </Link>
          <span className="text-white text-lg font-medium">範圍列表詳情</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          範圍列表 - {SchoolName} {Grade} 第{Quarter}季 {SubjectId}
        </h2>

        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          {error ? (
            <div className="text-red-400 p-4 rounded-lg bg-red-900 bg-opacity-20">
              {error}
            </div>
          ) : GetStudentExScopeLists.length === 0 ? (
            <div className="text-gray-300 p-4">無範圍列表資料</div>
          ) : (
            <div className="space-y-4">
              {GetStudentExScopeLists.map((d) => {
                if (
                  d.school === SchoolName &&
                  d.grade === Number(Grade) &&
                  d.quarter === Number(Quarter) &&
                  d.subject === SubjectId
                ) {
                  return (
                    <div key={d.id}>
                      <Link
                        href={`/parent/${ParentID}/profiles/${StudentID}/upload/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${encodeURIComponent(SubjectId)}/${d.id}`}
                        prefetch={false}
                        className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200 block mb-2"
                      >
                        名稱: {d.name}
                      </Link>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExScope_Grade_Quarter_Subject_Lists;