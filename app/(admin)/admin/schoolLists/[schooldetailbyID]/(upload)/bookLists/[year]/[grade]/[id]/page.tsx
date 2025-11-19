"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SchoolBookData {
  name: string;
  img?: string;
}

const BookLists_year_grade_by_Id = () => {
  const params = useParams();
  const schoolId = params?.schooldetailbyID as string;
  const yearId = params?.year as string;
  const gradeId = params?.grade as string;
  const bookListById = params?.id as string;

  const [booklistDetail, setBooklistDetail] = useState<SchoolBookData[] | null>(null);
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
        throw new Error(`無法下載文件: ${errorData.error || response.statusText}`);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeFileName = encodeURIComponent(fileName).replace(/%20/g, "_");
      link.href = downloadUrl;
      link.download = safeFileName || (isImage(url) ? "booklist-image.jpg" : "booklist-document.pdf");
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
    if (schoolId && yearId && gradeId && bookListById) {
      const getBooklistDetail = async (
        schoolId: string,
        yearId: string,
        gradeId: string,
        bookListById: string
      ) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `/api/Booklists_detail_data_by_id/${schoolId}/${yearId}/${gradeId}/${bookListById}`,
            {
              cache: "no-store",
              headers: { "Cache-Control": "no-cache" },
            }
          );
          if (!res.ok) {
            throw new Error("無法載入書單詳情");
          }
          const result: SchoolBookData[] = await res.json();
          setBooklistDetail(result);
          console.log("Fetched booklistDetail:", result, "-- End --");
        } catch (err: unknown) {
          console.error("載入錯誤:", err);
          const errorMessage = err instanceof Error ? err.message : "無法載入書單詳情";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      getBooklistDetail(schoolId, yearId, gradeId, bookListById);
    } else {
      setError("無效的學校ID、年份、年級或書單ID");
      setLoading(false);
    }
  }, [schoolId, yearId, gradeId, bookListById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !booklistDetail || booklistDetail.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無書單資料"}</p>
      </div>
    );
  }

  const bookData = booklistDetail[0];
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://billy.ad";

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
        <Link href={`/admin/schoolLists/${schoolId}/bookLists`} className="text-blue-600 hover:text-blue-800">
          書單年份列表
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}`} className="text-blue-600 hover:text-blue-800">
          {yearId}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}/${gradeId}`} className="text-blue-600 hover:text-blue-800">
          {gradeId}
        </Link>
        <span className="mx-2">/</span>
        <span>{bookData.name}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            書單詳情 - {yearId} {gradeMapping[gradeId] || gradeId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${schoolId}/bookLists/upload`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳書單
            </Link>
            <Link
              href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}/${gradeId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回書單列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">書單詳情</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">書單名稱</h3>
              <p className="text-gray-800">{bookData.name}</p>
            </div>
            {bookData.img ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {isImage(bookData.img) ? "書單圖片" : "書單文件"}
                </h3>
                {isImage(bookData.img) ? (
                                    <div className="relative w-full max-w-md h-64">
                  <button
                      onClick={() => {
                        console.log("下載按鈕點擊，URL:", bookData.img);
                        handleDownload(getSecureUrl(bookData.img!), `${bookData.name}.jpg`);
                      }}
                      className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                      style={{ position: "relative", zIndex: 10 }}
                    >
                      下載圖片
                    </button>
                    {downloadError && (
                      <p className="text-red-500 mt-2">{downloadError}</p>
                    )}
                    <div>
                    <Image
                      src={getSecureUrl(bookData.img)}
                      alt={bookData.name}
                      fill
                      className="object-contain rounded-md"
                      priority
                      onError={() => console.error("圖片加載失敗:", bookData.img)}
                    />

                    </div>

                    
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-800">{bookData.name}</p>
                    
                     <button
                      onClick={() => {
                        console.log("下載按鈕點擊，URL:", bookData.img);
                        handleDownload(getSecureUrl(bookData.img!), `${bookData.name}.pdf`);
                      }}
                      className="ml-4 mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                      style={{ position: "relative", zIndex: 10 }}
                    >
                      下載 PDF
                    </button>
                    {downloadError && (
                      <p className="text-red-500 mt-2">{downloadError}</p>
                    )}
                    
                    
                    
                    <a
                      href={getSecureUrl(bookData.img)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      查看 PDF 文件
                    </a>
                   
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">無書單圖片或文件</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLists_year_grade_by_Id;

// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// interface SchoolBookData {
//   name: string;
//   img?: string;
// }

// const BookLists_year_grade_by_Id = () => {
//   const params = useParams();
//   const schoolId = params?.schooldetailbyID as string;
//   const yearId = params?.year as string;
//   const gradeId = params?.grade as string;
//   const bookListById = params?.id as string;

//   const [booklistDetail, setBooklistDetail] = useState<SchoolBookData[] | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

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
//       const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(secureUrl)}`);
//       if (!response.ok) {
//         throw new Error("無法下載圖片");
//       }
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName || "booklist-image.jpg";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("下載圖片失敗:", error);
//       alert("下載圖片失敗，請稍後再試");
//     }
//   };

//   useEffect(() => {
//     if (schoolId && yearId && gradeId && bookListById) {
//       const getBooklistDetail = async (
//         schoolId: string,
//         yearId: string,
//         gradeId: string,
//         bookListById: string
//       ) => {
//         setLoading(true);
//         setError(null);
//         try {
//           const res = await fetch(
//             `/api/Booklists_detail_data_by_id/${schoolId}/${yearId}/${gradeId}/${bookListById}`,
//             {
//               cache: "no-store",
//               headers: { "Cache-Control": "no-cache" },
//             }
//           );
//           if (!res.ok) {
//             throw new Error("無法載入書單詳情");
//           }
//           const result: SchoolBookData[] = await res.json();
//           setBooklistDetail(result);
//           console.log("Fetched booklistDetail:", result, "-- End --");
//         } catch (err: unknown) {
//           console.error("載入錯誤:", err);
//           const errorMessage = err instanceof Error ? err.message : "無法載入書單詳情";
//           setError(errorMessage);
//         } finally {
//           setLoading(false);
//         }
//       };
//       getBooklistDetail(schoolId, yearId, gradeId, bookListById);
//     } else {
//       setError("無效的學校ID、年份、年級或書單ID");
//       setLoading(false);
//     }
//   }, [schoolId, yearId, gradeId, bookListById]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-gray-600 text-lg">正在加載...</p>
//       </div>
//     );
//   }

//   if (error || !booklistDetail || booklistDetail.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無書單資料"}</p>
//       </div>
//     );
//   }

//   const bookData = booklistDetail[0];

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
//         <Link href={`/admin/schoolLists/${schoolId}/bookLists`} className="text-blue-600 hover:text-blue-800">
//           書單年份列表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}`} className="text-blue-600 hover:text-blue-800">
//           {yearId}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}/${gradeId}`} className="text-blue-600 hover:text-blue-800">
//           {gradeId}
//         </Link>
//         <span className="mx-2">/</span>
//         <span>{bookData.name}</span>
//       </nav>
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-[#80A8BD]">
//             書單詳情 - {yearId} {gradeMapping[gradeId] || gradeId}
//           </h1>
//           <div className="flex space-x-4">
//             <Link
//               href={`/admin/schoolLists/${schoolId}/bookLists/upload`}
//               className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//             >
//               上傳書單
//             </Link>
//             <Link
//               href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}/${gradeId}`}
//               className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//             >
//               返回書單列表
//             </Link>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">書單詳情</h2>
//           <div className="space-y-4">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">書單名稱</h3>
//               <p className="text-gray-800">{bookData.name}</p>
//             </div>
//             {bookData.img ? (
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-700">書單圖片</h3>
//                 <div className="relative w-full max-w-md h-64">
//                   <Image
//                     src={bookData.img.replace("http://", "https://")}
//                     alt={bookData.name}
//                     fill
//                     className="object-contain rounded-md"
//                     priority
//                     onError={() => console.error("圖片加載失敗:", bookData.img)}
//                   />
//                 </div>
//                 <button
//                   onClick={() => handleDownload(bookData.img!.replace("http://", "https://"), `${bookData.name}.jpg`)}
//                   className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//                 >
//                   下載圖片
//                 </button>
//               </div>
//             ) : (
//               <p className="text-gray-500">無書單圖片</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookLists_year_grade_by_Id;