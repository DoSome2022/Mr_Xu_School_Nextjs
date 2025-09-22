"use client";

import { useParams } from "next/navigation";

const SupAdminPage = () => {
  const params = useParams();
  const { supadminid } = params;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 主要內容容器，與導航欄的 container 一致 */}
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域，與導航欄的字體和配色對齊 */}
        <h1 className="text-3xl font-semibold text-blue-600 mb-4">
          主理員主頁
        </h1>
        {/* 內容區域，與導航欄的文字樣式一致 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-gray-700 text-sm font-medium">
            管理員 ID: {supadminid || "載入中..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupAdminPage;