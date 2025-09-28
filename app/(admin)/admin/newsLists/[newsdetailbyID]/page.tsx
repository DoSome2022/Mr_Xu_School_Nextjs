"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import NewsDetailLists from "@/components/DatasLIsts/NewsDatasLists";

// 定義 News 介面，與 Prisma 的 News 模型匹配
interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

const NewDetail = () => {
  const params = useParams();
  const newsId = params?.newsdetailbyID as string;

  // 指定 GetNewsDataById 的類型為 News[] | null
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
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
          if (!res.ok) {
            throw new Error("無法載入公告資料");
          }
          const result: News[] = await res.json(); // 明確指定返回類型為陣列
          setGetNewsDataById(result);
        } catch (err: any) {
          console.error("載入錯誤:", err);
          setError(err.message || "無法載入公告資料");
        } finally {
          setLoading(false);
        }
      };
      fetchNewsDetail(newsId);
    } else {
      setError("無效的公告ID");
      setLoading(false);
    }
  }, [newsId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !GetNewsDataById || GetNewsDataById.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無公告資料"}</p>
      </div>
    );
  }

  console.log("NewDetail GetNewsDataById:", GetNewsDataById);

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">公告詳情</h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/newsLists/${newsId}/edit`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              更改公告
            </Link>
            <Link
              href="/admin/newsLists"
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回公告列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <NewsDetailLists data={GetNewsDataById[0]} /> {/* 傳遞陣列的第一個元素 */}
        </div>
      </div>
    </div>
  );
};

export default NewDetail;