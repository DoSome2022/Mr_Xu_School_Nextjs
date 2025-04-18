"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // 假設你使用 shadcn/ui 的 Button
import { Input } from "@/components/ui/input"; // 假設你使用 shadcn/ui 的 Input

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

const TipsLists = () => {
  const [getApplyData, setGetApplyData] = useState<ApplyData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const fetchApplyData = async () => {
      try {
        const res = await fetch("/api/Apply_Lists");
        if (!res.ok) {
          throw new Error("無法獲取數據");
        }
        const result = await res.json();
        setGetApplyData(result);
      } catch (error) {
        console.error("獲取申請數據失敗:", error);
      }
    };
    fetchApplyData();
  }, []);

  console.log("getApplyData : ", getApplyData);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">申請列表</h1>

      {/* 日期篩選 */}
      <div className="mb-4">
        <label htmlFor="date-filter" className="mr-2">
          篩選日期：
        </label>
        <Input
          id="date-filter"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-48"
        />
        {selectedDate && (
          <Button
            variant="outline"
            className="ml-2"
            onClick={() => setSelectedDate("")}
          >
            清除篩選
          </Button>
        )}
      </div>

      {/* 導出按鈕 */}
      <Button onClick={handleExport} className="mb-4">
        輸出
      </Button>

      {/* 表格顯示 */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">姓名</th>
            <th className="border border-gray-300 p-2 text-left">電話</th>
            <th className="border border-gray-300 p-2 text-left">日子</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((d) => (
              <tr key={d.id}>
                <td className="border border-gray-300 p-2">{d.username}</td>
                <td className="border border-gray-300 p-2">
                  {d.student.Parent_data.phone}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(d.createdata).toLocaleDateString("zh-TW")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border border-gray-300 p-2 text-center">
                無符合條件的資料
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TipsLists;