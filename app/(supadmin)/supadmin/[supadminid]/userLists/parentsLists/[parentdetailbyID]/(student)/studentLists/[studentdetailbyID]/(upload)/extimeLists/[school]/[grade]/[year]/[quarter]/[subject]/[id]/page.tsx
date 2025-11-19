"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";

interface StudentDetailData {
  name: string;
  img: string;
  id: string;
  school: string;
  grade: number; // 改為 number 以匹配 API
  year: string;
  quarter: number; // 改為 number 以匹配 API
  subject: string;
}

const ExTimeLists_Grade_Year_Quarter_subject_Lists_By_IDbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    studentdetailbyID: string;
    parentdetailbyID: string;
    id: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const Id = params?.id;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Year = params?.year ? decodeURIComponent(params.year) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";

  // 驗證路由參數
  if (!supadminId || !StudentID || !Id || !SchoolName || !Grade || !Year || !Quarter || !Subject) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  // 將路由參數轉為數字
  const parsedGrade = parseInt(Grade, 10);
  const parsedQuarter = parseInt(Quarter, 10);

  const fetcher = (url: string, init?: RequestInit): Promise<StudentDetailData[]> =>
    fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        ...init?.headers,
        "Cache-Control": "no-cache",
      },
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/student/Student_ExTime_by_id_Lists_by_id/${StudentID}/${Id}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入考試時間表詳細資料 - {error.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (isLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 資料格式驗證
  if (
    !data ||
    !Array.isArray(data) ||
    data.length === 0 ||
    typeof data[0].name !== "string" ||
    typeof data[0].img !== "string" ||
    typeof data[0].id !== "string" ||
    typeof data[0].school !== "string" ||
    typeof data[0].grade !== "number" || // 改為檢查 number
    typeof data[0].year !== "string" ||
    typeof data[0].quarter !== "number" || // 改為檢查 number
    typeof data[0].subject !== "string"
  ) {
    console.log("data :", data, "-- End --");
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的考試時間表詳細資料格式
      </div>
    );
  }

  const item = data[0]; // 提取陣列第一個元素

  // 驗證數據是否匹配路由參數
  if (
    item.school !== SchoolName ||
    item.grade !== parsedGrade || // 使用數字比較
    item.year !== Year ||
    item.quarter !== parsedQuarter || // 使用數字比較
    item.subject !== Subject
  ) {
    return <div className="text-gray-600 p-4">無匹配的考試時間表資料</div>;
  }

  // 判斷檔案類型
  const isPdf = item.img.toLowerCase().endsWith(".pdf");

  // 下載圖片的功能
  const handleDownload = async (imgUrl: string, fileName: string) => {
    try {
      const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(imgUrl)}`);
      if (!response.ok) {
        throw new Error("無法下載圖片");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}${isPdf ? ".pdf" : ".jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("下載圖片失敗:", error);
      alert("下載圖片失敗，請稍後再試");
    }
  };

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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists`}
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試時間表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(
            SchoolName
          )}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(
            SchoolName
          )}/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          年級 {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(
            SchoolName
          )}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(
            SchoolName
          )}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          季度 {Quarter}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(
            SchoolName
          )}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(
            Quarter
          )}/${encodeURIComponent(Subject)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Subject}
        </Link>
        <span className="mx-2">/</span>
        <span>{item.name}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} 年級 {Grade} {Year} 季度 {Quarter} {Subject} 考試時間表詳情
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
        <h3 className="text-xl font-semibold text-blue-600">{item.name}</h3>
        {isPdf ? (
          <iframe
            src={item.img}
            title={item.name}
            className="w-full h-[500px] rounded-lg border border-gray-300"
          />
        ) : (
          <Image
            width={500}
            height={500}
            src={item.img}
            alt={item.name}
            className="w-full max-w-md rounded-lg"
          />
        )}
      </div>
      <button
        onClick={() => handleDownload(item.img, `${item.name}${isPdf ? ".pdf" : ".jpg"}`)}
        className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
      >
        下載{isPdf ? " PDF" : " 圖片"}
      </button>
    </div>
  );
};

export default ExTimeLists_Grade_Year_Quarter_subject_Lists_By_IDbysupadmin;