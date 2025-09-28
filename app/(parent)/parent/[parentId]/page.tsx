"use client";

import { useEffect, useState } from "react";

const ParentByID = () => {
  const [GetNews, setGetNews] = useState([]);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const res = await fetch('/api/News_Lists', {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("無法連線！");
        }
        const result = await res.json();
        setGetNews(result);
      } catch (error) {
        console.error("獲取公告失敗:", error);
      }
    };
    fetchNewsData();
  }, []);

  console.log("GetNews:", GetNews);

  return (
    <div className="container mx-auto h-full w-full bg-[#80A8BD] p-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        <div className="col-span-3"></div>

        <div className="col-span-2 bg-[#80A8BD] p-6 rounded-lg shadow-md">
          <h2 className="text-white text-xl font-semibold mb-4">公告</h2>
          {GetNews.length === 0 ? (
            <p className="text-gray-400">正在載入公告...</p>
          ) : (
            GetNews.map((d: any, index: number) => (
              <div
                key={index}
                className="bg-[#80A8BD] p-5 rounded-md shadow-sm mb-4 hover:bg-gray-600 transition-colors duration-200"
              >
                <h3 className="text-white text-lg font-medium">{d.title}</h3>
                <p className="text-gray-300 mt-2">{d.content}</p>
                <p className="text-gray-400 text-sm mt-2">{d.date}</p>
              </div>
            ))
          )}
        </div>
        <div className="col-span-3 flex flex-col sm:flex-row justify-between text-sm text-gray-400 mt-6">
          <p>九龍九龍灣宏光道80號麗晶花園商場1樓105號舖</p>
          <p>Whatsapp: 59190844</p>
          <p>info@target.edu.hk</p>
        </div>
      </div>
    </div>
  );
};

export default ParentByID;