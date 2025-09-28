"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";

// 定義 School 介面，與 API 返回的數據結構匹配
interface School {
  id: string;
  school_name: string;
  createAt: string;
  updatedAt: string;
}

const SchoolLists = () => {
  // 為 GetSchoolsData 和 searchResults 指定類型
  const [GetSchoolsData, setGetSchoolsData] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<School[]>([]);
  const [searchField, setSearchField] = useState("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 拿學校 data
  useEffect(() => {
    const fetchSchoolsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/School_Lists", {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("無法載入學校資料");
        }
        const result: School[] = await res.json(); // 明確指定返回類型
        setGetSchoolsData(result);
      } catch (err: any) {
        console.error("載入錯誤:", err);
        setError(err.message || "無法載入學校資料");
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolsData();
  }, []);

  // 修正 handleSearch 的 catch 塊
  const handleSearch = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // 防止按鈕觸發表單提交（如果在表單中）
    try {
      const response = await fetch(
        `/api/School_Lists_search?query=${encodeURIComponent(searchQuery)}&field=${searchField}`
      );
      if (!response.ok) {
        throw new Error("搜尋失敗");
      }
      const data: School[] = await response.json(); // 明確指定返回類型
      setSearchResults(data);
    } catch (err: any) { // 添加 err 變數
      console.error("搜尋失敗:", err);
      setError(err.message || "搜尋失敗，請稍後重試");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">學校列表</h1>
          <Link
            href="/admin/schoolLists/createSchool"
            className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            建立學校
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">搜尋學校</h2>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="輸入搜尋內容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
              />
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="border-gray-300 rounded-md p-2 focus:border-[#80A8BD] focus:ring-[#80A8BD] transition-colors duration-300"
              >
                <option value="all">所有字段</option>
                <option value="school_name">學校名稱</option>
              </select>
              <Button
                onClick={handleSearch}
                className="bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
              >
                搜尋
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">搜尋結果</h3>
              <div className="space-y-4">
                {searchResults.map((s) => (
                  <Link
                    key={s.id}
                    href={`/admin/schoolLists/${s.id}`}
                    className="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-300"
                  >
                    <h4 className="text-gray-800 font-medium">{s.school_name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">所有學校</h2>
          {GetSchoolsData.length > 0 ? (
            <div className="space-y-4">
              {GetSchoolsData.map((data) => (
                <Link
                  key={data.id}
                  href={`/admin/schoolLists/${data.id}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-300"
                >
                  <h4 className="text-gray-800 font-medium">{data.school_name}</h4>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暫無學校資料</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolLists;