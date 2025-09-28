"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface StudentDetailData {
  name: string;
  img: string;
  school: string;
  grade: string;
  year: string;
  id: string;
}

const Student_BookLists_School_Year_Grade_Id_Detailbysupadmin = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    year: string;
    grade: string;
    id: string;
    supadminid: string;
  }>();
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school;
  const Year = params?.year;
  const Grade = params?.grade;
  const id = params?.id;
  const supadminId = params?.supadminid;

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Year || !Grade || !id) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentBookListsDetailByID, setGetStudentBookListsDetailByID] = useState<StudentDetailData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    const getstudentbooklistsdetailbyid = async (studentId: string, bookId: string) => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/student/Student_Booklist_by_id_Lists_by_id/${studentId}/${bookId}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
        if (!Array.isArray(result)) {
          throw new Error("無效的書單詳情格式");
        }
        setGetStudentBookListsDetailByID(result);
      } catch (err: any) {
        setError(err.message || "無法獲取書單詳情");
      } finally {
        setIsLoading(false);
      }
    };

    if (StudentID && id) {
      getstudentbooklistsdetailbyid(StudentID, id);
    }
  }, [StudentID, id]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("Params:", params);
    console.log("GetStudentBookListsDetailByID:", GetStudentBookListsDetailByID);
  }

  // 過濾書單詳情
  const filteredDetails = GetStudentBookListsDetailByID.filter(
    (d) => d.school === SchoolName && d.year === Year && d.grade === Grade && d.id === id
  );

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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生資料
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          書單
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${Grade}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Grade}
        </Link>
        <span className="mx-2">/</span>
        <span>書單詳情</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} {Year} {Grade} 書單詳情
      </h2>

      {isLoading && <div className="text-gray-600 p-4">載入中...</div>}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {/* {!isLoading && !error && filteredDetails.length === 0 && (
        <div className="text-gray-600 p-4">無書單詳情</div>
      )}

      <div className="flex flex-col space-y-6">
        {filteredDetails.map((d) => (
          <div key={d.id} className="flex flex-col md:flex-row md:space-x-6">
            <div className="relative w-full md:w-1/2 h-64">
              <Image
                src={d.img}
                alt={d.name}
                fill
                className="object-contain max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div className="text-blue-600 font-medium">{d.name}</div>
          </div>
        ))}
      </div> */}
      {filteredDetails.length > 0 ? (
        <div className="space-y-4">
          {filteredDetails.map((d) => (
            <div
              key={d.id}
              className="border border-gray-200 rounded p-4 bg-white shadow-sm"
            >
              <p className="text-lg font-medium text-[#80A8BD]">{d.name}</p>
              <div className="mt-4">
                <Image
                  width={500}
                  height={500}
                  src={d.img}
                  alt={d.name || "書單圖片"}
                  className="rounded-md object-cover max-w-full h-auto"
                />
              </div>
                  <button
                  onClick={() => handleDownload(d.img, `${d.name}.jpg`)}
                  className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                >
                  下載圖片
                </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無符合條件的書單詳情</p>
      )}

    </div>
  );
};

export default Student_BookLists_School_Year_Grade_Id_Detailbysupadmin;