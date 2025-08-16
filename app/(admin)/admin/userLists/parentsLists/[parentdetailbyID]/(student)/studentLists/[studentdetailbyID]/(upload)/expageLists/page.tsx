"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Student_School {
  school: string;
}

const ExPageLists = () => {
  const params = useParams<{ parentdetailbyID: string; studentdetailbyID: string }>();
  const ParentId = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;

  // 學生資料狀態
  const [GetSutudentData, setGetSutudentData] = useState<Student_School[]>([]);

  // 用 ParentId 獲取學生資料
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

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#e7915b] mb-6">考試卷學校列表</h2>
      {GetSutudentData.length > 0 ? (
        <div className="space-y-4">
          <Link
            href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/expageLists/upload`}
            className="block text-[#e7915b] hover:text-cyan-200 font-medium transition-colors duration-300"
          >
            上傳考試卷
          </Link>
          {GetSutudentData.map((d) => (
            <div key={d.school} className="border border-gray-200 rounded p-4 bg-white shadow-sm">
              <Link
                href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/expageLists/${d.school}`}
                className="block text-[#e7915b] hover:text-cyan-200 font-medium transition-colors duration-300"
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

export default ExPageLists;