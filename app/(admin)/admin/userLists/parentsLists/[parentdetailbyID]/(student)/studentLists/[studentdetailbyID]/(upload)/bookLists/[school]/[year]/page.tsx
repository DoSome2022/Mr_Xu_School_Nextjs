"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

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

interface StudentGrades {
  school_grade: string;
}

const Student_BookLists_School_Year_Grade = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    year: string;
  }>();
  const ParentID = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;
  const SchoolName = params?.school as string;
  const Year = params?.year as string;

  const fetcher = (url: string, init?: RequestInit): Promise<StudentGrades[]> =>
    fetch(url, init).then((res) => res.json());
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/School_data/schoolgrades/`,
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
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <span>{Year}</span>
      </nav>
      <h2 className="text-2xl font-bold text-[#80A8BD] mb-6">書單年級列表</h2>
      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((grades) => (
            <div
              key={grades.school_grade}
              className="border border-gray-200 rounded p-4 bg-white shadow-sm"
            >
              <Link
                href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${grades.school_grade}`}
                className="block text-[#80A8BD] hover:text-cyan-200 font-medium transition-colors duration-300"
              >
                {gradeMapping[grades.school_grade] || grades.school_grade}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無年級資料</p>
      )}
    </div>
  );
};

export default Student_BookLists_School_Year_Grade;