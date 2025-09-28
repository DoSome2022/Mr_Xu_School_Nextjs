"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";

interface SchoolQuarter {
  id: number;
  school_quarter: string; // 修正為 string，匹配 API 回應
}

const fetcher = (url: string, init?: RequestInit): Promise<SchoolQuarter[]> =>
  fetch(url, {
    ...init, // 保留傳入的 init 配置（若有）
    cache: 'no-store', // 強制不快取，確保每次請求新數據
    headers: {
      ...init?.headers, // 合併傳入的 headers（若有）
      'Cache-Control': 'no-cache', // 設置快取控制頭部
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`請求失敗：${res.statusText}`);
    }
    return res.json();
  });

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const ExScopeLists_Grade_Quarterbysupadmin = () => {
  const params = useParams<{
    grade: string;
    schooldetailbyID: string;
    supadminid: string;
  }>();
  const supadminid = params?.supadminid;
  const SchoolId = params?.schooldetailbyID;
  const GradeId = params?.grade;

  // 驗證路由參數
  if (!supadminid || !SchoolId || !GradeId) {
    return (
      <div className="p-4 text-red-500">
        錯誤：缺少必要路由參數（supadminid、schooldetailbyID 或 grade）
      </div>
    );
  }

  const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolquarters/`, fetcher);

  // 開發環境下日誌
  if (process.env.NODE_ENV === "development") {
    console.log("supadminid:", supadminid);
    console.log("SchoolId:", SchoolId);
    console.log("GradeId:", GradeId);
    console.log("SWR data:", JSON.stringify(data, null, 2));
  }

  // 錯誤處理
  if (error) {
    return <div className="p-4 text-red-500">錯誤：{error.message || "無法載入資料"}</div>;
  }

  // 載入中
  if (isLoading) {
    return <div className="p-4 text-gray-600">載入中...</div>;
  }

  // 確保 data 是陣列
  if (!data || !Array.isArray(data)) {
    return <div className="p-4 text-red-500">無效的資料格式</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm px-4 sm:px-6 lg:px-8">
        <Link href={`/supadmin/${supadminid}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminid}/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學校列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校資料
        </Link>
                <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試範圍
        </Link>

        <span className="mx-2">/</span>
        
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${GradeId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {GradeId}
        </Link>
        <span className="mx-2">/</span>
        <span>季度 {GradeId}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">考試範圍 - 季度</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((quarter) => {
              // 確保 school_quarter 是字串
              const schoolQuarter = typeof quarter.school_quarter === "string" ? quarter.school_quarter : String(quarter.school_quarter);
              if (!schoolQuarter) {
                console.warn(`無效的 school_quarter: ${JSON.stringify(quarter.school_quarter)}`);
                return null;
              }

              return (
                <Link
                  key={schoolQuarter}
                  href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${encodeURIComponent(GradeId)}/${encodeURIComponent(schoolQuarter)}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300 text-gray-800 font-medium text-center"
                >
                  季度 {schoolQuarter}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExScopeLists_Grade_Quarterbysupadmin;