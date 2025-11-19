// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// interface SchoolExTimeData {
//   name: string;
//   img: string;
//   grade: number;
//   quarter: number;
//   subject: string;
//   year: string;
//   student_ex_timetable_id: string;
// }

// const ExTimeLists_Grade_Year_Quarter_Subject_extimelists_Detail = () => {
//   const params = useParams<{
//     grade: string;
//     year: string;
//     quarter: string;
//     subject: string;
//     id: string;
//     schooldetailbyID: string;
//   }>();
//   const SchoolId = params?.schooldetailbyID as string;
//   const GradeId = params?.grade as string;
//   const YearId = params?.year as string;
//   const QuarterId = params?.quarter as string;
//   const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";
//   const ExTimeListById = params?.id as string;

//   const [GetExTimeListsDetailDataById, setGetExTimeListsDetailDataById] = useState<
//     SchoolExTimeData[]
//   >([]);

//   useEffect(() => {
//     if (SchoolId && GradeId && YearId && QuarterId && SubjectId && ExTimeListById) {
//       const getExTimeListsDetailById = async (
//         SchoolId: string,
//         GradeId: string,
//         YearId: string,
//         QuarterId: string,
//         SubjectId: string,
//         ExTimeListById: string
//       ) => {
//         try {
//           const res = await fetch(
//             `/api/Extimelists_detail_data_by_id/${SchoolId}/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${ExTimeListById}`, {
//                 cache: 'no-store',  // 強制不快取，確保每次請求新數據
//                 headers: {
//                     'Cache-Control': 'no-cache',
//                 },
//             }
//           );
//           if (!res.ok) {
//             throw new Error("無法連線！");
//           }
//           const result = await res.json();
//           setGetExTimeListsDetailDataById(result);
//         } catch (error) {
//           console.error(error);
//         }
//       };
//       getExTimeListsDetailById(SchoolId, GradeId, YearId, QuarterId, SubjectId, ExTimeListById);
//     }
//   }, [SchoolId, GradeId, YearId, QuarterId, SubjectId, ExTimeListById]);
//   // 下載圖片的功能
//   const handleDownload = async (imgUrl: string, fileName: string) => {
//     try {
//       const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(imgUrl)}`);
//       if (!response.ok) {
//         throw new Error("無法下載圖片");
//       }
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName || "Extime-image.jpg";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("下載圖片失敗:", error);
//       alert("下載圖片失敗，請稍後再試");
//     }
//   };

//   console.log("GetExTimeListsDetailDataById:", GetExTimeListsDetailDataById , " -- End -- ");

//   return (
//     <div className="min-h-screen bg-gray-100 pt-20">
//       {/* 麵包屑導航 */}
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
//           href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           年級 {GradeId}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {YearId}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           季度 {QuarterId}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${encodeURIComponent(SubjectId)}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {SubjectId}
//         </Link>
//         <span className="mx-2">/</span>
//         <span>{GetExTimeListsDetailDataById[0]?.name || "考試時間表詳情"}</span>
//       </nav>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">考試時間表詳情</h1>

//           {GetExTimeListsDetailDataById.length === 0 ? (
//             <div className="text-gray-700 text-sm">暫無試卷詳情資料</div>
//           ) : (
//             <div className="space-y-6">
//               {GetExTimeListsDetailDataById.map((d) => {
//                 if (
//                   d.grade === Number(GradeId) &&
//                   d.quarter === Number(QuarterId) &&
//                   d.subject === SubjectId &&
//                   d.year === YearId &&
//                   d.student_ex_timetable_id === ExTimeListById
//                 ) {
//                   return (
//                     <div key={d.student_ex_timetable_id} className="p-4 bg-gray-50 rounded-md">
//                       <h2 className="text-lg font-medium text-gray-800 mb-4">{d.name}</h2>
//                       {d.img && (
//                         <Image
//                           width={500}
//                           height={500}
//                           src={d.img}
//                           alt={d.name}
//                           className="rounded-md shadow-md"
//                         />
                        
//                       )}
//                      <button
//                         onClick={() => handleDownload(d.img, `${d.name}.jpg`)}
//                         className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//                       >
//                         下載圖片
//                       </button>
//                     </div>
//                   );
//                 }
//                 return null;
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExTimeLists_Grade_Year_Quarter_Subject_extimelists_Detail;


"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SchoolExTimeData {
  name: string;
  img: string;
  grade: number;
  quarter: number;
  subject: string;
  year: string;
  id: string; // 修正為 id
}

const ExTimeLists_Grade_Year_Quarter_Subject_extimelists_Detail = () => {
  const params = useParams<{
    grade: string;
    year: string;
    quarter: string;
    subject: string;
    id: string;
    schooldetailbyID: string;
  }>();
  const SchoolId = params?.schooldetailbyID as string;
  const GradeId = params?.grade as string;
  const YearId = params?.year as string;
  const QuarterId = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";
  const ExTimeListById = params?.id as string;

  const [GetExTimeListsDetailDataById, setGetExTimeListsDetailDataById] = useState<
    SchoolExTimeData[] | null
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
      link.download = safeFileName || (isImage(url) ? "Extime-image.jpg" : "Extime-document.pdf");
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
    if (SchoolId && GradeId && YearId && QuarterId && SubjectId && ExTimeListById) {
      const getExTimeListsDetailById = async (
        SchoolId: string,
        GradeId: string,
        YearId: string,
        QuarterId: string,
        SubjectId: string,
        ExTimeListById: string
      ) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `/api/Extimelists_detail_data_by_id/${SchoolId}/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${ExTimeListById}`,
            {
              cache: "no-store",
              headers: { "Cache-Control": "no-cache" },
            }
          );
          if (!res.ok) {
            throw new Error("無法載入考試時間表詳情");
          }
          const result: SchoolExTimeData[] = await res.json();
          setGetExTimeListsDetailDataById(result);
          console.log("Fetched ExTimeListsDetail:", result, "-- End --");
        } catch (err: unknown) {
          console.error("載入錯誤:", err);
          const errorMessage = err instanceof Error ? err.message : "無法載入考試時間表詳情";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      getExTimeListsDetailById(SchoolId, GradeId, YearId, QuarterId, SubjectId, ExTimeListById);
    } else {
      setError("無效的學校ID、年級、年份、季度、科目或考試時間表ID");
      setLoading(false);
    }
  }, [SchoolId, GradeId, YearId, QuarterId, SubjectId, ExTimeListById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !GetExTimeListsDetailDataById || GetExTimeListsDetailDataById.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無考試時間表資料"}</p>
      </div>
    );
  }

  const exTimeData = GetExTimeListsDetailDataById[0];

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
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
        <Link href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}`} className="text-blue-600 hover:text-blue-800">
          年級 {gradeMapping[GradeId] || GradeId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}`} className="text-blue-600 hover:text-blue-800">
          {YearId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}`} className="text-blue-600 hover:text-blue-800">
          季度 {QuarterId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${encodeURIComponent(SubjectId)}`} className="text-blue-600 hover:text-blue-800">
          {SubjectId}
        </Link>
        <span className="mx-2">/</span>
        <span>{exTimeData.name}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            考試時間表詳情 - {gradeMapping[GradeId] || GradeId} {YearId} 季度 {QuarterId} {SubjectId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${SchoolId}/extimeLists/upload`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳考試時間表
            </Link>
            <Link
              href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${encodeURIComponent(SubjectId)}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回考試時間表列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">考試時間表詳情</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">名稱</h3>
              <p className="text-gray-800">{exTimeData.name}</p>
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
            <div>
              <h3 className="text-lg font-semibold text-gray-700">科目</h3>
              <p className="text-gray-800">{SubjectId}</p>
            </div>
            {exTimeData.img ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {isImage(exTimeData.img) ? "考試時間表圖片" : "考試時間表文件"}
                </h3>
                {isImage(exTimeData.img) ? (
                  <div className="relative w-full max-w-md h-64">
                    <Image
                      src={getSecureUrl(exTimeData.img)}
                      alt={exTimeData.name}
                      fill
                      className="object-contain rounded-md"
                      priority
                      onError={() => console.error("圖片加載失敗:", exTimeData.img)}
                    />
                    <button
                      onClick={() => handleDownload(exTimeData.img, `${exTimeData.name}.jpg`)}
                      className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                      style={{ position: "relative", zIndex: 10 }}
                    >
                      下載圖片
                    </button>
                    {downloadError && <p className="text-red-500 mt-2">{downloadError}</p>}
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-800">{exTimeData.name}</p>
                    <a
                      href={getSecureUrl(exTimeData.img)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      查看 PDF 文件
                    </a>
                    <button
                      onClick={() => handleDownload(exTimeData.img, `${exTimeData.name}.pdf`)}
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
    </div>
  );
};

export default ExTimeLists_Grade_Year_Quarter_Subject_extimelists_Detail;