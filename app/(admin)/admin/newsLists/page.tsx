"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";

// 定義 News 介面，與 Prisma 的 News 模型匹配
interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  createAt: string; // DateTime 在前端通常為 ISO 字符串
  updatedAt: string;
}

const NewsLists = () => {
  // 指定 GetNewsData 和 searchResults 的類型為 News[]
  const [GetNewsData, setGetNewsData] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<News[]>([]);
  const [searchField, setSearchField] = useState("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/News_Lists");
        if (!res.ok) {
          throw new Error("無法載入公告資料");
        }
        const result: News[] = await res.json(); // 明確指定返回類型
        setGetNewsData(result);
      } catch (err: any) {
        console.error("載入錯誤:", err);
        setError(err.message || "無法載入公告資料");
      } finally {
        setLoading(false);
      }
    };
    fetchNewsData();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/News_Lists_search?query=${encodeURIComponent(searchQuery)}&field=${searchField}`
      );
      if (!response.ok) {
        throw new Error("搜尋失敗");
      }
      const data: News[] = await response.json(); // 明確指定返回類型
      setSearchResults(data);
    } catch (err: any) {
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
          <h1 className="text-3xl font-bold text-[#80A8BD]">公告列表</h1>
          <Link
            href="/admin/newsLists/createNews"
            className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            建立公告
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">搜尋公告</h2>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="輸入搜索內容..."
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
                <option value="title">標題</option>
                <option value="content">內容</option>
                <option value="date">日期</option>
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
                {searchResults.map((news) => (
                  <Link
                    key={news.id}
                    href={`/admin/newsLists/${news.id}`}
                    className="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-300"
                  >
                    <h4 className="text-gray-800 font-medium">{news.title}</h4>
                    <p className="text-gray-600 text-sm">{news.content}</p>
                    <p className="text-gray-500 text-sm">日期: {news.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">所有公告</h2>
          {GetNewsData.length > 0 ? (
            <div className="space-y-4">
              {GetNewsData.map((news) => (
                <Link
                  key={news.id}
                  href={`/admin/newsLists/${news.id}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-300"
                >
                  <h4 className="text-gray-800 font-medium">{news.title}</h4>
                  <p className="text-gray-600 text-sm">{news.content}</p>
                  <p className="text-gray-500 text-sm">日期: {news.date}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暫無公告資料</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsLists;