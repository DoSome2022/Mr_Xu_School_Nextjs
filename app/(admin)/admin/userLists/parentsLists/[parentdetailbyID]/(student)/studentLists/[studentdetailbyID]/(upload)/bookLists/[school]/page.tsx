"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

interface SchoolYear {
  school_year: string;
}

const Student_BookLists_School_Year = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
  }>();
  const ParentID = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;
  const SchoolName = params?.school as string;

  const fetcher = (url: string, init?: RequestInit): Promise<SchoolYear[]> =>
    fetch(url, init).then((res) => res.json());
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/School_data/schoolyears/`,
    fetcher
  );

  if (error)
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <p className="text-red-500">錯誤: {error.message}</p>
      </div>
    );
  if (isLoading)
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <p className="text-gray-500">載入中...</p>
      </div>
    );
  // 確保 data 是陣列
  if (!data || !Array.isArray(data)) {
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <p className="text-red-500">無效的資料格式</p>
      </div>
    );
  }

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
        <span>{SchoolName}</span>
      </nav>
      <h2 className="text-2xl font-bold text-[#80A8BD] mb-6">書單學年列表</h2>
      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((year) => (
            <div
              key={year.school_year}
              className="border border-gray-200 rounded p-4 bg-white shadow-sm"
            >
              <Link
                href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${year.school_year}`}
                className="block text-[#80A8BD] hover:text-cyan-200 font-medium transition-colors duration-300"
              >
                年份: {year.school_year}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無學年資料</p>
      )}
    </div>
  );
};

export default Student_BookLists_School_Year;