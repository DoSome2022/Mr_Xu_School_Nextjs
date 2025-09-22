"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface StudentDetailData {
  name: string;
  img: string;
  id: string;
  school: string;
  grade: string; // 確保介面定義為字串
  year: string;
  quarter: string;
}

const SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID = () => {
  const params = useParams<{
    studentdetailbyID: string;
    id: string;
    parentdetailbyID: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
  }>();

  const StudentID = params?.studentdetailbyID as string;
  const ParentID = params?.parentdetailbyID;
  const SchoolName = params?.school as string;
  const Grade = params?.grade as string;
  const Year = params?.year as string;
  const Quarter = params?.quarter as string;
  const Id = params?.id as string;

  const [GetStudentSchoolTimeTableDetailByID, setGetStudentSchoolTimeTableDetailByID] = useState<
    StudentDetailData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (StudentID && Id) {
      const getstudentschooltimetabledetailbyid = async (StudentID: string, id: string) => {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/student/Student_ScTimetable_by_id_Lists_by_id/${StudentID}/${id}`);
          if (!res.ok) {
            throw new Error("獲取資料失敗！");
          }
          const result = await res.json();
          // 將 grade 和 quarter 轉為字串
          const transformedResult = result.map((item: StudentDetailData) => ({
            ...item,
            grade: String(item.grade), // 轉換為字串
            quarter: String(item.quarter), // 轉換為字串
          }));
          setGetStudentSchoolTimeTableDetailByID(transformedResult);
        } catch (error) {
          console.error(error);
          setError(error instanceof Error ? error.message : "發生未知錯誤");
        } finally {
          setIsLoading(false);
        }
      };
      getstudentschooltimetabledetailbyid(StudentID, Id);
    }
  }, [StudentID, Id]);

  // 過濾符合條件的資料
  const filteredData = GetStudentSchoolTimeTableDetailByID.filter((d) => {
    const isMatch =
      d.school === SchoolName &&
      String(d.grade) === String(Grade) && // 確保比較時為字串
      d.year === Year &&
      String(d.quarter) === String(Quarter); // 確保比較時為字串
    console.log("Filter check:", {
      data: d,
      SchoolName,
      Grade,
      Year,
      Quarter,
      isMatch,
    });
    return isMatch;
  });

  // 年級對應中文
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

  console.log("GetStudentSchoolTimeTableDetailByID : ", GetStudentSchoolTimeTableDetailByID, " -- End --");
  console.log("filteredData :", filteredData, "-- End --");

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
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
          href={`/admin/userLists/parentsLists/${ParentID}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校時間表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          年級 {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學年 {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          季度 {Quarter}
        </Link>
        <span className="mx-2">/</span>

      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 標題欄 - 使用與 navbar 相同的配色 */}
          <div className="bg-[#80A8BD] px-6 py-4">
            <h1 className="text-xl font-bold text-white">
              {SchoolName} - {gradeMapping[Grade] || Grade} - {Year}年 - 第{Quarter}季 - 時間表詳情
            </h1>
          </div>

          {/* 內容區域 */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
                <p className="mt-4 text-gray-600">資料載入中...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-500 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                沒有找到符合條件的時間表詳情
              </div>
            ) : (
              <div className="space-y-6">
                {filteredData.map((d) => (
                  <div key={d.id} className="space-y-4">
                    {/* 基本信息卡片 */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h2 className="text-2xl font-bold text-gray-800">{d.name}</h2>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">學校:</span> {d.school}
                        </div>
                        <div>
                          <span className="font-medium">年級:</span> {gradeMapping[d.grade] || d.grade}
                        </div>
                        <div>
                          <span className="font-medium">年份:</span> {d.year}
                        </div>
                        <div>
                          <span className="font-medium">季度:</span> 第{d.quarter}季
                        </div>
                      </div>
                    </div>

                    {/* 圖片展示區域 */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-3 border-b border-gray-200">
                        <h3 className="font-medium text-gray-700">學校時間表圖片</h3>
                      </div>
                      <div className="p-4 flex justify-center bg-white">
                        <Image
                          width={800}
                          height={800}
                          src={d.img}
                          alt={`${d.name}的學校時間表`}
                          className="rounded-md shadow-sm object-contain max-h-[600px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID;