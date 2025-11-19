// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// interface SchoolExScopeData {
//   name: string;
//   img: string;
//   grade: number;
//   quarter: number;
//   subject: string;
//   schooldetailbyID: string;
// }

// const ExScopeLists_Grade_Subject_exscpelists = () => {
//   const params = useParams<{
//     grade: string;
//     quarter: string;
//     subject: string;
//     id: string;
//     schooldetailbyID: string;
//   }>();
//   const SchoolId = params?.schooldetailbyID as string;
//   const GradeId = params?.grade as string;
//   const QuarterId = params?.quarter as string;
//   const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";
//   const ExScopeListById = params?.id as string;

//   const [GetExScopeListDetailDataById, setGetExScopeListDetailDataById] = useState<
//     SchoolExScopeData[]
//   >([]);

//   useEffect(() => {
//     if (SchoolId && GradeId && QuarterId && SubjectId && ExScopeListById) {
//       const getExScopeListDetailById = async (
//         SchoolId: string,
//         GradeId: string,
//         QuarterId: string,
//         SubjectId: string,
//         ExScopeListById: string
//       ) => {
//         try {
//           const res = await fetch(
//             `/api/Exscopelists_detail_data_by_id/${SchoolId}/${GradeId}/${QuarterId}/${SubjectId}/${ExScopeListById}`
//           );
//           if (!res.ok) {
//             throw new Error("無法連線！");
//           }
//           const result = await res.json();
//           setGetExScopeListDetailDataById(result);
//         } catch (error) {
//           console.error(error);
//         }
//       };
//       getExScopeListDetailById(SchoolId, GradeId, QuarterId, SubjectId, ExScopeListById);
//     }
//   }, [SchoolId, GradeId, QuarterId, SubjectId, ExScopeListById]);

//   // 下載圖片的功能
//   const handleDownload = async (imgUrl: string, fileName: string) => {
//     try {
//     //   const response = await fetch(imgUrl, { mode: "cors" });
//     const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(imgUrl)}`, {
//                 cache: 'no-store',  // 強制不快取，確保每次請求新數據
//                 headers: {
//                     'Cache-Control': 'no-cache',
//                 },
//             });
//       if (!response.ok) {
//         throw new Error("無法下載圖片");
//       }
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName || "ExScope-image.jpg"; // 使用書單名稱或默認文件名
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("下載圖片失敗:", error);
//       alert("下載圖片失敗，請稍後再試");
//     }
//   };

// console.log("GetExScopeListDetailDataById : " , GetExScopeListDetailDataById,"-- End --")
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
//                 <span className="mx-2">/</span>
//         <Link
//           href={`/admin/schoolLists/${SchoolId}/exscopeLists/`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           考試範圍
//         </Link>
        

//         <span className="mx-2">/</span>
//                 <Link
//           href={`/admin/schoolLists/${SchoolId}/exscopeLists/${GradeId}/`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {GradeId}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {QuarterId}
//         </Link>
//         <span className="mx-2">/</span>
//                 <Link
//           href={`/admin/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/${SubjectId}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {SubjectId}
//         </Link>
//         <span className="mx-2">/</span>
//         <span>{GetExScopeListDetailDataById[0].name}</span>
//       </nav>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">試卷詳情</h1>

//           {GetExScopeListDetailDataById.length === 0 ? (
//             <div className="text-gray-700 text-sm">暫無試卷詳情資料</div>
//           ) : (
//             <div className="space-y-6">
//               {GetExScopeListDetailDataById.map((d) => {
//                 if (
//                   d.grade === Number(GradeId) &&
//                   d.quarter === Number(QuarterId) &&
//                   d.subject === SubjectId &&
//                   d.schooldetailbyID === SchoolId
//                 ) {
//                   return (
//                     <div key={d.name} className="p-4 bg-gray-50 rounded-md">
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

//                                       <button
//                   onClick={() => handleDownload(d.img, `${d.name}.jpg`)}
//                   className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//                 >
//                   下載圖片
//                 </button>
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

// export default ExScopeLists_Grade_Subject_exscpelists;


"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SchoolExScopeData {
  name: string;
  img: string;
  grade: number;
  quarter: number;
  subject: string;
  schooldetailbyID: string;
}

const ExScopeLists_Grade_Subject_exscpelists = () => {
  const params = useParams<{
    grade: string;
    quarter: string;
    subject: string;
    id: string;
    schooldetailbyID: string;
  }>();
  const SchoolId = params?.schooldetailbyID as string;
  const GradeId = params?.grade as string;
  const QuarterId = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";
  const ExScopeListById = params?.id as string;

  const [GetExScopeListDetailDataById, setGetExScopeListDetailDataById] = useState<
    SchoolExScopeData[] | null
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
      link.download = safeFileName || (isImage(url) ? "ExScope-image.jpg" : "ExScope-document.pdf");
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
    if (SchoolId && GradeId && QuarterId && SubjectId && ExScopeListById) {
      const getExScopeListDetailById = async (
        SchoolId: string,
        GradeId: string,
        QuarterId: string,
        SubjectId: string,
        ExScopeListById: string
      ) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `/api/Exscopelists_detail_data_by_id/${SchoolId}/${GradeId}/${QuarterId}/${SubjectId}/${ExScopeListById}`,
            {
              cache: "no-store",
              headers: { "Cache-Control": "no-cache" },
            }
          );
          if (!res.ok) {
            throw new Error("無法載入試卷詳情");
          }
          const result: SchoolExScopeData[] = await res.json();
          setGetExScopeListDetailDataById(result);
          console.log("Fetched ExScopeListDetail:", result, "-- End --");
        } catch (err: unknown) {
          console.error("載入錯誤:", err);
          const errorMessage = err instanceof Error ? err.message : "無法載入試卷詳情";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      getExScopeListDetailById(SchoolId, GradeId, QuarterId, SubjectId, ExScopeListById);
    } else {
      setError("無效的學校ID、年級、季度、科目或試卷ID");
      setLoading(false);
    }
  }, [SchoolId, GradeId, QuarterId, SubjectId, ExScopeListById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !GetExScopeListDetailDataById || GetExScopeListDetailDataById.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無試卷資料"}</p>
      </div>
    );
  }

  const exScopeData = GetExScopeListDetailDataById[0];

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
        <Link href={`/admin/schoolLists/${SchoolId}/exscopeLists/`} className="text-blue-600 hover:text-blue-800">
          考試範圍
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}/exscopeLists/${GradeId}/`} className="text-blue-600 hover:text-blue-800">
          {gradeMapping[GradeId] || GradeId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/`} className="text-blue-600 hover:text-blue-800">
          季度 {QuarterId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/${SubjectId}`} className="text-blue-600 hover:text-blue-800">
          {SubjectId}
        </Link>
        <span className="mx-2">/</span>
        <span>{exScopeData.name}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            試卷詳情 - {gradeMapping[GradeId] || GradeId} 季度 {QuarterId} {SubjectId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${SchoolId}/exscopeLists/upload`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳試卷
            </Link>
            <Link
              href={`/admin/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/${SubjectId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回試卷列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">試卷詳情</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">試卷名稱</h3>
              <p className="text-gray-800">{exScopeData.name}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">年級</h3>
              <p className="text-gray-800">{gradeMapping[GradeId] || GradeId}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">季度</h3>
              <p className="text-gray-800">{QuarterId}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">科目</h3>
              <p className="text-gray-800">{SubjectId}</p>
            </div>
            {exScopeData.img ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {isImage(exScopeData.img) ? "試卷圖片" : "試卷文件"}
                </h3>
                {isImage(exScopeData.img) ? (
                  <div className="relative w-full max-w-md h-64">
                    <Image
                      src={getSecureUrl(exScopeData.img)}
                      alt={exScopeData.name}
                      fill
                      className="object-contain rounded-md"
                      priority
                      onError={() => console.error("圖片加載失敗:", exScopeData.img)}
                    />
                    <button
                      onClick={() => handleDownload(exScopeData.img, `${exScopeData.name}.jpg`)}
                      className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                      style={{ position: "relative", zIndex: 10 }}
                    >
                      下載圖片
                    </button>
                    {downloadError && <p className="text-red-500 mt-2">{downloadError}</p>}
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-800">{exScopeData.name}</p>
                    <a
                      href={getSecureUrl(exScopeData.img)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      查看 PDF 文件
                    </a>
                    <button
                      onClick={() => handleDownload(exScopeData.img, `${exScopeData.name}.pdf`)}
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

export default ExScopeLists_Grade_Subject_exscpelists;