"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SchoolData {
  school: string;
}

const Student_BookLists_Schoolbysupadmin = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    supadminid: string;
  }>();
  const ParentId = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const supadminId = params?.supadminid;

  const [GetSutudentData, setGetSutudentData] = useState<SchoolData[]>([]);
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

  // 獲取學生資料
  useEffect(() => {
    const fetchStudentData = async (parentdataid: string) => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/student/Student_Lists/${parentdataid}`);
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
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
  }, [ParentId]);

  // 開發環境下日誌
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
        <span>書單</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">學生書單管理</h2>

      {isLoading && <div className="text-gray-600">載入中...</div>}
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

      <div className="flex flex-col space-y-4">
        <Link
          className="text-blue-600 hover:text-blue-800 font-medium"
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/bookLists/upload`}
        >
          上傳書單
        </Link>

        {GetSutudentData.length === 0 && !isLoading && !error && (
          <div className="text-gray-600">無學校資料</div>
        )}

        {GetSutudentData.map((d) => (
          <Link
            key={d.school}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/bookLists/${d.school}`}
          >
            學校: {d.school}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Student_BookLists_Schoolbysupadmin;