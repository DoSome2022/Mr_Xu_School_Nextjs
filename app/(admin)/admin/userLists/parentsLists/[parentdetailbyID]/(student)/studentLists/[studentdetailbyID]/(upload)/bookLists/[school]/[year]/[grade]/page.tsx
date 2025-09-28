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

const Student_BookLists_School_Year_Grade_Lists = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    year: string;
    grade: string;
  }>();
  const ParentID = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;
  const SchoolName = params?.school as string;
  const Year = params?.year as string;
  const Grade = params?.grade as string;

  const [GetStudentBookLists, setGetStudentBookLists] = useState<StudentData[]>([]);

  useEffect(() => {
    if (StudentID) {
      const getstudentexbooklists = async (studentID: string) => {
        try {
          const res = await fetch(`/api/student/Student_Booklist_by_id_Lists/${studentID}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
          if (!res.ok) {
            throw new Error(`獲取書單資料失敗: ${res.statusText}`);
          }
          const result = await res.json();
          setGetStudentBookLists(result);
        } catch (error) {
          console.error("錯誤:", error);
          alert("無法獲取書單資料，請稍後重試");
        }
      };
      getstudentexbooklists(StudentID);
    }
  }, [StudentID]);

  console.log("GetStudentBookLists:", GetStudentBookLists);

  // 過濾符合條件的書單數據
  const filteredBookLists = GetStudentBookLists.filter(
    (d) => d.school === SchoolName && d.year === Year && String(d.grade) === String(Grade)
  );

  return (
    <div className="p-5 max-w-4xl mx-auto">
            {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          書單
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <span>{Grade}</span>
      </nav>
      <h2 className="text-2xl font-bold text-[#80A8BD] mb-6">書單列表</h2>
      {filteredBookLists.length > 0 ? (
        <div className="space-y-4">
          {filteredBookLists.map((d) => (
            <div
              key={d.id}
              className="border border-gray-200 rounded p-4 bg-white shadow-sm"
            >
              <Link
                href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${Grade}/${d.id}`}
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
  );
};

export default Student_BookLists_School_Year_Grade_Lists;