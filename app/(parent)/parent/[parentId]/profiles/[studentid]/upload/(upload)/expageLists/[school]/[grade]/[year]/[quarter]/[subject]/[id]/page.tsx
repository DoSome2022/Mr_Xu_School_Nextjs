"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface ExPageListsByIDData {
  id: string;
  school: string;
  grade: number;
  year: string;
  quarter: number;
  img: string;
  name: string;
}

const ExPageListsByID = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
    id: string;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const SchoolName = params?.school as string;
  const Grade = params?.grade as string;
  const Year = params?.year as string;
  const Quarter = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";
  const Id = params?.id as string;

  // 驗證路由參數
  if (!ParentID || !StudentID || !SchoolName || !Year || !Grade || !Quarter || !SubjectId || !Id) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [ExPageListsDetailByID, setExPageListsDetailByID] = useState<ExPageListsByIDData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Id) {
      const getstudentexpaperdetailbyid = async (id: string) => {
        try {
          const res = await fetch(`/api/Parents_Student/Parents_Student_ExPage_by_id_Lists/${id}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error(`無法連線：${res.statusText}`);
          }
          const result = await res.json();
          if (!Array.isArray(result)) {
            throw new Error("無效的資料格式");
          }
          // 確保 img 使用 HTTPS
          const sanitizedResult = result.map((item: ExPageListsByIDData) => ({
            ...item,
            img: item.img.replace(/^http:/, "https:"),
          }));
          setExPageListsDetailByID(sanitizedResult);
        } catch (error) {
          console.error("獲取試卷詳情失敗:", error);
          setError("無法載入試卷詳情，請稍後重試");
          toast.error("無法載入試卷詳情，請稍後重試");
        }
      };
      getstudentexpaperdetailbyid(Id);
    }
  }, [Id]);

  // 檢查是否為圖片格式的輔助函數
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("params:", params);
    console.log("ExPageListsDetailByID:", ExPageListsDetailByID, "-- END --");
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* 麵包屑導航，採用 navbar 風格 */}
      <nav className="flex items-center justify-between bg-gray-900 p-4 shadow-md">
        <div className="flex flex-row gap-6">
          <Link
            href={`/parent/${ParentID}`}
            prefetch={false} // 禁用預取以避免 404
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            苜頁
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            學生資料
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/expageLists`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            試卷列表
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${encodeURIComponent(SubjectId)}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            {SchoolName} {Year} {Grade} 第{Quarter}季 {SubjectId}
          </Link>
          <span className="text-white text-lg font-medium">試卷詳情</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          試卷詳情 - {SchoolName} {Year} {Grade} 第{Quarter}季 {SubjectId}
        </h2>

        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          {error ? (
            <div className="text-red-400 p-4 rounded-lg bg-red-900 bg-opacity-20">
              {error}
            </div>
          ) : ExPageListsDetailByID.length === 0 ? (
            <div className="text-gray-300 p-4">無試卷詳情資料</div>
          ) : (
            ExPageListsDetailByID.map((d) => (
              <div key={d.id} className="space-y-4">
                <h3 className="text-xl font-medium text-white">{d.name}</h3>
                <div className="text-gray-300 space-y-1">
                  <p>學校：{d.school}</p>
                  <p>學年：{d.year}</p>
                  <p>年級：{d.grade}</p>
                  <p>季度：第{d.quarter}季</p>
                </div>
                {isImage(d.img) ? (
                  <div className="relative w-full max-w-md">
                    <Image
                      src={d.img.replace(/^http:/, "https:")}
                      width={500}
                      height={500}
                      alt={d.name}
                      className="rounded-lg object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <a
                      href={d.img.replace(/^http:/, "https:")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
                    >
                      查看 PDF 文件
                    </a>
                    <a
                      href={d.img.replace(/^http:/, "https:")}
                      download={d.name + ".pdf"}
                      className="text-white text-lg font-medium bg-blue-600 hover:bg-blue-500 transition-colors duration-200 px-4 py-2 rounded-lg"
                      onClick={() => toast.success("文件下載已啟動")}
                    >
                      下載 PDF 文件
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExPageListsByID;