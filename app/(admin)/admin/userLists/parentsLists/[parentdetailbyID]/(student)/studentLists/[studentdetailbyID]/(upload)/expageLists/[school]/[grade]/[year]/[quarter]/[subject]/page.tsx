"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Student_name {
  id: string;
  name: string;
  school: string;
  grade: string;
  year: string;
  quarter: string;
  subject: string;
}

const subjectMapping: { [key: string]: string } = {
  math: "數學",
  english: "英語",
  science: "科學",
  chinese: "國語",
  // 根據 API 返回的科目代碼添加更多映射
};


const ExPageLists_Grade_Year_Quarter_Subject_Lists = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
  }>();
  const ParentID = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;
  const SchoolName = params?.school as string;
  const Grade = params?.grade as string;
  const Year = params?.year as string;
  const Quarter = params?.quarter as string;
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";

  const [GetStudentExPaperLists, setGetStudentExPaperLists] = useState<Student_name[]>([]);

  useEffect(() => {
    if (StudentID) {
      const getstudentexpaperlist = async (studentID: string) => {
        try {
          const res = await fetch(`/api/student/Student_ExPaper_by_id_Lists/${studentID}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
          if (!res.ok) {
            throw new Error(`獲取考試卷資料失敗: ${res.statusText}`);
          }
          const result = await res.json();
          setGetStudentExPaperLists(result);
        } catch (error) {
          console.error("錯誤:", error);
          alert("無法獲取考試卷資料，請稍後重試");
        }
      };
      getstudentexpaperlist(StudentID);
    }
  }, [StudentID]);

  // 過濾符合條件的考試卷數據
  const filteredExPaperLists = GetStudentExPaperLists.filter(
    (d) =>
      d.school === SchoolName &&
      String(d.grade) === String(Grade) &&
      d.year === Year &&
      String(d.quarter) === String(Quarter) &&
      d.subject === Subject
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
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試卷
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}`}
          className="text-blue-600 hover:text-blue-800"
        >
          第{Quarter}季度
        </Link>
        <span className="mx-2">/</span>
        <span>{subjectMapping[Subject] || Subject}</span>
      </nav>

      <h2 className="text-2xl font-bold text-[#80A8BD] mb-6">考試卷列表</h2>
      {filteredExPaperLists.length > 0 ? (
        <div className="space-y-4">
          {filteredExPaperLists.map((d) => (
            <div key={d.id} className="border border-gray-200 rounded p-4 bg-white shadow-sm">
              <Link
                href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
                className="block text-[#80A8BD] hover:text-cyan-200 font-medium transition-colors duration-300"
              >
                名稱: {d.name}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無符合條件的考試卷資料</p>
      )}
    </div>
  );
};

export default ExPageLists_Grade_Year_Quarter_Subject_Lists;