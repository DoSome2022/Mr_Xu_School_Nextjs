// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// interface StudentDatailData {
//   name: string;
//   img: string;
//   school: string;
//   grade: string;
//   year: string;
//   quarter: string;
//   subject: string;
//   id: string;
// }

// const subjectMapping: { [key: string]: string } = {
//   math: "數學",
//   english: "英語",
//   science: "科學",
//   chinese: "國語",
//   // 根據 API 返回的科目代碼添加更多映射
// };

// const ExPageLists_Grade_Year_Quarter_Subject_Lists_By_ID = () => {
//   const params = useParams<{
//     parentdetailbyID: string;
//     studentdetailbyID: string;
//     school: string;
//     grade: string;
//     year: string;
//     quarter: string;
//     subject: string;
//     id: string;
//   }>();
//   const ParentID = params?.parentdetailbyID as string;
//   const StudentID = params?.studentdetailbyID as string;
//   const SchoolName = params?.school as string;
//   const Grade = params?.grade as string;
//   const Year = params?.year as string;
//   const Quarter = params?.quarter as string;
//   const Subject = params?.subject ? decodeURIComponent(params.subject) : "";
//   const id = params?.id as string;

//   const [GetStudentExPaperDetailByID, setGetStudentExPaperDetailByID] = useState<StudentDatailData[]>([]);
//   const [error, setError] = useState<string | undefined>("");

//   useEffect(() => {
//     if (StudentID && id) {
//       const getstudentexpaperlist = async (studentID: string, paperId: string) => {
//         try {
//           const res = await fetch(`/api/student/Student_ExPaper_by_id_Lists_by_id/${studentID}/${paperId}`, {
//                 cache: 'no-store',  // 強制不快取，確保每次請求新數據
//                 headers: {
//                     'Cache-Control': 'no-cache',
//                 },
//             });
//           if (!res.ok) {
//             throw new Error(`獲取考試卷詳情失敗: ${res.statusText}`);
//           }
//           const result = await res.json();
//           setGetStudentExPaperDetailByID(result);
//         } catch (error: any) {
//           console.error("錯誤:", error);
//           setError(error.message);
//         }
//       };
//       getstudentexpaperlist(StudentID, id);
//     }
//   }, [StudentID, id]);

//   // 過濾符合條件的考試卷詳情
//   const filteredExPaperDetails = GetStudentExPaperDetailByID.filter(
//     (d) =>
//       d.school === SchoolName &&
//       String(d.grade) === String(Grade) &&
//       d.year === Year &&
//       String(d.quarter) === String(Quarter) &&
//       d.subject === Subject &&
//       d.id === id
//   );

//   if (error) {
//     return (
//       <div className="p-5 max-w-4xl mx-auto">
//         <p className="text-red-500">錯誤: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-5 max-w-4xl mx-auto">
//       {/* 麵包屑導航 */}
//       <nav className="mb-4 text-sm">
//         <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
//           主理員主頁
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/userLists`} className="text-blue-600 hover:text-blue-800">
//           用戶列表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學生列表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           考試卷
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {SchoolName}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {Grade}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {Year}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           第{Quarter}季度
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {subjectMapping[Subject] || Subject}
//         </Link>
//         <span className="mx-2">/</span>
//         <span>{GetStudentExPaperDetailByID[0]?.name || "考試卷詳細資料"}</span>
//       </nav>
//       <h2 className="text-2xl font-bold text-[#80A8BD] mb-6">考試卷詳情</h2>
//       {filteredExPaperDetails.length > 0 ? (
//         <div className="space-y-4">
//           {filteredExPaperDetails.map((d) => (
//             <div key={d.id} className="border border-gray-200 rounded p-4 bg-white shadow-sm">
//               <p className="text-lg font-medium text-[#80A8BD]">{d.name}</p>
//               <div className="mt-4">
//                 <Image
//                   width={500}
//                   height={500}
//                   src={d.img}
//                   alt={d.name || "考試卷圖片"}
//                   className="rounded-md object-cover max-w-full h-auto"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">無符合條件的考試卷詳情</p>
//       )}
//     </div>
//   );
// };

// export default ExPageLists_Grade_Year_Quarter_Subject_Lists_By_ID;


"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface StudentDatailData {
  name: string;
  img: string;
  school: string;
  grade: string;
  year: string;
  quarter: string;
  subject: string;
  id: string;
}

const subjectMapping: { [key: string]: string } = {
  math: "數學",
  english: "英語",
  science: "科學",
  chinese: "國語",
  // 根據 API 返回的科目代碼添加更多映射
};

const ExPageLists_Grade_Year_Quarter_Subject_Lists_By_ID = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
    id: string;
  }>();
  const ParentID = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;
  const SchoolName = params?.school as string;
  const Grade = params?.grade as string;
  const Year = params?.year as string;
  const Quarter = params?.quarter as string;
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";
  const id = params?.id as string;

  const [GetStudentExPaperDetailByID, setGetStudentExPaperDetailByID] = useState<StudentDatailData[]>([]);
  const [error, setError] = useState<string | undefined>("");
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png)$/i.test(url) && !url.startsWith("data:");
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

  useEffect(() => {
    if (StudentID && id) {
      const getstudentexpaperlist = async (studentID: string, paperId: string) => {
        try {
          const res = await fetch(`/api/student/Student_ExPaper_by_id_Lists_by_id/${studentID}/${paperId}`, {
            cache: 'no-store',  // 強制不快取
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          if (!res.ok) {
            throw new Error(`獲取考試卷詳情失敗: ${res.statusText}`);
          }
          const result = await res.json();
          setGetStudentExPaperDetailByID(result);
        } catch (error: any) {
          console.error("錯誤:", error);
          setError(error.message);
        }
      };
      getstudentexpaperlist(StudentID, id);
    }
  }, [StudentID, id]);

  // 過濾符合條件的考試卷詳情
  const filteredExPaperDetails = GetStudentExPaperDetailByID.filter(
    (d) =>
      d.school === SchoolName &&
      String(d.grade) === String(Grade) &&
      d.year === Year &&
      String(d.quarter) === String(Quarter) &&
      d.subject === Subject &&
      d.id === id
  );

  if (error) {
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <p className="text-red-500">錯誤: {error}</p>
      </div>
    );
  }

  console.log("filteredExPaperDetails :" , filteredExPaperDetails , "-- End --")

  return (
    <div className="p-5 max-w-4xl mx-auto">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
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
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試卷
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}`}
          className="text-blue-600 hover:text-blue-800"
        >
          第{Quarter}季度
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {subjectMapping[Subject] || Subject}
        </Link>
        <span className="mx-2">/</span>
        <span>{GetStudentExPaperDetailByID[0]?.name || "考試卷詳細資料"}</span>
      </nav>
      <h2 className="text-2xl font-bold text-[#80A8BD] mb-6">考試卷詳情</h2>
      {filteredExPaperDetails.length > 0 ? (
        <div className="space-y-4">
          {filteredExPaperDetails.map((d) => (
            <div key={d.id} className="border border-gray-200 rounded p-4 bg-white shadow-sm">
              <p className="text-lg font-medium text-[#80A8BD]">{d.name}</p>
              <div className="mt-4">
                {isImage(d.img) ? (
                  <Image
                    width={500}
                    height={500}
                    src={d.img}
                    alt={d.name || "考試卷圖片"}
                    className="rounded-md object-cover max-w-full h-auto"
                  />
                ) : (
                  <div>
                    <p className="text-gray-500 mb-2">PDF 文件預覽</p>
                    <iframe
                      src={d.img}
                      title={d.name}
                      className="w-full h-96 rounded-md"
                    />
                    <button
                      onClick={() => handleDownload(d.img, d.name)}
                      className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                    >
                      下載 PDF
                    </button>
                    {downloadError && <p className="text-red-500 mt-2">{downloadError}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無符合條件的考試卷詳情</p>
      )}
    </div>
  );
};

export default ExPageLists_Grade_Year_Quarter_Subject_Lists_By_ID;