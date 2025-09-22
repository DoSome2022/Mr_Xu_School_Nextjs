"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SchoolData {
  school: string;
}

const Student_BookLists_School = () => {
  const params = useParams<{ parentdetailbyID: string; studentdetailbyID: string }>();
  const ParentId = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;

  // 學生資料狀態
  const [GetSutudentData, setGetSutudentData] = useState<SchoolData[]>([]);

  // 獲取學生資料
  useEffect(() => {
    if (ParentId) {
      const fetchStudentData = async (parentdataid: string) => {
        try {
          const res = await fetch(`/api/student/Student_Lists/${parentdataid}`);
          if (!res.ok) {
            throw new Error(`獲取學生資料失敗: ${res.statusText}`);
          }
          const result = await res.json();
          setGetSutudentData(result);
        } catch (error) {
          console.error("錯誤:", error);
          alert("無法獲取學生資料，請稍後重試");
        }
      };
      fetchStudentData(ParentId);
    }
  }, [ParentId]);

  console.log("-- Student Data : --", GetSutudentData, "-- END --");

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
        <span>書單</span>
      </nav>
    
      <h2 className="text-2xl font-bold text-[#80A8BD] mb-6">書單學校列表</h2>
      {GetSutudentData.length > 0 ? (
        <div className="space-y-4">
          {GetSutudentData.map((d) => (
            <div key={d.school} className="border border-gray-200 rounded p-4 bg-white shadow-sm">
              <Link
                href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/bookLists/upload`}
                className="block text-[#80A8BD] hover:text-cyan-200 font-medium transition-colors duration-300 mb-2"
              >
                上傳書單
              </Link>
              <Link
                href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/bookLists/${d.school}`}
                className="block text-[#80A8BD] hover:text-cyan-200 font-medium transition-colors duration-300"
              >
                學校: {d.school}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無學校資料</p>
      )}
    </div>
  );
};

export default Student_BookLists_School;