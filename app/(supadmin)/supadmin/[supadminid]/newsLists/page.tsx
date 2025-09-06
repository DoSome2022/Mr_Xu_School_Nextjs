"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewsData {
  id: string;
  title: string;
  content: string;
  date: string;
}

const NewsListsbysupadmin: React.FC = () => {
  const params = useParams();
  const supadminid = params?.supadminid as string;
  const [GetNewsData, setGetNewsData] = useState<NewsData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<NewsData[]>([]);
  const [searchField, setSearchField] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/News_Lists");
        if (!res.ok) {
          throw new Error("無法獲取公告列表數據");
        }
        const result = await res.json();
        setGetNewsData(result);
      } catch (error: any) {
        console.error("獲取公告數據失敗:", error);
        setError("無法載入公告列表");
      } finally {
        setIsLoading(false);
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
      const data = await response.json();
      setSearchResults(data);
    } catch (error: any) {
      console.error("搜尋失敗:", error);
      setError("無法執行搜尋");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-medium">正在載入...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600">公告列表</h1>
          <Link
            href={`/supadmin/${supadminid}/newsLists/createNews`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
          >
            建立公告
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Input
              type="text"
              placeholder="輸入搜尋內容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200"
            />
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="border-gray-300 rounded-md focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200 text-sm"
            >
              <option value="all">所有欄位</option>
              <option value="title">標題</option>
              <option value="content">內容</option>
              <option value="date">日期</option>
            </select>
            <Button
              onClick={handleSearch}
              className="bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
            >
              搜尋
            </Button>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {searchResults.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">搜尋結果</h2>
              <div className="space-y-4">
                {searchResults.map((N) => (
                  <div
                    key={N.id}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <Link
                      href={`/supadmin/${supadminid}/newsLists/${N.id}`}
                      className="text-blue-600 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-semibold">標題: {N.title}</span>
                        <span className="sm:ml-4 mt-2 sm:mt-0">日期: {N.date}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{N.content}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : GetNewsData.length === 0 ? (
            <p className="text-gray-500 text-sm font-medium">
              正在載入數據或無公告記錄...
            </p>
          ) : (
            <div className="space-y-4">
              {GetNewsData.map((data) => (
                <div
                  key={data.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <Link
                    href={`/supadmin/${supadminid}/newsLists/${data.id}`}
                    className="text-blue-600 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-semibold">標題: {data.title}</span>
                      <span className="sm:ml-4 mt-2 sm:mt-0">日期: {data.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{data.content}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsListsbysupadmin;