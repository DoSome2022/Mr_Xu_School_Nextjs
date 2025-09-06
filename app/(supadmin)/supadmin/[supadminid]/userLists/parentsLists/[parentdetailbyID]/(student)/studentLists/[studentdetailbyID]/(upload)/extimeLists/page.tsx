"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Student_School {
  school: string;
}

const ExTimeListsbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentId = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;

  const [GetSutudentData, setGetSutudentData] = useState<Student_School[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 驗證路由參數
  if (!supadminId || !ParentId || !StudentID) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  useEffect(() => {
    const fetchStudentData = async (parentId: string) => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:8000";
        const res = await fetch(
          `${apiUrl}/api/student/Student_Lists/${parentId}?studentId=${encodeURIComponent(StudentID)}`
        );
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
        if (!Array.isArray(result) || !result.every((item) => typeof item.school === "string")) {
          throw new Error("無效的學生資料格式");
        }
        setGetSutudentData(result);
      } catch (err: any) {
        setError(err.message || "無法獲取學生資料");
      } finally {
        setIsLoading(false);
      }
    };

    if (ParentId) {
      fetchStudentData(ParentId);
    }
  }, [ParentId, StudentID]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("-- Student Data : --", GetSutudentData, "-- END --");
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminId}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminId}/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <span>考試時間表</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">考試時間表學校列表</h2>

      {isLoading && <div className="text-gray-600 p-4">載入中...</div>}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>
      )}
      {!isLoading && !error && GetSutudentData.length === 0 && (
        <div className="text-gray-600 p-4">無學校資料</div>
      )}

      <div className="flex flex-col space-y-4">
        <Link
          className="text-blue-600 hover:text-blue-800 font-medium"
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/extimeLists/upload`}
        >
          上傳考試時間表
        </Link>
        {GetSutudentData.map((d) => (
          <Link
            key={d.school}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(d.school)}`}
          >
            學校：{decodeURIComponent(d.school)}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExTimeListsbysupadmin;