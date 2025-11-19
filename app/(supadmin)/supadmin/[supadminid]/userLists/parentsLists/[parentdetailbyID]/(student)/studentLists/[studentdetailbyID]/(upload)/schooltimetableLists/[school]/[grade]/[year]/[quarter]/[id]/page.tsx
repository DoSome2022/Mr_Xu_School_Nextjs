"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface StudentDetailData {
  name: string;
  img: string;
  id: string;
  grade: string;
  year: string;
  quarter: string;
  subject: string;
}

// 定義年級對應對象
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

// 定義季度對應對象
const quarterMapping: { [key: string]: string } = {
  "1": "第一季度",
  "2": "第二季度",
  "3": "第三季度",
  "4": "第四季度",
};

const ScoreLists_Year_Quarter_Subject_List_By_IDbysupadmin = () => {
  const params = useParams<{
    studentdetailbyID: string;
    id: string;
    parentdetailbyID: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
  }>();

  const StudentID = params?.studentdetailbyID as string;
  const ParentID = params?.parentdetailbyID as string;
  const Grade = params?.grade as string;
  const Year = params?.year as string;
  const Quarter = params?.quarter as string;
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";
  const Id = params?.id as string;

  const [GetStudentScoreDetailByID, setGetStudentScoreDetailByID] = useState<StudentDetailData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // 檢查是否為圖片格式
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png)$/i.test(url) && !url.startsWith("data:");
  };

  // 確保 URL 使用 HTTPS
  const getSecureUrl = (img: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://localhost:3000";
    const url = img.startsWith("/") ? `${baseUrl}${img}` : img;
    return url.replace("http://", "https://");
  };

  // 下載文件處理
  const handleDownload = async (url: string, fileName: string) => {
    setDownloadError(null);
    try {
      const secureUrl = getSecureUrl(url);
      console.log("下載 URL:", secureUrl);
      const response = await fetch(`/api/proxy-image?file=${encodeURIComponent(secureUrl)}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("代理 API 錯誤:", errorData, response.status);
        throw new Error(`無法下載文件: ${errorData.error || response.statusText}`);
      }
      const blob = await response.blob();
      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const fileExtension = secureUrl.split(".").pop()?.toLowerCase() || "bin";
      const isImageFile = ["jpg", "jpeg", "png"].includes(fileExtension);
      const defaultFileName = isImageFile ? `${fileName}.jpg` : `${fileName}.pdf`;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeFileName = encodeURIComponent(defaultFileName).replace(/%20/g, "_");
      link.href = downloadUrl;
      link.download = safeFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("下載文件失敗:", error);
      const errorMessage = error instanceof Error ? error.message : "下載文件失敗，請稍後再試";
      setDownloadError(errorMessage);
      toast.error(errorMessage);
    }
  };

  console.log("GetStudentScoreDetailByID : ", GetStudentScoreDetailByID ," -- End -- ")

  useEffect(() => {
    if (StudentID && Id) {
      const getstudentscoredetailbyid = async (StudentID: string, id: string) => {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/student/Student_ScTimetable_by_id_Lists_by_id/${StudentID}/${id}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error(`獲取數據失敗！`);
          }
          const result = await res.json();
          setGetStudentScoreDetailByID(result);
        } catch (error) {
          console.error(error);
          setError(error instanceof Error ? error.message : "發生未知錯誤");
        } finally {
          setIsLoading(false);
        }
      };
      getstudentscoredetailbyid(StudentID, Id);
    }
  }, [StudentID, Id]);

  const filteredData = GetStudentScoreDetailByID.filter(
    (d) =>
      String(d.grade) === String(Grade) &&
      d.year === Year &&
      String(d.quarter) === String(Quarter) &&
      d.subject === Subject &&
      d.id === Id
  );

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center text-red-500 font-medium">
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
            錯誤: {error}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
            <p className="mt-4 text-gray-600">資料載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          成績表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {gradeMapping[Grade] || Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {quarterMapping[Quarter] || Quarter}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}/${encodeURIComponent(Subject)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Subject}
        </Link>
        <span className="mx-2">/</span>
        <span>詳細資料</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-[#80A8BD] px-6 py-4">
            <h1 className="text-xl font-bold text-white">
              {Subject} 學校時間表詳情
            </h1>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="text-gray-600 mt-2 space-y-1">
                <div>學生姓名: {filteredData[0]?.name || "無資料"}</div>
                <div>
                  學年: {Year} | 季度: {quarterMapping[Quarter] || Quarter} | 年級: {gradeMapping[Grade] || Grade}
                </div>
              </div>
            </div>

            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                找不到指定的學校時間表詳情記錄
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl border border-[#80A8BD] rounded-lg p-4 mb-6">
                  {isImage(filteredData[0].img) ? (
                    <div className="relative w-full h-96">
                      <Image
                        src={getSecureUrl(filteredData[0].img)}
                        alt={`${filteredData[0].name}的學校時間表詳情`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-full">
                      <iframe
                        src={getSecureUrl(filteredData[0].img)}
                        title={`${filteredData[0].name}的學校時間表詳情 PDF`}
                        className="w-full h-96 rounded-md"
                      />
                      <button
                        onClick={() => handleDownload(filteredData[0].img, filteredData[0].name)}
                        className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                      >
                        下載 PDF
                      </button>
                      {downloadError && <p className="text-red-500 mt-2">{downloadError}</p>}
                    </div>
                  )}
                </div>
                <div className="w-full max-w-2xl bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-[#80A8BD] mb-2">學校時間表詳情資訊</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">學生ID:</p>
                      <p className="font-medium">{filteredData[0].id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">學校時間表詳情:</p>
                      <p className="font-medium">{filteredData[0].subject}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreLists_Year_Quarter_Subject_List_By_IDbysupadmin;



// "use client";

// import { useParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import useSWR from "swr";

// interface StudentDetailData {
//   name: string;
//   img: string;
//   id: string;
//   school: string;
//   grade: string;
//   year: string;
//   quarter: string;
// }

// const SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_IDbysupadmin = () => {
//   const params = useParams<{
//     supadminid: string;
//     parentdetailbyID: string;
//     studentdetailbyID: string;
//     school: string;
//     grade: string;
//     year: string;
//     quarter: string;
//     id: string;
//   }>();
//   const supadminId = params?.supadminid;
//   const ParentID = params?.parentdetailbyID;
//   const StudentID = params?.studentdetailbyID;
//   const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
//   const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
//   const Year = params?.year ? decodeURIComponent(params.year) : "";
//   const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
//   const Id = params?.id ? decodeURIComponent(params.id) : "";

//   // 驗證路由參數
//   if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Year || !Quarter || !Id) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         錯誤：缺少必要路由參數
//       </div>
//     );
//   }

//   const fetcher = (url: string, init?: RequestInit): Promise<StudentDetailData> =>
//     fetch(url,{
//     ...init, // 保留傳入的 init 配置（若有）
//     cache: 'no-store', // 強制不快取，確保每次請求新數據
//     headers: {
//       ...init?.headers, // 合併傳入的 headers（若有）
//       'Cache-Control': 'no-cache', // 設置快取控制頭部
//     },
//   }).then((res) => {
//       if (!res.ok) throw new Error(res.statusText);
//       return res.json();
//     });

//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
//   const { data, error, isLoading } = useSWR(
//     `${apiUrl}/api/student/Student_ScTimetable_by_id_Lists_by_id/${StudentID}/${encodeURIComponent(Id)}`,
//     fetcher,
//     { revalidateOnFocus: false }
//   );

//   // 錯誤處理
//   if (error) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         錯誤：無法載入時間表資料 - {error.message || "未知錯誤"}
//       </div>
//     );
//   }

//   // 載入中
//   if (isLoading) {
//     return <div className="text-gray-600 p-4">載入中...</div>;
//   }

//   // 資料格式驗證
//   if (
//     !data ||
//     typeof data !== "object" ||
//     !data.name ||
//     !data.img ||
//     !data.id ||
//     !data.school ||
//     !data.grade ||
//     !data.year ||
//     !data.quarter
//   ) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         無效的時間表資料格式
//       </div>
//     );
//   }

//   // 驗證數據是否匹配路由參數
//   if (
//     data.school !== SchoolName ||
//     data.grade !== Grade ||
//     data.year !== Year ||
//     data.quarter !== Quarter ||
//     data.id !== Id
//   ) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         錯誤：時間表資料與路由參數不匹配
//       </div>
//     );
//   }

//     // 下載圖片的功能
//   const handleDownload = async (imgUrl: string, fileName: string) => {
//     try {
//     //   const response = await fetch(imgUrl, { mode: "cors" });
//     const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(imgUrl)}`);
//       if (!response.ok) {
//         throw new Error("無法下載圖片");
//       }
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName || "ScTimetable-image.jpg"; // 使用書單名稱或默認文件名
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("下載圖片失敗:", error);
//       alert("下載圖片失敗，請稍後再試");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
//       {/* 麵包屑導航 */}
//       <nav className="mb-4 text-sm">
//         <Link href={`/supadmin/${supadminId}`} className="text-blue-600 hover:text-blue-800">
//           主理員主頁
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/supadmin/${supadminId}/userLists`} className="text-blue-600 hover:text-blue-800">
//           用戶列表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學生列表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學生詳情
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學校時間表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {SchoolName}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           年級 {Grade}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學年 {Year}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           季度 {Quarter}
//         </Link>
//         <span className="mx-2">/</span>
//         <span>{data.name}</span>
//       </nav>

//       <h2 className="text-2xl font-semibold text-blue-600 mb-4">
//         {SchoolName} 年級 {Grade} 學年 {Year} 季度 {Quarter} 時間表詳情
//       </h2>

//       <div className="flex flex-col space-y-4">
//         <div className="text-lg font-medium text-blue-600">{data.name}</div>
//         <Image
//           width={500}
//           height={500}
//           src={`${apiUrl}${data.img}`}
//           alt={data.name}
//           className="object-contain rounded-lg"
//         />
//       </div>
//       <button
//         onClick={() => handleDownload(data.img, `${data.name}.jpg`)}
//         className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//       >
//         下載圖片
//       </button>
//     </div>
//   );
// };

// export default SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_IDbysupadmin;