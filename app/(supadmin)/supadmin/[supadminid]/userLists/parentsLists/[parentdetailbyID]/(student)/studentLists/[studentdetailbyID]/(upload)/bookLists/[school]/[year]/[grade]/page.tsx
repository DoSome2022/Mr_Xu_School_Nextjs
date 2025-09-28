"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StudentData {
  id: string;
  name: string;
  school: string;
  grade: string;
  year: string;
}

const Student_BookLists_School_Year_Grade_Listsbysupadmin = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    year: string;
    grade: string;
    supadminid: string;
  }>();
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school;
  const Year = params?.year;
  const Grade = params?.grade;
  const supadminId = params?.supadminid;

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Year || !Grade) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentBookLists, setGetStudentBookLists] = useState<StudentData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getstudentexbooklists = async (studentId: string) => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/student/Student_Booklist_by_id_Lists/${studentId}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
        if (!Array.isArray(result)) {
          throw new Error("無效的書單資料格式");
        }
        setGetStudentBookLists(result);
      } catch (err: any) {
        setError(err.message || "無法獲取書單資料");
      } finally {
        setIsLoading(false);
      }
    };

    if (StudentID) {
      getstudentexbooklists(StudentID);
    }
  }, [StudentID]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("Params:", params);
    console.log("GetStudentBookLists:", GetStudentBookLists);
  }

  // 過濾書單
  const filteredBooks = GetStudentBookLists.filter(
    (d) => d.school === SchoolName && d.year === Year && d.grade === Grade
  );

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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生資料
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          書單
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <span>{Grade}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} {Year} {Grade} 書單
      </h2>

      {isLoading && <div className="text-gray-600 p-4">載入中...</div>}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {/* {!isLoading && !error && filteredBooks.length === 0 && (
        <div className="text-gray-600 p-4">無書單資料</div>
      )}

      <div className="flex flex-col space-y-4">
        {filteredBooks.map((d) => (
          <Link
            key={d.id}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${Grade}/${d.id}`}
          >
            名稱：{d.name}
          </Link>
        ))}
      </div> */}
          <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#80A8BD] mb-6">書單列表</h2>
      {filteredBooks.length > 0 ? (
        <div className="space-y-4">
          {filteredBooks.map((d) => (
            <div
              key={d.id}
              className="border border-gray-200 rounded p-4 bg-white shadow-sm"
            >
              <Link
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${Grade}/${d.id}`}
                className="block text-[#80A8BD] hover:text-cyan-200 font-medium transition-colors duration-300"
              >
                名稱: {d.name}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無符合條件的書單資料</p>
      )}
    </div>
    </div>
  );
};

export default Student_BookLists_School_Year_Grade_Listsbysupadmin;