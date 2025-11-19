// "use client";

// import useSWR from "swr";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";

// interface SchoolExPageData {
//   name: string;
//   img: string;
//   school_ex_pager_id: string;
//   grade: number;
//   subject: string;
//   year: string;
//   quarter: number;
// }

// const fetcher = (url: string, init?: RequestInit): Promise<SchoolExPageData> =>
//   fetch(url, init).then(async (res) => {
//     if (!res.ok) throw new Error("無法載入考試卷詳情");
//     const result = await res.json();
//     if (Array.isArray(result) && result.length > 0) {
//       return result[0];
//     }
//     throw new Error("無有效考試卷資料");
//   });

// const ExPageLists_grade_year_quarter_subject_expagelists_by_id = () => {
//   const params = useParams();
//   const schoolId = Array.isArray(params?.schooldetailbyID)
//     ? params.schooldetailbyID[0]
//     : params?.schooldetailbyID;
//   const gradeId = Array.isArray(params?.grade) ? params.grade[0] : params?.grade;
//   const yearId = Array.isArray(params?.year) ? params.year[0] : params?.year;
//   const quarterId = Array.isArray(params?.quarter) ? params.quarter[0] : params?.quarter;
//   const subjectId = params?.subject
//     ? Array.isArray(params.subject)
//       ? decodeURIComponent(params.subject[0]).trim()
//       : decodeURIComponent(params.subject).trim()
//     : "";
//   const exPageListId = Array.isArray(params?.id) ? params.id[0] : params?.id;

//   console.log("Params:", { schoolId, gradeId, yearId, quarterId, subjectId, exPageListId });

//   const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";
//   const { data, error, isLoading } = useSWR(
//     schoolId && gradeId && yearId && quarterId && subjectId && exPageListId
//       ? `${apiUrl}/api/Expagelists_detail_data_by_id/${schoolId}/${gradeId}/${yearId}/${quarterId}/${subjectId}/${exPageListId}`
//       : null,
//     fetcher
//   );

//   const gradeMapping: { [key: string]: string } = {
//     "1": "小學1年級",
//     "2": "小學2年級",
//     "3": "小學3年級",
//     "4": "小學4年級",
//     "5": "小學5年級",
//     "6": "小學6年級",
//     "7": "初中1年級",
//     "8": "初中2年級",
//     "9": "初中3年級",
//     "10": "高中1年級",
//     "11": "高中2年級",
//     "12": "高中3年級",
//   };

//   const handleDownload = async (imgUrl: string, fileName: string) => {
//     try {
//       const secureUrl = imgUrl.replace("http://", "https://");
//       const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(secureUrl)}`, {
//         cache: "no-store",
//         headers: { "Cache-Control": "no-cache" },
//       });
//       if (!response.ok) {
//         throw new Error("無法下載圖片");
//       }
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName || "ExPage-image.jpg";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("下載圖片失敗:", error);
//       alert("下載圖片失敗，請稍後再試");
//     }
//   };

//   if (!schoolId || !gradeId || !yearId || !quarterId || !subjectId || !exPageListId) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-red-500 bg-red-100 p-3 rounded-md">
//           無效的學校ID、年級、年份、季度、科目或考試卷ID
//         </p>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-gray-600 text-lg">正在加載...</p>
//       </div>
//     );
//   }

//   if (error || !data) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-red-500 bg-red-100 p-3 rounded-md">
//           {error?.message || "無法載入考試卷詳情"}
//         </p>
//       </div>
//     );
//   }

//   if (
//     data.grade !== Number(gradeId) ||
//     data.quarter !== Number(quarterId) ||
//     data.year !== yearId ||
//     data.subject !== subjectId ||
//     data.school_ex_pager_id !== schoolId
//   ) {
//     console.log("Data mismatch:", {
//       dataGrade: data.grade,
//       gradeId: Number(gradeId),
//       dataQuarter: data.quarter,
//       quarterId: Number(quarterId),
//       dataYear: data.year,
//       yearId,
//       dataSubject: JSON.stringify(data.subject),
//       subjectId: JSON.stringify(subjectId),
//       dataSchoolId: data.school_ex_pager_id,
//       schoolId,
//     });
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-red-500 bg-red-100 p-3 rounded-md">考試卷資料不匹配</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 pt-20">
//       <nav className="mb-4 text-sm">
//         <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
//           主理員主頁
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/schoolLists`} className="text-blue-600 hover:text-blue-800">
//           學枚列表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/schoolLists/${schoolId}`} className="text-blue-600 hover:text-blue-800">
//           學枚資料
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/schoolLists/${schoolId}/expageLists`} className="text-blue-600 hover:text-blue-800">
//           學枚名
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}`} className="text-blue-600 hover:text-blue-800">
//           {gradeId}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}`} className="text-blue-600 hover:text-blue-800">
//           {yearId}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}/${quarterId}`} className="text-blue-600 hover:text-blue-800">
//           {quarterId}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}/${quarterId}/${subjectId}`} className="text-blue-600 hover:text-blue-800">
//           {subjectId}
//         </Link>
//         <span className="mx-2">/</span>
//         <span>{data.name}</span>
//       </nav>
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-[#80A8BD]">
//             考試卷詳情 - {gradeMapping[gradeId] || gradeId} {yearId} 季度 {quarterId} {subjectId}
//           </h1>
//           <div className="flex space-x-4">
//             <Link
//               href={`/admin/schoolLists/${schoolId}/expageLists/upload`}
//               className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//             >
//               上傳考試卷
//             </Link>
//             <Link
//               href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}/${quarterId}/${subjectId}`}
//               className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//             >
//               返回考試卷列表
//             </Link>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">{data.name}</h2>
//           <div className="space-y-4">
//             <p className="text-gray-800">
//               <span className="font-semibold">年級:</span> {gradeMapping[gradeId] || gradeId}
//             </p>
//             <p className="text-gray-800">
//               <span className="font-semibold">年份:</span> {data.year}
//             </p>
//             <p className="text-gray-800">
//               <span className="font-semibold">季度:</span> {data.quarter}
//             </p>
//             <p className="text-gray-800">
//               <span className="font-semibold">科目:</span> {data.subject}
//             </p>
//             {data.img ? (
//               <div className="relative w-full max-w-md h-64">
//                 <Image
//                   src={data.img.replace("http://", "https://")}
//                   alt={data.name}
//                   fill
//                   className="object-contain rounded-md"
//                   priority
//                   onError={() => console.error("圖片加載失敗:", data.img)}
//                 />
//                 <button
//                   onClick={() => handleDownload(data.img.replace("http://", "https://"), `${data.name}.jpg`)}
//                   className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//                 >
//                   下載圖片
//                 </button>
//               </div>
//             ) : (
//               <p className="text-gray-500">無圖片</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExPageLists_grade_year_quarter_subject_expagelists_by_id;


"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface SchoolExPageData {
  name: string;
  img: string;
  school_ex_pager_id: string;
  grade: number;
  subject: string;
  year: string;
  quarter: number;
}

const fetcher = (url: string, init?: RequestInit): Promise<SchoolExPageData> =>
  fetch(url, init).then(async (res) => {
    if (!res.ok) throw new Error("無法載入考試卷詳情");
    const result = await res.json();
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    }
    throw new Error("無有效考試卷資料");
  });

const ExPageLists_grade_year_quarter_subject_expagelists_by_id = () => {
  const params = useParams();
  const schoolId = Array.isArray(params?.schooldetailbyID)
    ? params.schooldetailbyID[0]
    : params?.schooldetailbyID;
  const gradeId = Array.isArray(params?.grade) ? params.grade[0] : params?.grade;
  const yearId = Array.isArray(params?.year) ? params.year[0] : params?.year;
  const quarterId = Array.isArray(params?.quarter) ? params.quarter[0] : params?.quarter;
  const subjectId = params?.subject
    ? Array.isArray(params.subject)
      ? decodeURIComponent(params.subject[0]).trim()
      : decodeURIComponent(params.subject).trim()
    : "";
  const exPageListId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  console.log("Params:", { schoolId, gradeId, yearId, quarterId, subjectId, exPageListId });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "https://billy.ad";
  const { data, error, isLoading } = useSWR(
    schoolId && gradeId && yearId && quarterId && subjectId && exPageListId
      ? `${apiUrl}/api/Expagelists_detail_data_by_id/${schoolId}/${gradeId}/${yearId}/${quarterId}/${subjectId}/${exPageListId}`
      : null,
    fetcher
  );

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

  const handleDownload = async (url: string, fileName: string) => {
    setDownloadError(null);
    try {
      const secureUrl = url.replace("http://", "https://");
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
      link.download = safeFileName || (isImage(url) ? "ExPage-image.jpg" : "ExPage-document.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("下載文件失敗:", error);
      setDownloadError(error instanceof Error ? error.message : "下載文件失敗，請稍後再試");
    }
  };

  if (!schoolId || !gradeId || !yearId || !quarterId || !subjectId || !exPageListId) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">
          無效的學校ID、年級、年份、季度、科目或考試卷ID
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">
          {error?.message || "無法載入考試卷詳情"}
        </p>
      </div>
    );
  }

  if (
    data.grade !== Number(gradeId) ||
    data.quarter !== Number(quarterId) ||
    data.year !== yearId ||
    data.subject !== subjectId ||
    data.school_ex_pager_id !== schoolId
  ) {
    console.log("Data mismatch:", {
      dataGrade: data.grade,
      gradeId: Number(gradeId),
      dataQuarter: data.quarter,
      quarterId: Number(quarterId),
      dataYear: data.year,
      yearId,
      dataSubject: JSON.stringify(data.subject),
      subjectId: JSON.stringify(subjectId),
      dataSchoolId: data.school_ex_pager_id,
      schoolId,
    });
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">考試卷資料不匹配</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <nav className="mb-4 text-sm">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學枚列表
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${schoolId}`} className="text-blue-600 hover:text-blue-800">
          學枚資料
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${schoolId}/expageLists`} className="text-blue-600 hover:text-blue-800">
          學枚名
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}`} className="text-blue-600 hover:text-blue-800">
          {gradeId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}`} className="text-blue-600 hover:text-blue-800">
          {yearId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}/${quarterId}`} className="text-blue-600 hover:text-blue-800">
          {quarterId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}/${quarterId}/${subjectId}`} className="text-blue-600 hover:text-blue-800">
          {subjectId}
        </Link>
        <span className="mx-2">/</span>
        <span>{data.name}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            考試卷詳情 - {gradeMapping[gradeId] || gradeId} {yearId} 季度 {quarterId} {subjectId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${schoolId}/expageLists/upload`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳考試卷
            </Link>
            <Link
              href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}/${quarterId}/${subjectId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回考試卷列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{data.name}</h2>
          <div className="space-y-4">
            <p className="text-gray-800">
              <span className="font-semibold">年級:</span> {gradeMapping[gradeId] || gradeId}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">年份:</span> {data.year}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">季度:</span> {data.quarter}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">科目:</span> {data.subject}
            </p>
            {data.img ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {isImage(data.img) ? "考試卷圖片" : "考試卷文件"}
                </h3>
                {isImage(data.img) ? (
                  <div className="relative w-full max-w-md h-64">
                    <Image
                      src={data.img.replace("http://", "https://")}
                      alt={data.name}
                      fill
                      className="object-contain rounded-md"
                      priority
                      onError={() => console.error("圖片加載失敗:", data.img)}
                    />
                    <button
                      onClick={() => handleDownload(data.img.replace("http://", "https://"), `${data.name}.jpg`)}
                      className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                      style={{ position: "relative", zIndex: 10 }}
                    >
                      下載圖片
                    </button>
                    {downloadError && <p className="text-red-500 mt-2">{downloadError}</p>}
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-800">{data.name}</p>
                    <a
                      href={data.img.replace("http://", "https://")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      查看 PDF 文件
                    </a>
                    <button
                      onClick={() => handleDownload(data.img.replace("http://", "https://"), `${data.name}.pdf`)}
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

export default ExPageLists_grade_year_quarter_subject_expagelists_by_id;