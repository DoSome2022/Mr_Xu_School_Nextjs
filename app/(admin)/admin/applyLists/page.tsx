"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ApplyData {
  id: string;
  title: string;
  apply: boolean;
  isapply: boolean;
  course_id: string;
}

const ApplyLists = () => {
  const [GetApplyData, setGetApplyData] = useState<ApplyData[]>([]);

  useEffect(() => {
    const fetchApplyData = async () => {
      try {
        const res = await fetch("/api/Apply_Lists");
        if (!res.ok) {
          throw new Error("無法連線！");
        }
        const result = await res.json();
        setGetApplyData(result);
      } catch (error) {
        console.error("獲取申請數據失敗:", error);
      }
    };
    fetchApplyData();
  }, []);

  console.log(" -- ApplyLists -- : ", GetApplyData, " -- end -- ");

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#80A8BD] mb-6">申請列表</h1>
        <div className="grid gap-6">
          {GetApplyData.length === 0 ? (
            <p className="text-gray-600">暫無申請數據</p>
          ) : (
            GetApplyData.map((d) => (
              <div
                key={d.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Link
                  href={`/admin/applyLists/${d.id}`}
                  className="text-xl text-[#80A8BD] font-semibold hover:text-cyan-200 transition-colors duration-300"
                >
                  {d.title}
                </Link>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-700">
                    申請處理狀況: <span className={d.isapply ? "text-green-600" : "text-red-600"}>
                      {d.isapply ? "已處理" : "處理中"}
                    </span>
                  </p>
                  {/* 僅當 isapply 為 true 時顯示申請狀況 */}
                  {d.isapply && (
                    <p className="text-gray-700">
                      申請狀況: <span className={d.apply ? "text-green-600" : "text-red-600"}>
                        {d.apply ? "批準" : "不批準"}
                      </span>
                    </p>
                  )}
                  <Link
                    href={`/admin/courseLists/${d.course_id}`}
                    className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                  >
                    前往課程
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyLists;