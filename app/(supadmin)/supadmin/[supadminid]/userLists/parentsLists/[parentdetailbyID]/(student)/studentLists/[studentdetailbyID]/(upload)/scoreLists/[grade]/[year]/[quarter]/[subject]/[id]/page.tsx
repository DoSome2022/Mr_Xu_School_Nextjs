"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import Image from "next/image";

// 定義年級對應對象（從 ScoreListsbysupadmin 借用）
const gradeMapping: { [key: string]: string } = {
  "1": "小學1年級",
  "2": "小學2年級",
  "3": "小學3年級",
  "4": "小學4年級",
  "5": "小學5年級",
  "6": "小學6年級",
  "7": "初中1年級",
  "8": "初中2年級",
  "9": "初中3年級",
  "10": "高中1年級",
  "11": "高中2年級",
  "12": "高中3年級",
};

// 定義季度對應對象（從 ScoreLists_Year_Quarterbysupadmin 借用）
const quarterMapping: { [key: string]: string } = {
  "1": "第一季度",
  "2": "第二季度",
  "3": "第三季度",
  "4": "第四季度",
};

interface StudentDetailData {
  id: string;
  name: string;
  img: string;
  grade: number; // 改為 number
  year: string;
  quarter: number; // 改為 number
  subject: string;
}

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

const ScoreLists_Year_Quarter_Subject_List_By_IDbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    id: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const Id = params?.id;
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Year = params?.year ? decodeURIComponent(params.year) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !Id || !Grade || !Year || !Quarter || !Subject) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  // 將路由參數轉為數字
  const parsedGrade = parseInt(Grade, 10);
  const parsedQuarter = parseInt(Quarter, 10);

  // 驗證轉換後的參數
  if (isNaN(parsedGrade) || isNaN(parsedQuarter)) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：年級或季度格式無效
      </div>
    );
  }

  // 驗證年級是否有效
  if (!gradeMapping[Grade]) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無效的年級 {Grade}
      </div>
    );
  }

  // 驗證季度是否有效
  if (!quarterMapping[Quarter]) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無效的季度 {Quarter}
      </div>
    );
  }

  const fetcher = <T,>(url: string, init?: RequestInit): Promise<T> =>
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

  // 獲取成績詳細資料
  const { data: scoreDataArray, error: scoreError, isLoading: scoreLoading } = useSWR<StudentDetailData[]>(
    `${apiUrl}/api/student/Student_Score_by_id_Lists_by_id/${StudentID}/${Id}?grade=${encodeURIComponent(Grade)}&year=${encodeURIComponent(Year)}&quarter=${encodeURIComponent(Quarter)}&subject=${encodeURIComponent(Subject)}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 獲取學生資料以顯示名稱
  const { data: studentData, error: studentError, isLoading: studentLoading } = useSWR<StudentData[]>(
    `${apiUrl}/api/student/Student_Lists_detail_data_by_id/${StudentID}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 提取第一個成績資料
  const scoreData = scoreDataArray && scoreDataArray.length > 0 ? scoreDataArray[0] : null;

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("scoreDataArray :", scoreDataArray, "-- End --");
    console.log("scoreData :", scoreData, "-- End --");
    console.log("studentData :", studentData, "-- End --");
  }

  // 錯誤處理
  if (scoreError || studentError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入資料 - {(scoreError || studentError)?.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (scoreLoading || studentLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 驗證成績資料
  if (
    !scoreData ||
    !scoreData.id ||
    !scoreData.name ||
    !scoreData.img ||
    typeof scoreData.grade !== "number" ||
    !scoreData.year ||
    typeof scoreData.quarter !== "number" ||
    !scoreData.subject
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的成績資料格式
      </div>
    );
  }

  // 驗證學生資料
  if (
    !studentData ||
    !Array.isArray(studentData) ||
    studentData.length === 0 ||
    !studentData.every((item) => item.id && item.name && typeof item.grade === "number" && item.school)
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的學生資料格式
      </div>
    );
  }

  // 驗證成績資料是否匹配
  if (
    scoreData.grade !== parsedGrade ||
    scoreData.year !== Year ||
    scoreData.quarter !== parsedQuarter ||
    scoreData.subject !== Subject ||
    scoreData.id !== Id
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：成績資料與請求參數不匹配
      </div>
    );
  }

  // 將 HTTP 轉為 HTTPS（解決 Mixed Content）
  const secureImgUrl = scoreData.img.replace(/^http:\/\//, "https://");

  // 判斷檔案類型
  const isPdf = secureImgUrl.toLowerCase().endsWith(".pdf");

  // 下載圖片的功能
  const handleDownload = async (imgUrl: string, fileName: string) => {
    try {
      const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(imgUrl)}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error(`無法下載圖片：${response.statusText}`);
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          成績表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {gradeMapping[Grade]}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {quarterMapping[Quarter]}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}/${encodeURIComponent(Subject)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Subject}
        </Link>
        <span className="mx-2">/</span>
        <span>{scoreData.name}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {studentData[0].name} 的 {gradeMapping[Grade]} {Year} {quarterMapping[Quarter]} {Subject} 成績詳情
      </h2>

      <div className="flex flex-col space-y-4">
        <div className="text-blue-600 font-medium">{scoreData.name}</div>
        {isPdf ? (
          <iframe
            src={secureImgUrl}
            title={scoreData.name}
            className="w-full h-[500px] rounded-lg border border-gray-300"
          />
        ) : (
          <Image
            width={500}
            height={500}
            src={secureImgUrl}
            alt={scoreData.name}
            className="object-contain rounded-lg"
          />
        )}
      </div>
      <button
        onClick={() => handleDownload(secureImgUrl, `${scoreData.name}${isPdf ? ".pdf" : ".jpg"}`)}
        className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
      >
        下載{isPdf ? " PDF" : " 圖片"}
      </button>
    </div>
  );
};

export default ScoreLists_Year_Quarter_Subject_List_By_IDbysupadmin;