"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

const gradeMapping: { [key: number]: string } = {
  1: "小學1年級",
  2: "小學2年級",
  3: "小學3年級",
  4: "小學4年級",
  5: "小學5年級",
  6: "小學6年級",
  7: "初中1年級",
  8: "初中2年級",
  9: "初中3年級",
  10: "高中1年級",
  11: "高中2年級",
  12: "高中3年級",
};

interface CourseData {
  id: string;
  course_name: string;
  course_subject: string;
  persons: number;
  teacher: string;
  grade: number;
}

const CourseLists = () => {
  const [getCourseData, setGetCourseData] = useState<CourseData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CourseData[]>([]);
  const [searchField, setSearchField] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 獲取課程數據
  useEffect(() => {
    const getCourseData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/Course_Lists");
        if (!res.ok) {
          throw new Error("無法獲取課程數據");
        }
        const result = await res.json();
        setGetCourseData(result);
        setSearchResults([]); // 清空搜索結果以顯示所有課程
      } catch (error: any) {
        console.error("獲取課程數據失敗:", error);
        setError("無法載入課程數據");
      } finally {
        setIsLoading(false);
      }
    };
    getCourseData();
  }, []);

  // 搜索課程
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/Course_Lists_search?query=${encodeURIComponent(searchQuery)}&field=${encodeURIComponent(searchField)}`
      );
      if (!response.ok) {
        throw new Error("搜尋失敗");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("搜尋失敗:", error);
      setError("搜尋失敗，請稍後重試");
    }
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchField("all");
  };

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  console.log("getCourseData : ", getCourseData)

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">課程列表</h1>
          <Link
            href="/admin/courseLists/createCourse"
            className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            建立課程
          </Link>
        </div>

        {/* 搜索區域 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">搜索課程</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <input
              type="text"
              placeholder="輸入搜索內容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80A8BD] transition-colors duration-300"
            />
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80A8BD] transition-colors duration-300"
            >
              <option value="all">所有字段</option>
              <option value="course_name">課程名稱</option>
              <option value="course_subject">科目</option>
              <option value="persons">人數</option>
              <option value="teacher">老師</option>
              <option value="grade">年級</option>
            </select>
            <div className="flex space-x-2">
              <Button
                onClick={handleSearch}
                className="bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
              >
                搜索
              </Button>
              <Button
                onClick={clearSearch}
                className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300"
              >
                清除
              </Button>
            </div>
          </div>
        </div>

        {/* 搜索結果 */}
        {searchResults.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">搜索結果</h2>
            <div className="grid gap-4">
              {searchResults.map((course) => (
                <Link
                  key={course.id}
                  href={`/admin/courseLists/${course.id}`}
                  className="text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300"
                >
                  <div className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-[#80A8BD]">{course.course_name}</h3>
                    <p className="text-gray-600">科目: {course.course_subject}</p>
                    <p className="text-gray-600">人數: {course.persons}</p>
                    <p className="text-gray-600">老師: {course.teacher}</p>
                    <p className="text-gray-600">年級: {gradeMapping[course.grade] || "未知年級"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 所有課程 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">所有課程</h2>
          {getCourseData.length === 0 ? (
            <p className="text-gray-600">暫無課程數據</p>
          ) : (
            <div className="grid gap-4">
              {getCourseData.map((course) => (
                <Link
                  key={course.id}
                  href={`/admin/courseLists/${course.id}`}
                  className="text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300"
                >
                  <div className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-[#80A8BD]">{course.course_name}</h3>
                    <p className="text-gray-600">科目: {course.course_subject}</p>
                    <p className="text-gray-600">人數: {course.persons}</p>
                    <p className="text-gray-600">老師: {course.teacher}</p>
                    <p className="text-gray-600">年級: {gradeMapping[course.grade] || "未知年級"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLists;