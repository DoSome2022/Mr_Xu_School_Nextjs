// pages/supadmin/[supadminid]/newsLists/[newsdetailbyID]/index.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import NewsDetailLists from "@/components/DatasLIsts/NewsDatasLists";

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

const NewDetailbysupadmin = () => {
  const params = useParams();
  const newsId = params?.newsdetailbyID as string; // 改進命名
  const supadminId = params?.supadminid as string;

  console.log("params:", { supadminId, newsId }, "-- End --");

  const [GetNewsDataById, setGetNewsDataById] = useState<News[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (newsId) {
      const fetchNewsDetail = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/News_detail_data_by_id/${id}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error("無法獲取新聞數據");
          }
          const result = await res.json();
          setGetNewsDataById(result);
        } catch (error: any) {
          console.error("獲取新聞數據失敗:", error);
          setError("無法載入新聞數據");
        } finally {
          setLoading(false);
        }
      };
      fetchNewsDetail(newsId);
    } else {
      setError("無效的新聞ID");
      setLoading(false);
    }
  }, [newsId]);

  console.log("GetNewsDataById:", GetNewsDataById, "-- End --");

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

  if (!GetNewsDataById || GetNewsDataById.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600">無新聞數據</p>
      </div>
    );
  }

  const newsData = GetNewsDataById[0]; // 提取第一個新聞物件

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <nav className="bg-[#e7915b] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">新聞詳情</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`/supadmin/${supadminId}/newsLists`}
                className="text-white hover:bg-cyan-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                返回新聞列表
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-[#e7915b] mb-6">{newsData.title}</h2>
          <NewsDetailLists data={newsData} />
          <div className="mt-6">
            <Link
              href={`/supadmin/${supadminId}/newsLists/${newsId}/edit`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              更改
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDetailbysupadmin;