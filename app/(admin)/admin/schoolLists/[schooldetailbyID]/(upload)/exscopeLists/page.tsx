"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";

// 定義年級對應對象
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

interface StudentSchoolGrade {
  school_grade: string;
}

const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolGrade[]> =>
  fetch(url, init).then((res) => res.json());
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const ExScopeLists = () => {
  const params = useParams();
  const SchoolId = params?.schooldetailbyID as string;

  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/School_data/schoolgrades/`,
    fetcher
  );

  if (error)
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-500 text-sm">錯誤：{error.message}</div>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-gray-700 text-sm">載入中...</div>
        </div>
      </div>
    );

  if (!data || !Array.isArray(data)) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-500 text-sm">無效的資料格式</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">考試範圍</h1>

          <Link
            href={`/admin/schoolLists/${SchoolId}/exscopeLists/upload`}
            className="inline-block mb-6 px-4 py-2 bg-[#e7915b] text-white rounded-md hover:bg-[#d17a4a] transition-colors duration-300"
          >
            上傳考試卷
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((grades) => (
              <Link
                key={grades.school_grade}
                href={`/admin/schoolLists/${SchoolId}/exscopeLists/${grades.school_grade}`}
                className="block p-4 bg-gray-50 rounded-md hover:bg-[#e7915b] hover:text-white transition-colors duration-300 text-gray-800 font-medium text-center"
              >
                {gradeMapping[grades.school_grade]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExScopeLists;