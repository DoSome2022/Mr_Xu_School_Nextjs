"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface StudentDatailData {
  name: string;
  img: string;
  school: string;
  grade: number;
  year: string;
  quarter: number;
  subject: string;
  id: string;
}

const subjectMapping: { [key: string]: string } = {
  math: "數學",
  english: "英語",
  science: "科學",
  chinese: "國語",
  中: "國語",
};

const quarterMapping: { [key: string]: string } = {
  "1": "第一季度",
  "2": "第二季度",
  "3": "第三季度",
  "4": "第四季度",
};

const ExPageLists_Grade_Year_Quarter_Subject_Lists_By_IDbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
    id: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Year = params?.year ? decodeURIComponent(params.year) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";
  const id = params?.id;

  const [GetStudentExPaperDetailByID, setGetStudentExPaperDetailByID] = useState<StudentDatailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);

  // 檢查文件類型
  const determineFileType = (img: string | undefined | null): "image" | "pdf" | null => {
    if (!img) {
      console.error("img is undefined or null");
      return null;
    }
    if (img.includes(".pdf") || img.startsWith("data:application/pdf")) {
      return "pdf";
    }
    if (img.match(/\.(jpg|jpeg|png)$/i) || img.startsWith("data:image/")) {
      return "image";
    }
    return "image"; // 默認圖片
  };

  // 確保 URL 使用 HTTPS
  const getSecureUrl = (img: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const url = img.startsWith("/") ? `${baseUrl}${img}` : img;
    return url.replace("http://", "https://");
  };

  // 下載文件
  const handleDownload = async (imgUrl: string, fileName: string) => {
    try {
      const secureUrl = getSecureUrl(imgUrl);
      const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(secureUrl)}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!response.ok) {
        throw new Error(`無法下載文件：${response.statusText}`);
      }
      const blob = await response.blob();
      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const fileExtension = contentType.includes("pdf") || imgUrl.includes(".pdf") ? ".pdf" : ".jpg";
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${fileName}${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("下載文件失敗:", error);
      toast.error(error instanceof Error ? error.message : "下載文件失敗，請稍後再試");
    }
  };

  useEffect(() => {
    const getStudentExPaperList = async (studentId: string, paperId: string) => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";
        const normalizedSubject = Subject === "chinese" ? "中" : Subject; // 轉換科目
        const res = await fetch(
          `${apiUrl}/api/student/Student_ExPaper_by_id_Lists_by_id/${studentId}/${paperId}?school=${encodeURIComponent(
            SchoolName
          )}&grade=${encodeURIComponent(Grade)}&year=${encodeURIComponent(Year)}&quarter=${encodeURIComponent(
            Quarter
          )}&subject=${encodeURIComponent(normalizedSubject)}`,
          {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          }
        );
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();

        console.log("result in useEffect", result);

        // 檢查是否為錯誤響應
        if (result.error) {
          throw new Error(result.error);
        }

        // 處理陣列格式，提取第一個元素
        let data: any;
        if (Array.isArray(result) && result.length > 0) {
          data = result[0]; // 取陣列第一個元素
        } else if (Array.isArray(result) && result.length === 0) {
          throw new Error("未找到考試卷資料");
        } else {
          data = result; // 假設是單個物件
        }

        // 驗證數據結構
        if (
          !data ||
          typeof data !== "object" ||
          !data.id ||
          !data.name ||
          !data.school ||
          typeof data.grade !== "number" ||
          !data.year ||
          typeof data.quarter !== "number" ||
          !data.subject ||
          !data.img // 確保 img 存在
        ) {
          throw new Error("無效的數據格式");
        }

        setGetStudentExPaperDetailByID(data);
        setFileType(determineFileType(data.img));
      } catch (err) {
        console.error("載入考試卷詳情錯誤:", err);
        setError(err instanceof Error ? err.message : "無法獲取考試卷詳細資料");
        toast.error(err instanceof Error ? err.message : "無法獲取考試卷詳細資料");
      } finally {
        setIsLoading(false);
      }
    };

    if (StudentID && id) {
      getStudentExPaperList(StudentID, id);
    }
  }, [StudentID, id, SchoolName, Grade, Year, Quarter, Subject]);

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Year || !Quarter || !Subject || !id) {
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

  // 將參數轉換為正確類型
  const parsedGrade = parseInt(Grade, 10);
  const parsedQuarter = parseInt(Quarter, 10);
  const normalizedSubject = Subject === "chinese" ? "中" : Subject;

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminId}`} className="text-[#80A8BD] hover:text-cyan-200">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminId}/userLists`} className="text-[#80A8BD] hover:text-cyan-200">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          家長列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          考試卷
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${encodeURIComponent(
            SchoolName
          )}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${encodeURIComponent(
            SchoolName
          )}/${encodeURIComponent(Grade)}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          年級 {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${encodeURIComponent(
            SchoolName
          )}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${encodeURIComponent(
            SchoolName
          )}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          {quarterMapping[Quarter] || `第${Quarter}季度`}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${encodeURIComponent(
            SchoolName
          )}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}/${encodeURIComponent(
            Subject
          )}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          {subjectMapping[Subject] || Subject}
        </Link>
        <span className="mx-2">/</span>
        <span>{GetStudentExPaperDetailByID?.name || "考試卷詳細資料"}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-[#80A8BD] mb-4">
        {SchoolName} 年級 {Grade} {Year} {quarterMapping[Quarter] || `第${Quarter}季度`} {subjectMapping[Subject] || Subject}{" "}
        考試卷詳細資料
      </h2>

      {isLoading && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
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
      {!isLoading && !error && !GetStudentExPaperDetailByID && (
        <div className="text-gray-600 p-4 bg-white rounded-lg shadow-md">無考試卷詳細資料</div>
      )}
      {!isLoading &&
        !error &&
        GetStudentExPaperDetailByID &&
        GetStudentExPaperDetailByID.school === SchoolName &&
        GetStudentExPaperDetailByID.grade === parsedGrade &&
        GetStudentExPaperDetailByID.year === Year &&
        GetStudentExPaperDetailByID.quarter === parsedQuarter &&
        GetStudentExPaperDetailByID.subject === normalizedSubject &&
        GetStudentExPaperDetailByID.id === id && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium text-[#80A8BD]">名稱：{GetStudentExPaperDetailByID.name}</h3>
            {fileType === "image" ? (
              <div className="relative w-full max-w-2xl h-96">
                <Image
                  src={getSecureUrl(GetStudentExPaperDetailByID.img)}
                  alt={GetStudentExPaperDetailByID.name}
                  fill
                  className="object-contain rounded-lg border border-[#80A8BD]"
                  priority
                  onError={() => toast.error("無法載入圖片")}
                />
              </div>
            ) : fileType === "pdf" ? (
              <div className="w-full max-w-2xl">
                <iframe
                  src={getSecureUrl(GetStudentExPaperDetailByID.img)}
                  title={`${GetStudentExPaperDetailByID.name} 的考試卷 PDF`}
                  className="w-full h-96 rounded-md border border-[#80A8BD]"
                  onError={() => toast.error("無法載入 PDF")}
                />
              </div>
            ) : (
              <div className="text-gray-600 p-4 bg-white rounded-lg shadow-md">無法顯示文件：無效文件類型</div>
            )}
            <button
              onClick={() =>
                handleDownload(
                  GetStudentExPaperDetailByID.img,
                  `${GetStudentExPaperDetailByID.name}${fileType === "pdf" ? ".pdf" : ".jpg"}`
                )
              }
              className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
              disabled={!fileType}
            >
              下載 {fileType === "pdf" ? "PDF" : fileType === "image" ? "圖片" : "文件"}
            </button>
          </div>
        )}
    </div>
  );
};

export default ExPageLists_Grade_Year_Quarter_Subject_Lists_By_IDbysupadmin;