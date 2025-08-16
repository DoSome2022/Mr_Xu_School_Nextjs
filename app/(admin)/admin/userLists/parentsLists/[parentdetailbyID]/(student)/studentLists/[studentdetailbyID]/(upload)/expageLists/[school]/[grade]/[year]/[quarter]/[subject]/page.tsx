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
          const res = await fetch(`/api/student/Student_ExPaper_by_id_Lists/${studentID}`);
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
      d.grade === Grade &&
      d.year === Year &&
      d.quarter === Quarter &&
      d.subject === Subject
  );

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#e7915b] mb-6">考試卷列表</h2>
      {filteredExPaperLists.length > 0 ? (
        <div className="space-y-4">
          {filteredExPaperLists.map((d) => (
            <div key={d.id} className="border border-gray-200 rounded p-4 bg-white shadow-sm">
              <Link
                href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
                className="block text-[#e7915b] hover:text-cyan-200 font-medium transition-colors duration-300"
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