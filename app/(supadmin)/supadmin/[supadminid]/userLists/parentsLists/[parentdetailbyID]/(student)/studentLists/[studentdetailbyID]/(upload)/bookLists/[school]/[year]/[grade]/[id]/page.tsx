"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";

// 配置 PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.min.js`;

interface StudentDetailData {
  id: string;
  name: string;
  img: string;
  school: string;
  grade: number;
  year: string;
  student_name: string;
  student_booklist_id: string;
  createdAt: string;
  updatedAt: string;
}

const Student_BookLists_School_Year_Grade_Id_Detailbysupadmin = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    year: string;
    grade: string;
    id: string;
    supadminid: string;
  }>();
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Year = params?.year;
  const Grade = params?.grade;
  const id = params?.id;
  const supadminId = params?.supadminid;

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Year || !Grade || !id) {
    return (
      <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg">
        <svg
          className="h-5 w-5 text-red-500 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentBookListsDetailByID, setGetStudentBookListsDetailByID] = useState<StudentDetailData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 檢查是否為圖片格式
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png)$/i.test(url) && !url.startsWith("data:");
  };

  // 確保 URL 使用 HTTPS
  const getSecureUrl = (img: string) => {
    if (!img) return "";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://billy.ad";
    const url = img.startsWith("/") ? `${baseUrl}${img}` : img;
    return url.replace("http://", "https://");
  };

  // 下載功能
  const handleDownload = async (imgUrl: string, fileName: string) => {
    if (!imgUrl) {
      const errorMessage = "缺少文件 URL";
      console.error("下載失敗:", errorMessage);
      toast.error(errorMessage);
      return;
    }
    try {
      const secureUrl = getSecureUrl(imgUrl);
      const encodedFileName = encodeURIComponent(fileName);
      if (process.env.NODE_ENV === "development") {
        console.log("下載 URL:", secureUrl);
        console.log("下載文件名:", fileName);
      }
      const response = await fetch(`/api/proxy-image?file=${encodeURIComponent(secureUrl)}&filename=${encodedFileName}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || response.statusText || "無法下載文件";
        throw new Error(`無法下載文件: ${errorMessage}`);
      }
      const blob = await response.blob();
      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName.replace(/\s+/g, "_"); // 避免空格問題
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "下載文件失敗，請稍後再試";
      console.error("下載失敗:", errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const getstudentbooklistsdetailbyid = async (studentId: string, bookId: string) => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/student/Student_Booklist_by_id_Lists_by_id/${studentId}/${bookId}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
        if (!Array.isArray(result)) {
          throw new Error("無效的書單詳情格式");
        }
        setGetStudentBookListsDetailByID(result);
      } catch (err: any) {
        const errorMessage = err.message || "無法獲取書單詳情";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (StudentID && id) {
      getstudentbooklistsdetailbyid(StudentID, id);
    }
  }, [StudentID, id]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("Params:", params);
    console.log("GetStudentBookListsDetailByID:", GetStudentBookListsDetailByID);
    console.log(
      "Filtered Details:",
      GetStudentBookListsDetailByID.filter(
        (d) => d.school === SchoolName && d.year === Year && d.grade === Number(Grade) && d.id === id
      )
    );
  }

  // 過濾書單詳情
  const filteredDetails = GetStudentBookListsDetailByID.filter(
    (d) => d.school === SchoolName && d.year === Year && d.grade === Number(Grade) && d.id === id
  );

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminId}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminId}/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生資料
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          書單
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${encodeURIComponent(SchoolName)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Year)}/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          年級 {Grade}
        </Link>
        <span className="mx-2">/</span>
        <span>書單詳情</span>
      </nav>

      <h2 className="text-2xl font-semibold text-[#80A8BD] mb-4">
        {SchoolName} {Year} 年級 {Grade} 書單詳情
      </h2>

      {isLoading && (
        <div className="text-gray-600 p-4 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
          <p className="mt-4">資料載入中...</p>
        </div>
      )}
      {error && (
        <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          <svg
            className="h-5 w-5 text-red-500 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {filteredDetails.length > 0 ? (
        <div className="space-y-4">
          {filteredDetails.map((d) => (
            <div
              key={d.id}
              className="border border-[#80A8BD] rounded p-4 bg-white shadow-sm"
            >
              <p className="text-lg font-medium text-[#80A8BD]">{d.name}</p>
              <p className="text-sm text-gray-600">學生: {d.student_name}</p>
              <p className="text-sm text-gray-600">學校: {d.school}</p>
              <p className="text-sm text-gray-600">年份: {d.year}</p>
              <p className="text-sm text-gray-600">年級: {d.grade}</p>
              <p className="text-sm text-gray-600">創建時間: {new Date(d.createdAt).toLocaleString()}</p>
              <p className="text-sm text-gray-600">更新時間: {new Date(d.updatedAt).toLocaleString()}</p>
              <div className="mt-4">
                {d.img && d.img.endsWith(".pdf") ? (
                  <div>
                    <Document
                      file={getSecureUrl(d.img)}
                      onLoadError={(error) => {
                        console.error("PDF 載入失敗:", error);
                        toast.error("無法載入 PDF 文件，請檢查文件格式或網絡連線");
                      }}
                    >
                      <Page pageNumber={1} width={500} className="rounded-md shadow-sm" />
                    </Document>
                  </div>
                ) : d.img ? (
                  <Image
                    width={500}
                    height={500}
                    src={getSecureUrl(d.img)}
                    alt={d.name || "書單圖片"}
                    className="rounded-md object-contain max-w-full h-auto"
                    priority
                  />
                ) : (
                  <p className="text-gray-500">無文件可顯示</p>
                )}
              </div>
              {d.img && (
                <button
                  onClick={() =>
                    handleDownload(
                      d.img,
                      `${d.name}${d.img.endsWith(".pdf") ? ".pdf" : `.${d.img.split(".").pop()?.toLowerCase() || "jpg"}`}`
                    )
                  }
                  className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                >
                  下載文件
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          無符合條件的書單詳情 (School: {SchoolName}, Year: {Year}, Grade: {Grade}, ID: {id})
        </p>
      )}
    </div>
  );
};

export default Student_BookLists_School_Year_Grade_Id_Detailbysupadmin;