"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

// 定義科目對應對象
const subjectMapping: { [key: string]: string } = {
  math: "數學",
  english: "英語",
  science: "科學",
  chinese: "國語",
};

interface Student_School_subject {
  school_subject: string;
}

const ExScope_Grade_Quarter_Subjectbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    quarter: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Quarter) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = (url: string, init?: RequestInit): Promise<Student_School_subject[]> =>
    fetch(url, {
    ...init, // 保留傳入的 init 配置（若有）
    cache: 'no-store', // 強制不快取，確保每次請求新數據
    headers: {
      ...init?.headers, // 合併傳入的 headers（若有）
      'Cache-Control': 'no-cache', // 設置快取控制頭部
    },
  }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/School_data/schoolsubjects?school=${encodeURIComponent(SchoolName)}&grade=${encodeURIComponent(Grade)}&quarter=${encodeURIComponent(Quarter)}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入科目資料 - {error.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (isLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 資料格式驗證
  if (
    !data ||
    !Array.isArray(data) ||
    !data.every((item) => typeof item.school_subject === "string")
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的科目資料格式
      </div>
    );
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生資料
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試範圍
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Grade}
        </Link>
        <span className="mx-2">/</span>
        <span>第{Quarter}季度</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} {Grade} 第{Quarter}季度 考試範圍科目列表
      </h2>

      {/* {data.length === 0 && (
        <div className="text-gray-600 p-4">無科目資料</div>
      )}

      <div className="flex flex-col space-y-4">
        {data.map((subject) => (
          <Link
            key={subject.school_subject}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${subject.school_subject}`}
          >
            {subjectMapping[subject.school_subject] || subject.school_subject}
          </Link>
        ))}
      </div> */}
                  <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">科目選擇</h1>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {data.map((subject) => (
                            <Link
                                key={subject.school_subject}
                                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${subject.school_subject}`}
                                className="block bg-[#e7915b] hover:bg-[#80A8BD] text-white rounded-lg p-4 transition-colors duration-300 shadow hover:shadow-md text-center"
                            >
                                科目: {subject.school_subject}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
    </div>
  );
};

export default ExScope_Grade_Quarter_Subjectbysupadmin;