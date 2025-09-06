"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface StudentDatailData {
  name: string;
  img: string;
  school: string;
  grade: string;
  year: string;
  quarter: string;
  subject: string;
  id: string;
}

const subjectMapping: { [key: string]: string } = {
  math: "數學",
  english: "英語",
  science: "科學",
  chinese: "國語",
  // 根據 API 返回的科目代碼添加更多映射
};

const ExPageLists_Grade_Year_Quarter_Subject_Lists_By_IDbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
    id: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Year = params?.year ? decodeURIComponent(params.year) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";
  const id = params?.id;

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Year || !Quarter || !Subject || !id) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentExPaperDetailByID, setGetStudentExPaperDetailByID] = useState<StudentDatailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getStudentExPaperList = async (studentId: string, paperId: string) => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(
          `${apiUrl}/api/student/Student_ExPaper_by_id_Lists_by_id/${studentId}/${paperId}?school=${encodeURIComponent(
            SchoolName
          )}&grade=${encodeURIComponent(Grade)}&year=${encodeURIComponent(Year)}&quarter=${encodeURIComponent(
            Quarter
          )}&subject=${encodeURIComponent(Subject)}`
        );
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
        setGetStudentExPaperDetailByID(result);
      } catch (err: any) {
        setError(err.message || "無法獲取考試卷詳細資料");
      } finally {
        setIsLoading(false);
      }
    };

    if (StudentID && id) {
      getStudentExPaperList(StudentID, id);
    }
  }, [StudentID, id, SchoolName, Grade, Year, Quarter, Subject]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("Params:", params);
    console.log("ExPaper Detail:", GetStudentExPaperDetailByID);
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
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
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {subjectMapping[Subject] || Subject}
        </Link>
        <span className="mx-2">/</span>
        <span>{GetStudentExPaperDetailByID?.name || "考試卷詳細資料"}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} {Grade} {Year} 第{Quarter}季度 {subjectMapping[Subject] || Subject} 考試卷詳細資料
      </h2>

      {isLoading && <div className="text-gray-600 p-4">載入中...</div>}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {!isLoading && !error && !GetStudentExPaperDetailByID && (
        <div className="text-gray-600 p-4">無考試卷詳細資料</div>
      )}
      {!isLoading &&
        !error &&
        GetStudentExPaperDetailByID &&
        GetStudentExPaperDetailByID.school === SchoolName &&
        GetStudentExPaperDetailByID.grade === Grade &&
        GetStudentExPaperDetailByID.year === Year &&
        GetStudentExPaperDetailByID.quarter === Quarter &&
        GetStudentExPaperDetailByID.subject === Subject &&
        GetStudentExPaperDetailByID.id === id && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium text-blue-600">
              名稱：{GetStudentExPaperDetailByID.name}
            </h3>
            <Image
              width={500}
              height={500}
              src={
                GetStudentExPaperDetailByID.img.startsWith("http")
                  ? GetStudentExPaperDetailByID.img
                  : `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}${
                      GetStudentExPaperDetailByID.img
                    }`
              }
              alt={GetStudentExPaperDetailByID.name}
              className="rounded-lg border border-blue-200"
            />
          </div>
        )}
    </div>
  );
};

export default ExPageLists_Grade_Year_Quarter_Subject_Lists_By_IDbysupadmin;