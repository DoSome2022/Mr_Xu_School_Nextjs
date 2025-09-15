"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";

interface SchoolYear {
  school_year: string;
}

const fetcher = (url: string, init?: RequestInit): Promise<SchoolYear[]> =>
  fetch(url, init).then((res) => {
    if (!res.ok) throw new Error("無法載入年份資料");
    return res.json();
  });

const BookLists_years = () => {
  const params = useParams();
  const schoolId = params?.schooldetailbyID as string;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolyears/`, fetcher);

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
          {error?.message || "無法載入年份資料"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">書單年份列表</h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${schoolId}/bookLists/upload`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳書單
            </Link>
            <Link
              href={`/admin/schoolLists/${schoolId}`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回學校詳情
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">年份列表</h2>
          {data.length === 0 ? (
            <p className="text-gray-500">尚未新增年份</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {data.map((year) => (
                <Link
                  key={year.school_year}
                  href={`/admin/schoolLists/${schoolId}/bookLists/${year.school_year}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#e7915b] hover:text-white transition-colors duration-300"
                >
                  <p className="text-gray-800 font-semibold">{year.school_year}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookLists_years;