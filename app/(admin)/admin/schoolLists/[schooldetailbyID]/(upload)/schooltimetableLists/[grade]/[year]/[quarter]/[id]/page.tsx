// "use client";
// import Image from 'next/image';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { useEffect, useState } from "react";

// interface SchoolTimeTable {
//     name: string;
//     img: string;
//     grade: number;
//     quarter: number;
//     year: string;
//     schooldetailbyID: string;
// }

// const SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detail = () => {
//     const params = useParams<{grade: string; year: string; quarter: string; id: string; schooldetailbyID: string}>();

//     const SchoolId = params?.schooldetailbyID as string;
//     const GradeId = params?.grade as string;
//     const YearId = params?.year as string;
//     const QuarterId = params?.quarter as string;
//     const SchoolTimeTableListById = params?.id as string;

//     const [GetSchoolTimeTableListDetailDataById, setGetSchoolTimeTableListDetailDataById] = useState<SchoolTimeTable[]>([]);

//     useEffect(() => {
//         if(SchoolId && YearId && GradeId && QuarterId && SchoolTimeTableListById) {
//             const getSchoolTimeTableListsDetailById = async (SchoolId: string, yearId: string, GradeId: string, QuarterId: string, SchoolTimeTableListById: string) => {
//                 try {
//                     const res = await fetch(`/api/Schooltimetablelists_detail_data_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SchoolTimeTableListById}`, {
//                 cache: 'no-store',  // 強制不快取，確保每次請求新數據
//                 headers: {
//                     'Cache-Control': 'no-cache',
//                 },
//             });
//                     if(!res.ok) {
//                         throw new Error("請求失敗！");
//                     }
//                     const result = await res.json();
//                     setGetSchoolTimeTableListDetailDataById(result);                    
//                 } catch (error) {
//                     console.error("獲取數據時出錯:", error);
//                 }
//             };
//             getSchoolTimeTableListsDetailById(SchoolId, YearId, GradeId, QuarterId, SchoolTimeTableListById);
//         }
//     }, [SchoolId, YearId, GradeId, QuarterId, SchoolTimeTableListById]);

//  // 下載圖片的功能
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
//       link.download = fileName || "schooltimetable-image.jpg"; // 使用書單名稱或默認文件名
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("下載圖片失敗:", error);
//       alert("下載圖片失敗，請稍後再試");
//     }
//   };

// console.log("GetSchoolTimeTableListDetailDataById : ", GetSchoolTimeTableListDetailDataById , "-- end --")

//     return (
//         <div className="container mx-auto px-4 py-8">
//             {/* 麵包屑導航 */}
//       <nav className="mb-4 text-sm px-4 sm:px-6 lg:px-8">
//         <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
//           主理員主頁
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/schoolLists`} className="text-blue-600 hover:text-blue-800">
//           學校列表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/schoolLists/${SchoolId}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學校資料
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/schoolLists/${SchoolId}/schooltimetableLists`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學校名
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {GradeId}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {YearId}
//         </Link>
//         <span className="mx-2">/</span>
//                 <Link
//           href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}/${QuarterId}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {QuarterId}
//         </Link>
//         <span className="mx-2">/</span>
//         <span>{GetSchoolTimeTableListDetailDataById[0].name}</span>
//       </nav>
//             <div className="bg-white rounded-lg shadow-md p-6">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">課程時間表詳細資料</h1>
                
//                 {GetSchoolTimeTableListDetailDataById.map((d, index) => {
//                     if(d.grade == Number(GradeId) && d.year == YearId && d.quarter == Number(QuarterId) && d.schooldetailbyID == SchoolTimeTableListById) {
//                         return (
//                             <div key={index} className="space-y-4">
//                                 <div className="border-b pb-4">
//                                     <h2 className="text-xl font-semibold text-gray-700">{d.name}</h2>
//                                     <div className="text-sm text-gray-500 mt-1">
//                                         年級: {d.grade}年級 | 學年: {d.year} | 季度: 第{d.quarter}季度
//                                     </div>
//                                 </div>
                                
//                                 {d.img && (
//                                     <div className="mt-4">
//                                         <div className="text-sm font-medium text-gray-700 mb-2">時間表圖片:</div>
//                                         <div className="border rounded-lg overflow-hidden">
//                                             <Image 
//                                                 width={800} 
//                                                 height={600} 
//                                                 src={d.img} 
//                                                 alt={`${d.name} 時間表`}
//                                                 className="w-full h-auto object-contain"
//                                             />
//                                         </div>
//                                                         <button
//                   onClick={() => handleDownload(d.img, `${d.name}.jpg`)}
//                   className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//                 >
//                   下載圖片
//                 </button>
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     }
//                     return null;
//                 })}

//                 {GetSchoolTimeTableListDetailDataById.length === 0 && (
//                     <div className="text-center py-12 text-gray-500">
//                         沒有找到相關的時間表資料
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detail;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SchoolTimeTable {
  name: string;
  img: string;
  grade: number;
  quarter: number;
  year: string;
  schooldetailbyID: string;
  id: string; // 新增 id 字段
}

const SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detail = () => {
  const params = useParams<{
    grade: string;
    year: string;
    quarter: string;
    id: string;
    schooldetailbyID: string;
  }>();

  const SchoolId = params?.schooldetailbyID as string;
  const GradeId = params?.grade as string;
  const YearId = params?.year as string;
  const QuarterId = params?.quarter as string;
  const SchoolTimeTableListById = params?.id as string;

  const [GetSchoolTimeTableListDetailDataById, setGetSchoolTimeTableListDetailDataById] = useState<
    SchoolTimeTable[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

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

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const getSecureUrl = (img: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://billy.ad";
    const url = img.startsWith("/") ? `${baseUrl}${img}` : img;
    return url.replace("http://", "https://");
  };

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
        console.log("代理 API 錯誤:", errorData, response.status);
        throw new Error(`無法下載文件: ${errorData.error || response.statusText}`);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeFileName = encodeURIComponent(fileName).replace(/%20/g, "_");
      link.href = downloadUrl;
      link.download = safeFileName || (isImage(url) ? "schooltimetable-image.jpg" : "schooltimetable-document.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("下載文件失敗:", error);
      setDownloadError(error instanceof Error ? error.message : "下載文件失敗，請稍後再試");
    }
  };

  useEffect(() => {
    if (SchoolId && YearId && GradeId && QuarterId && SchoolTimeTableListById) {
      const getSchoolTimeTableListsDetailById = async (
        SchoolId: string,
        YearId: string,
        GradeId: string,
        QuarterId: string,
        SchoolTimeTableListById: string
      ) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `/api/Schooltimetablelists_detail_data_by_id/${SchoolId}/${GradeId}/${YearId}/${QuarterId}/${SchoolTimeTableListById}`,
            {
              cache: "no-store",
              headers: { "Cache-Control": "no-cache" },
            }
          );
          if (!res.ok) {
            throw new Error("無法載入課程時間表詳情");
          }
          const result: SchoolTimeTable[] = await res.json();
          setGetSchoolTimeTableListDetailDataById(result);
          console.log("Fetched SchoolTimeTableListDetail:", result, "-- End --");
        } catch (err: unknown) {
          console.error("載入錯誤:", err);
          const errorMessage = err instanceof Error ? err.message : "無法載入課程時間表詳情";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      getSchoolTimeTableListsDetailById(SchoolId, YearId, GradeId, QuarterId, SchoolTimeTableListById);
    } else {
      setError("無效的學校ID、年級、年份、季度或時間表ID");
      setLoading(false);
    }
  }, [SchoolId, YearId, GradeId, QuarterId, SchoolTimeTableListById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !GetSchoolTimeTableListDetailDataById || GetSchoolTimeTableListDetailDataById.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無課程時間表資料"}</p>
      </div>
    );
  }

  const schoolTimeTableData = GetSchoolTimeTableListDetailDataById[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-4 text-sm px-4 sm:px-6 lg:px-8">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學校列表
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}`} className="text-blue-600 hover:text-blue-800">
          學校資料
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}/schooltimetableLists`} className="text-blue-600 hover:text-blue-800">
          課程時間表
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}`} className="text-blue-600 hover:text-blue-800">
          {gradeMapping[GradeId] || GradeId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}`} className="text-blue-600 hover:text-blue-800">
          {YearId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}/${QuarterId}`} className="text-blue-600 hover:text-blue-800">
          季度 {QuarterId}
        </Link>
        <span className="mx-2">/</span>
        <span>{schoolTimeTableData.name}</span>
      </nav>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            課程時間表詳情 - {gradeMapping[GradeId] || GradeId} {YearId} 季度 {QuarterId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/upload`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳課程時間表
            </Link>
            <Link
              href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}/${QuarterId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回課程時間表列表
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">名稱</h3>
            <p className="text-gray-800">{schoolTimeTableData.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">年級</h3>
            <p className="text-gray-800">{gradeMapping[GradeId] || GradeId}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">年份</h3>
            <p className="text-gray-800">{YearId}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">季度</h3>
            <p className="text-gray-800">{QuarterId}</p>
          </div>
          {schoolTimeTableData.img ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                {isImage(schoolTimeTableData.img) ? "時間表圖片" : "時間表文件"}
              </h3>
              {isImage(schoolTimeTableData.img) ? (
                <div className="relative w-full max-w-md h-64">
                  <Image
                    src={getSecureUrl(schoolTimeTableData.img)}
                    alt={schoolTimeTableData.name}
                    fill
                    className="object-contain rounded-md"
                    priority
                    onError={() => console.error("圖片加載失敗:", schoolTimeTableData.img)}
                  />
                  <button
                    onClick={() => handleDownload(schoolTimeTableData.img, `${schoolTimeTableData.name}.jpg`)}
                    className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    下載圖片
                  </button>
                  {downloadError && <p className="text-red-500 mt-2">{downloadError}</p>}
                </div>
              ) : (
                <div>
                  <p className="text-gray-800">{schoolTimeTableData.name}</p>
                  <a
                    href={getSecureUrl(schoolTimeTableData.img)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    查看 PDF 文件
                  </a>
                  <button
                    onClick={() => handleDownload(schoolTimeTableData.img, `${schoolTimeTableData.name}.pdf`)}
                    className="ml-4 mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    下載 PDF
                  </button>
                  {downloadError && <p className="text-red-500 mt-2">{downloadError}</p>}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">無圖片或文件</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detail;