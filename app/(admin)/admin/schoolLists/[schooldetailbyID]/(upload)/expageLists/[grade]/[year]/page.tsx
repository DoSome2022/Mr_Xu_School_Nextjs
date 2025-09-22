"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";

interface SchoolQuarter {
  school_quarter: string;
}

const fetcher = (url: string, init?: RequestInit): Promise<SchoolQuarter[]> =>
  fetch(url, init).then((res) => {
    if (!res.ok) throw new Error("無法載入季度資料");
    return res.json();
  });

const ExPageLists_grade_year_quarter = () => {
  const params = useParams();
  const schoolId = params?.schooldetailbyID as string;
  const gradeId = params?.grade as string;
  const yearId = params?.year as string;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolquarters/`, fetcher);

  // 定義年級對應對象，與 ExPageLists 和 ExPageLists_year_grade 一致
  const gradeMapping: { [key: string]: string } = {
    "1": "小學1年級",
    "2": "小學2年級",
    "3": "小學3年級",
    "4": "小學4年級",
    "5": "小學5年級",
    "6": "小學6年級",
    "7": "初中1年級",
    "8": "初中2年級",
    "9": "初中3年級",
    "10": "高中1年級",
    "11": "高中2年級",
    "12": "高中3年級",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !data || !Array.isArray(data)) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">
          {error?.message || "無法載入季度資料"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學枚列表
        </Link>
        <span className="mx-2">/</span>
            <Link href={`/admin/schoolLists/${schoolId}`} className="text-blue-600 hover:text-blue-800">
          學枚資料
        </Link>
        <span className="mx-2">/</span>
          <Link href={`/admin/schoolLists/${schoolId}/expageLists`} className="text-blue-600 hover:text-blue-800">
          學枚名
        </Link>
        <span className="mx-2">/</span>
          <Link href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}`} className="text-blue-600 hover:text-blue-800">
          {gradeId}
        </Link>
              
        <span className="mx-2">/</span>
        <span>{yearId}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            考試卷 - {gradeMapping[gradeId] || gradeId} {yearId} 季度列表
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${schoolId}/expageLists/upload`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳考試卷
            </Link>
            <Link
              href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回年份列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">季度列表</h2>
          {data.length === 0 ? (
            <p className="text-gray-500">尚未新增季度</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {data.map((quarter) => (
                <Link
                  key={quarter.school_quarter}
                  href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}/${quarter.school_quarter}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300"
                >
                  <p className="text-gray-800 font-semibold">季度 {quarter.school_quarter}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExPageLists_grade_year_quarter;