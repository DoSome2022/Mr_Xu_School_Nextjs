"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SchoolBookData {
  name: string;
  img: string;
}

const BookLists_year_grade_by_Idbysupadmin = () => {
  const params = useParams<{
    year: string;
    grade: string;
    id: string;
    schooldetailbyID: string;
    supadminid: string;
  }>();
  const SchoolId = params?.schooldetailbyID as string;
  const yearId = params?.year as string;
  const GradeId = params?.grade as string;
  const BookListById = params?.id as string;
  const supadminid = params?.supadminid as string;

  const [GetBooklistsDetailDataById, setGetBooklistsDetailDataById] = useState<
    SchoolBookData[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // 下載圖片的功能
  const handleDownload = async (imgUrl: string, fileName: string) => {
    try {
    //   const response = await fetch(imgUrl, { mode: "cors" });
    const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(imgUrl)}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
      if (!response.ok) {
        throw new Error("無法下載圖片");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "booklist-image.jpg"; // 使用書單名稱或默認文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("下載圖片失敗:", error);
      alert("下載圖片失敗，請稍後再試");
    }
  };

  useEffect(() => {
    if (SchoolId && yearId && GradeId && BookListById) {
      const getBooklistsDetailById = async (
        SchoolId: string,
        yearId: string,
        GradeId: string,
        BookListById: string
      ) => {
        try {
          setLoading(true);
          const res = await fetch(
            `/api/Booklists_detail_data_by_id/${SchoolId}/${yearId}/${GradeId}/${BookListById}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            }
          );
          if (!res.ok) {
            throw new Error("無法獲取書單資料！");
          }
          const result = await res.json();
          setGetBooklistsDetailDataById(result);
          setError(null);
        } catch (error: any) {
          console.error("獲取書單詳情失敗:", error);
          setError(error.message || "無法獲取書單資料");
        } finally {
          setLoading(false);
        }
      };
      getBooklistsDetailById(SchoolId, yearId, GradeId, BookListById);
    } else {
      setError("缺少必要的參數");
      setLoading(false);
    }
  }, [SchoolId, yearId, GradeId, BookListById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !GetBooklistsDetailDataById || GetBooklistsDetailDataById.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">
          {error || "無書單資料"}
        </p>
      </div>
    );
  }

  const bookListById = GetBooklistsDetailDataById[0];

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
                      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminid}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminid}/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學枚列表
        </Link>
        <span className="mx-2">/</span>
            <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}`} className="text-blue-600 hover:text-blue-800">
          學枚資料
        </Link>
        <span className="mx-2">/</span>
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists`} className="text-blue-600 hover:text-blue-800">
          書單年份列表
        </Link>
        <span className="mx-2">/</span>
                
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/${yearId}`} className="text-blue-600 hover:text-blue-800">
          {yearId}
        </Link>

        <span className="mx-2">/</span>
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/${yearId}/${GradeId}`} className="text-blue-600 hover:text-blue-800">
          {GradeId}
        </Link>

        <span className="mx-2">/</span>
        <span>{bookListById.name}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            書單詳情 - {yearId} {gradeMapping[GradeId] || GradeId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/${yearId}/${GradeId}`}
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
              <p className="text-gray-800">{bookListById.name}</p>
            </div>
            {bookListById.img ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">書單圖片</h3>
                <div className="relative w-full max-w-md h-64">
                  <Image
                    src={bookListById.img}
                    alt={bookListById.name}
                    fill
                    className="object-contain rounded-md"
                    priority
                  />
                </div>
                <button
                  onClick={() => handleDownload(bookListById.img, `${bookListById.name}.jpg`)}
                  className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                >
                  下載圖片
                </button>
              </div>
            ) : (
              <p className="text-gray-500">無書單圖片</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLists_year_grade_by_Idbysupadmin;