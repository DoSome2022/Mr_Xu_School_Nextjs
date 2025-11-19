// "use client";

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// interface ScoreListsByID{
//     name : string;
//     img: string;
// }

// const ScoreLists_Year_Quarter_Subject_List_By_ID = () => {
//     const params = useParams<{ studentid : string ;}>();

//     const StudentID = params?.studentid as string;

//     const [ GetStudentScoreDetailByID , setGetStudentScoreDetailByID] = useState<ScoreListsByID[]>([]);

//     useEffect(()=>{
//         if(StudentID){
//             const getstudentscoredetailbyid = async (StudentID: string) => {
//                 try {
//                     const res = await fetch(`/api/Parents_Student/Parents_Student_Lists/${StudentID}`);
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentScoreDetailByID(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentscoredetailbyid(StudentID)
//         }
//     },[StudentID])

//         // 檢查是否為圖片格式的輔助函數
//         const isImage = (url: string) => {
//             return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
//           };
        
//     console.log(GetStudentScoreDetailByID[0])

//     return(
//         <>
//             <span> ScoreLists_Year_Quarter_Subject_List_By_ID </span>
//             <br />
// {GetStudentScoreDetailByID.map((d)=>{
//     return(
//         <div key={d.id} className="my-2">
//           {d.name}
//           <br />
//           {isImage(d.Score[0]?.img) ? (
//             <Image
//               src={d.Score[0]?.img}
//               width={500}
//               height={500}
//               alt={d.name}
//               style={{ objectFit: "contain" }}
//             />
//           ) : (
//             <a href={`http://localhost:3000${d.Score[0]?.img}`} target={`http://localhost:3000${d.Score[0]?.img}`}  rel="noopener noreferrer">
//               查看 PDF 文件
//             </a>
//           )}
//         </div>
//     )
// })}
//         </>
//     )
// }

// export default ScoreLists_Year_Quarter_Subject_List_By_ID

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface ScoreListsByID {
  id: string;
  name: string;
  year: string;
  grade: number;
  quarter: number;
  subject: string;
  school: string;
  score: number;
  img: string; // 直接使用 img 欄位，匹配 API 回傳數據
}

const ScoreLists_Year_Quarter_Subject_List_By_ID = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
    id: string;
  }>();

  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const Grade = params?.grade as string;
  const Year = params?.year as string;
  const Quarter = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";
  const Id = params?.id as string;

  // 驗證路由參數
  if (!ParentID || !StudentID || !Grade || !Year || !Quarter || !SubjectId || !Id) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentScoreDetailByID, setGetStudentScoreDetailByID] = useState<ScoreListsByID[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 獲取成績數據
  useEffect(() => {
    if (Id) {
      const getStudentScoreDetailById = async (id: string) => {
        try {
          const res = await fetch(`/api/student/Student_Score_by_id_Lists_by_id/${StudentID}/${id}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error(`無法連線：${res.statusText}`);
          }
          const result = await res.json();
          if (!Array.isArray(result)) {
            throw new Error("無效的資料格式");
          }
          // 確保 img 使用 HTTPS
          const sanitizedResult = result.map((item: ScoreListsByID) => ({
            ...item,
            img: item.img.replace(/^http:/, "https:"),
          }));
          setGetStudentScoreDetailByID(sanitizedResult);
        } catch (error) {
          console.error("獲取成績詳情失敗:", error);
          setError("無法載入成績詳情，請稍後重試");
          toast.error("無法載入成績詳情，請稍後重試");
        }
      };
      getStudentScoreDetailById(Id);
    }
  }, [Id, StudentID]);

  // 檢查是否為圖片格式的輔助函數
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("params:", params);
    console.log("GetStudentScoreDetailByID:", GetStudentScoreDetailByID, "-- END --");
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* 麵包屑導航，採用 navbar 風格 */}
      <nav className="flex items-center justify-between bg-gray-900 p-4 shadow-md">
        <div className="flex flex-row gap-6">
          <Link
            href={`/parent/${ParentID}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            苜頁
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            學生資料
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/scoreLists`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            成績列表
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/scoreLists/${Grade}/${Year}/${Quarter}/${encodeURIComponent(SubjectId)}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            {Year} {Grade} 第{Quarter}季 {SubjectId}
          </Link>
          <span className="text-white text-lg font-medium">成績詳情</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          成績詳情 - {Year} {Grade} 第{Quarter}季 {SubjectId}
        </h2>

        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          {error ? (
            <div className="text-red-400 p-4 rounded-lg bg-red-900 bg-opacity-20">
              {error}
            </div>
          ) : GetStudentScoreDetailByID.length === 0 ? (
            <div className="text-gray-300 p-4">無成績詳情資料</div>
          ) : (
            GetStudentScoreDetailByID.map((d) => (
              <div key={d.id} className="space-y-4">
                <h3 className="text-xl font-medium text-white">{d.name}</h3>
                <div className="text-gray-300 space-y-1">
                  <p>學校：{d.school}</p>
                  <p>學年：{d.year}</p>
                  <p>年級：{d.grade}</p>
                  <p>季度：第{d.quarter}季</p>
                  <p>科目：{d.subject}</p>
                  <p>分數：{d.score}</p>
                </div>
                {d.img ? (
                  isImage(d.img) ? (
                    <div className="relative w-full max-w-md">
                      <Image
                        src={d.img}
                        width={500}
                        height={500}
                        alt={d.name}
                        className="rounded-lg object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <a
                        href={d.img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
                      >
                        查看 PDF 文件
                      </a>
                      <a
                        href={d.img}
                        download={d.name + ".pdf"}
                        className="text-white text-lg font-medium bg-blue-600 hover:bg-blue-500 transition-colors duration-200 px-4 py-2 rounded-lg"
                        onClick={() => toast.success("文件下載已啟動")}
                      >
                        下載 PDF 文件
                      </a>
                    </div>
                  )
                ) : (
                  <span className="text-gray-300">無可用文件</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreLists_Year_Quarter_Subject_List_By_ID;