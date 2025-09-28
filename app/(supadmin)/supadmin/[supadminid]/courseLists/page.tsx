"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react"; // 使用 lucide-react 圖標，與 navbar 一致

// 年級映射
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

// 課程資料的 TypeScript 介面，根據 Prisma 模型
interface Course {
  id: string;
  course_name: string;
  course_subject: string;
  persons: number;
  teacher: string;
  grade: number;
}

const CourseListsbysupadmin = () => {
  const { supadminid } = useParams<{ supadminid: string }>();
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 獲取課程資料
  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/Course_Lists", {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error(`HTTP 錯誤，狀態碼：${res.status}`);
        }
        const result = await res.json();
        setCourseData(result);
        setSearchResults(result); // 初始化搜索結果為全部課程
      } catch (err) {
        setError("無法獲取課程資料，請稍後再試");
        console.error("獲取課程失敗:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, []);

  // 處理搜尋
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(courseData); // 若搜尋內容為空，顯示所有課程
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/Course_Lists_search?query=${encodeURIComponent(searchQuery)}&field=${searchField}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            }
      );
      if (!response.ok) {
        throw new Error(`搜尋失敗，狀態碼：${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setError("搜尋課程失敗，請稍後再試");
      console.error("搜尋失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 標題與建立課程按鈕 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">課程列表</h1>
        <Link href={`/supadmin/${supadminid}/courseLists/createCourse`}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            建立課程
          </Button>
        </Link>
      </div>

      {/* 搜尋區域 */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="輸入搜尋內容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有字段</option>
            <option value="course_name">標題</option>
            <option value="course_subject">科目</option>
            <option value="persons">人數</option>
            <option value="teacher">老師</option>
            <option value="grade">年級</option>
          </select>
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "搜尋中..." : "搜尋"}
          </Button>
        </div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* 課程列表 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">載入中...</div>
        ) : searchResults.length === 0 ? (
          <div className="p-4 text-center text-gray-500">無課程資料</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {searchResults.map((course) => (
              <Link
                key={course.id}
                href={`/supadmin/${supadminid}/courseLists/${course.id}`}
                className="block p-4 hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex flex-col space-y-1">
                  <h2 className="text-lg font-medium text-gray-800">
                    課程名稱: {course.course_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    科目: {course.course_subject}
                  </p>
                  <p className="text-sm text-gray-600">人數: {course.persons}</p>
                  <p className="text-sm text-gray-600">老師: {course.teacher}</p>
                  <p className="text-sm text-gray-600">
                    年級: {gradeMapping[course.grade] || "未知年級"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListsbysupadmin;