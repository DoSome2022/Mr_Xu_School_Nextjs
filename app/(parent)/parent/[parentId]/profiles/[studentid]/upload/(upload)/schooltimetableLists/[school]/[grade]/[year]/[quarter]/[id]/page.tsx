"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

interface SchoolTimeTableByID {
  id: string;
  name: string;
  year: string;
  grade: number;
  quarter: number;
  school: string;
  img: string; // 直接使用 img 欄位，匹配 API 回傳數據
}

const SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    id: string;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const SchoolName = params?.school as string;
  const Grade = params?.grade as string;
  const Year = params?.year as string;
  const Quarter = params?.quarter as string;
  const Id = params?.id as string;

  // 驗證路由參數
  if (!ParentID || !StudentID || !SchoolName || !Grade || !Year || !Quarter || !Id) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentSchoolTimeTableDetailByID, setGetStudentSchoolTimeTableDetailByID] = useState<
    SchoolTimeTableByID[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Id) {
      const getstudentschooltimetabledetailbyid = async (id: string) => {
        try {
          const res = await fetch(`/api/Parents_Student/Parents_Student_SchoolTimeTable_by_id_Lists/${id}`, {
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
          // 驗證 img 是否為有效的 Base64 PDF 数据 URI
          const sanitizedResult = result.map((item: SchoolTimeTableByID) => ({
            ...item,
            img: item.img.startsWith("data:application/pdf;base64,") ? item.img : "",
          }));
          setGetStudentSchoolTimeTableDetailByID(sanitizedResult);
        } catch (error) {
          console.error("獲取課表詳情失敗:", error);
          setError("無法載入課表詳情，請稍後重試");
          toast.error("無法載入課表詳情，請稍後重試");
        }
      };
      getstudentschooltimetabledetailbyid(Id);
    }
  }, [Id]);

  // 檢查是否為圖片格式的輔助函數
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  // 檢查是否為 Base64 PDF 数据 URI
  const isBase64PDF = (data: string) => {
    return data.startsWith("data:application/pdf;base64,");
  };

  // 生成 Base64 PDF 的臨時下載連結
  const createDownloadLink = (base64Data: string, fileName: string) => {
    const byteCharacters = atob(base64Data.replace("data:application/pdf;base64,", ""));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  };

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("params:", params);
    console.log("GetStudentSchoolTimeTableDetailByID:", GetStudentSchoolTimeTableDetailByID, "-- END --");
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* 麵包屑導航，採用 navbar 風格 */}
      <nav className="flex items-center justify-between bg-gray-900 p-4 shadow-md">
        <div className="flex flex-row gap-6">
          <Link
            href={`/parent/${ParentID}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            苜頁
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            學生資料
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/schooltimetableLists`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            課表列表
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/schooltimetableLists/${SchoolName}/${Grade}/${Year}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            {SchoolName} {Grade} {Year}
          </Link>
          <span className="text-white text-lg font-medium">課表詳情</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          課表詳情 - {SchoolName} {Year} {Grade} 第{Quarter}季
        </h2>

        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          {error ? (
            <div className="text-red-400 p-4 rounded-lg bg-red-900 bg-opacity-20">
              {error}
            </div>
          ) : GetStudentSchoolTimeTableDetailByID.length === 0 ? (
            <div className="text-gray-300 p-4">無課表詳情資料</div>
          ) : (
            GetStudentSchoolTimeTableDetailByID.map((d) => (
              <div key={d.id} className="space-y-4">
                <h3 className="text-xl font-medium text-white">{d.name}</h3>
                <div className="text-gray-300 space-y-1">
                  <p>學校：{d.school}</p>
                  <p>學年：{d.year}</p>
                  <p>年級：{d.grade}</p>
                  <p>季度：第{d.quarter}季</p>
                </div>
                {d.img && isBase64PDF(d.img) ? (
                  <div className="flex flex-col space-y-2">
                    <a
                      href={createDownloadLink(d.img, d.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
                    >
                      查看 PDF 文件
                    </a>
                    <a
                      href={createDownloadLink(d.img, d.name)}
                      download={d.name + ".pdf"}
                      className="text-white text-lg font-medium bg-blue-600 hover:bg-blue-500 transition-colors duration-200 px-4 py-2 rounded-lg"
                      onClick={() => toast.success("文件下載已啟動")}
                    >
                      下載 PDF 文件
                    </a>
                  </div>
                ) : isImage(d.img) ? (
                  <div className="relative w-full max-w-md">
                    <Image
                      src={d.img}
                      width={500}
                      height={500}
                      alt={d.name}
                      className="rounded-lg object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-gray-300">無可用文件</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID;