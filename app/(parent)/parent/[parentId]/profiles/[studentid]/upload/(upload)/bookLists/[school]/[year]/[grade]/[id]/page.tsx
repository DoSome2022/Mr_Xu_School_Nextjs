"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface BookListsDataById {
  id: string;
  name: string;
  year: string;
  grade: number;
  school: string;
  img: string;
  student_name: string;
  student_booklist_id: string;
  createdAt: string;
  updatedAt: string;
}

const Student_BookLists_School_Year_Grade_Id_Detail = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    school: string;
    year: string;
    grade: string;
    id: string;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const SchoolName = params?.school as string;
  const Year = params?.year as string;
  const Grade = params?.grade as string;
  const Id = params?.id as string;

  // 驗證路由參數
  if (!ParentID || !StudentID || !SchoolName || !Year || !Grade || !Id) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentBookListsDetailByID, setGetStudentBookListsDetailByID] = useState<BookListsDataById[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Id) {
      const getstudentbooklistsdetailbyid = async (Id: string) => {
        try {
          const res = await fetch(`/api/Parents_Student/Parents_Student_Booklist_by_id_Lists/${Id}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error(`無法連線：${res.statusText}`);
          }
          const result = await res.json();
          // 確保 img 使用 HTTPS
          const sanitizedResult = result.map((item: BookListsDataById) => ({
            ...item,
            img: item.img.replace(/^http:/, "https:"),
          }));
          setGetStudentBookListsDetailByID(sanitizedResult);
        } catch (error) {
          console.error("獲取書單詳情失敗:", error);
          setError("無法載入書單詳情，請稍後重試");
          toast.error("無法載入書單詳情，請稍後重試");
        }
      };
      getstudentbooklistsdetailbyid(Id);
    }
  }, [Id]);

  // 檢查是否為圖片格式的輔助函數
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  // 下載 PDF 的函數
  const handleDownload = async (url: string, fileName: string) => {
    try {
      // 強制使用 HTTPS
      const secureUrl = url.replace(/^http:/, "https:");
      const response = await fetch(secureUrl, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error("無法下載文件");
      }
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || "download.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      toast.success("文件下載成功");
    } catch (error) {
      console.error("下載失敗:", error);
      toast.error("下載文件失敗，請檢查文件路徑或稍後重試");
    }
  };

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("params:", params);
    console.log("GetStudentBookListsDetailByID:", GetStudentBookListsDetailByID, "-- END --");
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* 麵包屑導航，採用 navbar 風格 */}
      <nav className="flex items-center justify-between bg-gray-900 p-4 shadow-md">
        <div className="flex flex-row gap-6">
          <Link
            href={`/parent/${ParentID}`}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            苜頁
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}`}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            學生資料
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/bookLists`}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            書單列表
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/bookLists/${SchoolName}/${Year}/${Grade}`}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            {SchoolName} {Year} {Grade}
          </Link>
          <span className="text-white text-lg font-medium">詳情</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          書單詳情 - {SchoolName} {Year} {Grade}
        </h2>

        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          {error ? (
            <div className="text-red-400 p-4">{error}</div>
          ) : GetStudentBookListsDetailByID.length === 0 ? (
            <div className="text-gray-300 p-4">無書單詳情資料</div>
          ) : (
            GetStudentBookListsDetailByID.map((d) => (
              <div key={d.id} className="space-y-4">
                <h3 className="text-xl font-medium text-white">{d.name}</h3>
                <div className="text-gray-300">
                  <p>學生姓名：{d.student_name}</p>
                  <p>學校：{d.school}</p>
                  <p>學年：{d.year}</p>
                  <p>年級：{d.grade}</p>
                  <p>創建時間：{new Date(d.createdAt).toLocaleString()}</p>
                </div>
                {isImage(d.img) ? (
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
                  <div className="flex flex-col space-y-2">
                    <a
                      href={d.img.replace(/^http:/, "https:")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
                    >
                      查看 PDF 文件
                    </a>
                    <button
                      onClick={() => handleDownload(d.img, d.name + ".pdf")}
                      className="text-white text-lg font-medium bg-blue-600 hover:bg-blue-500 transition-colors duration-200 px-4 py-2 rounded-lg"
                    >
                      下載 PDF 文件
                    </button>
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

export default Student_BookLists_School_Year_Grade_Id_Detail;