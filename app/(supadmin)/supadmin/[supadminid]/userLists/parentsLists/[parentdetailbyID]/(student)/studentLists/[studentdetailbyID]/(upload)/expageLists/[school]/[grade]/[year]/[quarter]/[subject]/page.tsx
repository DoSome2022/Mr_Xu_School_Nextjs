"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Student_name {
  id: string;
  name: string;
  school: string;
  grade: number; // 改為 number，與 API 一致
  year: string;
  quarter: number; // 改為 number，與 API 一致
  subject: string;
}

const subjectMapping: { [key: string]: string } = {
  math: "數學",
  english: "英語",
  science: "科學",
  chinese: "國語",
  中: "國語", // 添加直接映射，處理 API 返回的 "中"
};

const ExPageLists_Grade_Year_Quarter_Subject_Listsbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Year = params?.year ? decodeURIComponent(params.year) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Year || !Quarter || !Subject) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentExPaperLists, setGetStudentExPaperLists] = useState<Student_name[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getStudentExPaperList = async (studentId: string) => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";

        const res = await fetch(
          `${apiUrl}/api/student/Student_ExPaper_by_id_Lists/${studentId}?school=${encodeURIComponent(
            SchoolName
          )}&grade=${encodeURIComponent(Grade)}&year=${encodeURIComponent(Year)}&quarter=${encodeURIComponent(
            Quarter
          )}&subject=${encodeURIComponent(Subject)}`,
          {
            cache: "no-store", // 強制不快取，確保每次請求新數據
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();

        console.log("inuseEffectData : ", result);
        if (!Array.isArray(result)) {
          throw new Error("無效的考試卷資料格式");
        }

        // 驗證數據結構
        if (
          !result.every(
            (item: any) =>
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.school === "string" &&
              typeof item.grade === "number" &&
              typeof item.year === "string" &&
              typeof item.quarter === "number" &&
              typeof item.subject === "string"
          )
        ) {
          console.error("驗證失敗的數據:", result);
          throw new Error("無效的學生考試卷資料格式");
        }

        setGetStudentExPaperLists(result);
      } catch (err: any) {
        setError(err.message || "無法獲取考試卷資料");
      } finally {
        setIsLoading(false);
      }
    };

    if (StudentID) {
      getStudentExPaperList(StudentID);
    }
  }, [StudentID, SchoolName, Grade, Year, Quarter, Subject]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("ExPaper Data:", GetStudentExPaperLists);
    console.log("Params:", { SchoolName, Grade, Year, Quarter, Subject });
  }

  // 將參數轉換為正確類型以匹配 API 數據
  const parsedGrade = parseInt(Grade, 10); // 將 Grade 轉為數字
  const parsedQuarter = parseInt(Quarter, 10); // 將 Quarter 轉為數字
  const normalizedSubject = subjectMapping[Subject] === "國語" ? "中" : Subject; // 將 Subject 轉為 API 格式

  // 過濾數據
  const filteredExPapers = GetStudentExPaperLists.filter(
    (d) =>
      d.school === SchoolName &&
      d.grade === parsedGrade &&
      d.year === Year &&
      d.quarter === parsedQuarter &&
      d.subject === normalizedSubject
  );

  console.log("Filtered ExPaper Data:", filteredExPapers, " -- End -- ");

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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists`}
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試卷
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}`}
          className="text-blue-600 hover:text-blue-800"
        >
          第{Quarter}季度
        </Link>
        <span className="mx-2">/</span>
        <span>{subjectMapping[Subject] || Subject}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} {Grade} {Year} 第{Quarter}季度 {subjectMapping[Subject] || Subject} 考試卷
      </h2>

      {isLoading && <div className="text-gray-600 p-4">載入中...</div>}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {filteredExPapers.length > 0 ? (
        <div className="space-y-4">
          {filteredExPapers.map((d) => (
            <div key={d.id} className="border border-gray-200 rounded p-4 bg-white shadow-sm">
              <Link
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
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

export default ExPageLists_Grade_Year_Quarter_Subject_Listsbysupadmin;