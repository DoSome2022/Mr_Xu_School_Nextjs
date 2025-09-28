

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApplyData {
  id: string;
  username: string;
  apply: boolean;
  isapply: boolean;
  createdata: string;
  student: {
    Parent_data: {
      phone: string;
    };
  };
}

const TipsLists: React.FC = () => {
  const [getApplyData, setGetApplyData] = useState<ApplyData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplyData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/Apply_Lists", {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("無法獲取數據");
        }
        const result = await res.json();
        setGetApplyData(result);
      } catch (error) {
        console.error("獲取申請數據失敗:", error);
        setError(error instanceof Error ? error.message : "發生未知錯誤");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplyData();
  }, []);

  // 篩選資料
  const filteredData = selectedDate
    ? getApplyData.filter(
        (d) =>
          d.apply &&
          d.isapply &&
          new Date(d.createdata).toLocaleDateString("zh-TW") ===
            new Date(selectedDate).toLocaleDateString("zh-TW")
      )
    : getApplyData.filter((d) => d.apply && d.isapply);

  // 導出為 TXT 文件
  const handleExport = () => {
    const dataToExport = filteredData
      .map((d) => {
        const date = new Date(d.createdata).toLocaleDateString("zh-TW");
        return `姓名: ${d.username}\n電話: ${d.student.Parent_data.phone}\n日子: ${date}`;
      })
      .join("\n\n");

    const blob = new Blob([dataToExport], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `申請資料_${selectedDate || "全部"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-red-500 font-medium">錯誤: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <span className="text-[#e7915b] animate-pulse">載入申請資料中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#e7915b] mb-6">申請列表</h1>

            {/* 篩選和導出區域 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center">
                <label htmlFor="date-filter" className="mr-2 text-gray-700">
                  篩選日期：
                </label>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48 border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                />
                {selectedDate && (
                  <Button
                    variant="outline"
                    className="ml-2 border-[#e7915b] text-[#e7915b] hover:bg-[#e7915b] hover:text-white"
                    onClick={() => setSelectedDate("")}
                  >
                    清除
                  </Button>
                )}
              </div>

              <Button 
                onClick={handleExport}
                className="bg-[#e7915b] hover:bg-[#d9824c] text-white"
              >
                導出 TXT
              </Button>
            </div>

            {/* 表格顯示 */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#e7915b] text-white">
                    <th className="p-3 text-left">姓名</th>
                    <th className="p-3 text-left">電話</th>
                    <th className="p-3 text-left">日期</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((d) => (
                      <tr key={d.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3">{d.username}</td>
                        <td className="p-3">{d.student.Parent_data.phone}</td>
                        <td className="p-3">
                          {new Date(d.createdata).toLocaleDateString("zh-TW")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        無符合條件的資料
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsLists;