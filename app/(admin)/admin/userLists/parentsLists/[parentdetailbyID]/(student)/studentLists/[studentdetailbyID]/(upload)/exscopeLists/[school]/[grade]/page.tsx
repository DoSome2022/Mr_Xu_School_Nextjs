"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

interface StudentSchoolQuarter {
  school_quarter: string;
}

const ExScope_Grade_Quarter = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
  }>();
  const ParentID = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;
  const SchoolName = params?.school as string;
  const Grade = params?.grade as string;

  const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolQuarter[]> =>
    fetch(url, init).then((res) => res.json());
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolquarters/`, fetcher);

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
      <h2 className="text-2xl font-bold text-[#e7915b] mb-6">考試範圍季度列表</h2>
      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((quarters) => (
            <div
              key={quarters.school_quarter}
              className="border border-gray-200 rounded p-4 bg-white shadow-sm"
            >
              <Link
                href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${quarters.school_quarter}`}
                className="block text-[#e7915b] hover:text-cyan-200 font-medium transition-colors duration-300"
              >
                季度: {quarters.school_quarter}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無季度資料</p>
      )}
    </div>
  );
};

export default ExScope_Grade_Quarter;