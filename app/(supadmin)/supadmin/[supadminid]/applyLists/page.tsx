"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ApplyData {
  id: string;
  title: string;
  apply: boolean;
  course_id: string;
}

const ApplyListsbysupadmin = () => {
  const [GetApplyData, setGetApplyData] = useState<ApplyData[]>([]);
  const params = useParams();
  const supadminid = params?.supadminid as string;

  useEffect(() => {
    const fetchApplyData = async () => {
      try {
        const res = await fetch("/api/Apply_Lists");
        if (!res.ok) {
          throw new Error("無法獲取申請列表數據！");
        }
        const result = await res.json();
        setGetApplyData(result);
      } catch (error) {
        console.error("獲取數據失敗:", error);
      }
    };
    fetchApplyData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 主要內容容器，與導航欄和 SupAdminPage 的 container 一致 */}
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域，與 SupAdminPage 的標題樣式對齊 */}
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">
          申請列表
        </h1>
        {/* 申請列表容器 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          {GetApplyData.length === 0 ? (
            <p className="text-gray-500 text-sm font-medium">
              正在載入數據或無申請記錄...
            </p>
          ) : (
            <div className="space-y-4">
              {GetApplyData.map((d) => (
                <div
                  key={d.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    {/* 申請標題和鏈接 */}
                    <Link
                      href={`/supadmin/${supadminid}/applyLists/${d.id}`}
                      className="text-blue-600 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                    >
                      標題: {d.title}
                    </Link>
                    {/* 課程鏈接 */}
                    <Link
                      href={`/supadmin/${supadminid}/courseLists/${d.course_id}`}
                      className="text-blue-600 hover:text-blue-400 transition-colors duration-200 text-sm font-medium sm:ml-4 mt-2 sm:mt-0"
                    >
                      前往課程
                    </Link>
                  </div>
                  {/* 申請狀況 */}
                  <p className="text-gray-700 text-sm mt-2">
                    申請狀況: {d.apply ? "批準" : "不批準"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyListsbysupadmin;