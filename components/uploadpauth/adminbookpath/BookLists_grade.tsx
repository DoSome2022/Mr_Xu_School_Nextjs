"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";

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

const fetcher = (url: string, init?: RequestInit): Promise<StudentGrades[]> =>
  fetch(url, init).then((res) => {
    if (!res.ok) throw new Error("無法載入年級資料");
    return res.json();
  });

const BookLists_grade_Links = () => {
  const params = useParams();
  const schoolId = params?.schooldetailbyID as string;
  const yearId = params?.year as string;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolgrades/`, fetcher);

  if (isLoading) {
    return <p className="text-gray-600 text-lg">正在加載...</p>;
  }

  if (error || !data || !Array.isArray(data)) {
    return (
      <p className="text-red-500 bg-red-100 p-3 rounded-md">
        {error?.message || "無法載入年級資料"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">年級列表</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">尚未新增年級</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data.map((grade) => (
            <Link
              key={grade.school_grade}
              href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}/${grade.school_grade}`}
              className="block p-4 bg-gray-50 rounded-md hover:bg-[#e7915b] hover:text-white transition-colors duration-300"
            >
              <p className="text-gray-800 font-semibold">
                {gradeMapping[grade.school_grade] || grade.school_grade}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookLists_grade_Links;