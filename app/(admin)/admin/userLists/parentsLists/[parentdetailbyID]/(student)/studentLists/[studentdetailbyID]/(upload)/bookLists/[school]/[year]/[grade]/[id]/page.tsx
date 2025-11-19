// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// interface StudentDetailData {
//   name: string;
//   img: string;
//   school: string;
//   grade: string;
//   year: string;
//   id: string;
// }

// const Student_BookLists_School_Year_Grade_Id_Detail = () => {
//   const params = useParams<{
//     parentdetailbyID: string;
//     studentdetailbyID: string;
//     school: string;
//     year: string;
//     grade: string;
//     id: string;
//   }>();
//   const ParentID = params?.parentdetailbyID as string;
//   const StudentID = params?.studentdetailbyID as string;
//   const SchoolName = params?.school as string;
//   const Year = params?.year as string;
//   const Grade = params?.grade as string;
//   const id = params?.id as string;

//   const [GetStudentBookListsDetailByID, setGetStudentBookListsDetailByID] = useState<
//     StudentDetailData[]
//   >([]);

//   useEffect(() => {
//     if (StudentID && id) {
//       const getstudentbooklistsdetailbyid = async (studentID: string, bookId: string) => {
//         try {
//           const res = await fetch(
//             `/api/student/Student_Booklist_by_id_Lists_by_id/${studentID}/${bookId}`, {
//                 cache: 'no-store',  // 強制不快取，確保每次請求新數據
//                 headers: {
//                     'Cache-Control': 'no-cache',
//                 },
//             }
//           );
//           if (!res.ok) {
//             throw new Error(`獲取書單詳情失敗: ${res.statusText}`);
//           }
//           const result = await res.json();
//           setGetStudentBookListsDetailByID(result);
//         } catch (error) {
//           console.error("錯誤:", error);
//           alert("無法獲取書單詳情，請稍後重試");
//         }
//       };
//       getstudentbooklistsdetailbyid(StudentID, id);
//     }
//   }, [StudentID, id]);

//   // 過濾符合條件的書單數據
//   const filteredBookDetails = GetStudentBookListsDetailByID.filter(
//     (d) => d.school === SchoolName && d.year === Year && String(d.grade) === String(Grade) && d.id === id
//   );

//   console.log("filteredBookDetails :", filteredBookDetails , "-- End --")


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
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           書單
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {SchoolName}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {Year}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${Grade}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {Grade}
//         </Link>
//         <span className="mx-2">/</span>
//         <span>書單詳情</span>
//       </nav>
//       <h2 className="text-2xl font-bold text-[#80A8BD] mb-6">書單詳情</h2>
//       {filteredBookDetails.length > 0 ? (
//         <div className="space-y-4">
//           {filteredBookDetails.map((d) => (
//             <div
//               key={d.id}
//               className="border border-gray-200 rounded p-4 bg-white shadow-sm"
//             >
//               <p className="text-lg font-medium text-[#80A8BD]">{d.name}</p>
//               <div className="mt-4">
//                 <Image
//                   width={500}
//                   height={500}
//                   src={d.img}
//                   alt={d.name || "書單圖片"}
//                   className="rounded-md object-cover max-w-full h-auto"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">無符合條件的書單詳情</p>
//       )}
//     </div>
//   );
// };

// export default Student_BookLists_School_Year_Grade_Id_Detail;

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface StudentDetailData {
  name: string;
  img: string;
  school: string;
  grade: string;
  year: string;
  id: string;
}

const Student_BookLists_School_Year_Grade_Id_Detail = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    year: string;
    grade: string;
    id: string;
  }>();
  const ParentID = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;
  const SchoolName = params?.school as string;
  const Year = params?.year as string;
  const Grade = params?.grade as string;
  const id = params?.id as string;

  const [studentBookData, setStudentBookData] = useState<StudentDetailData | null>(null);
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
    return /\.(jpg|jpeg|png)$/i.test(url) && !url.startsWith("data:");
  };

  const getSecureUrl = (img: string) => {
    if (img.startsWith("data:")) {
      throw new Error("無效的文件 URL：Base64 字串不支援直接下載");
    }
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
      const getstudentbooklistsdetailbyid = async (studentID: string, bookId: string) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `/api/student/Student_Booklist_by_id_Lists_by_id/${studentID}/${bookId}`,
            {
              cache: "no-store",
              headers: { "Cache-Control": "no-cache" },
            }
          );
          if (!res.ok) {
            throw new Error(`獲取書單詳情失敗: ${res.statusText}`);
          }
          const result: StudentDetailData[] = await res.json();
          if (result.length === 0) {
            throw new Error("無書單資料");
          }
          setStudentBookData(result[0]);
          console.log("Fetched StudentBookListDetail:", result, "-- End --");
        } catch (err: unknown) {
          console.error("載入錯誤:", err);
          const errorMessage = err instanceof Error ? err.message : "無法載入書單詳情";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      getstudentbooklistsdetailbyid(StudentID, id);
    } else {
      setError("無效的學生ID或書單ID");
      setLoading(false);
    }
  }, [StudentID, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !studentBookData) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無書單資料"}</p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
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
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          書單
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${Grade}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {gradeMapping[Grade] || Grade}
        </Link>
        <span className="mx-2">/</span>
        <span>{studentBookData.name}</span>
      </nav>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#80A8BD]">
          書單詳情 - {gradeMapping[Grade] || Grade} {Year} {SchoolName}
        </h2>
        <div className="flex space-x-4">
          <Link
            href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/upload`}
            className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            上傳書單
          </Link>
          <Link
            href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${Grade}`}
            className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            返回書單列表
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">書單詳情</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-700">書單名稱</h4>
            <p className="text-gray-800">{studentBookData.name}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700">學校</h4>
            <p className="text-gray-800">{SchoolName}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700">年級</h4>
            <p className="text-gray-800">{gradeMapping[Grade] || Grade}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700">學年</h4>
            <p className="text-gray-800">{Year}</p>
          </div>
          {studentBookData.img ? (
            <div>
              <h4 className="text-lg font-semibold text-gray-700">
                {isImage(studentBookData.img) ? "書單圖片" : "書單文件"}
              </h4>
              {isImage(studentBookData.img) ? (
                <div className="relative w-full max-w-md h-64">
                  <Image
                    src={getSecureUrl(studentBookData.img)}
                    alt={studentBookData.name}
                    fill
                    className="object-contain rounded-md"
                    priority
                    onError={() => console.error("圖片加載失敗:", studentBookData.img)}
                  />
                  <button
                    onClick={() => handleDownload(studentBookData.img, studentBookData.name)}
                    className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    下載圖片
                  </button>
                  {downloadError && <p className="text-red-500 mt-2">{downloadError}</p>}
                </div>
              ) : (
                <div>
                  <p className="text-gray-800">{studentBookData.name}</p>
                  <a
                    href={getSecureUrl(studentBookData.img)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    查看 PDF 文件
                  </a>
                  <button
                    onClick={() => handleDownload(studentBookData.img, studentBookData.name)}
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

export default Student_BookLists_School_Year_Grade_Id_Detail;