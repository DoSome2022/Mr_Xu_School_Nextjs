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

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

// 定義 Score 物件的介面
interface Score {
  img: string;
  // 添加其他可能的字段，例如 id、createdAt 等
}

interface ScoreListsByID {
  id: string; // 添加 id
  name: string;
  Score: Score[]; // 添加 Score 陣列，取代 img
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
  const { data: session, status } = useSession();
  const router = useRouter();

  const studentId = params?.studentid as string;
  const parentId = params?.parentId as string;
  const grade = params?.grade as string;
  const year = params?.year as string;
  const quarter = params?.quarter as string;
  const subject = params?.subject as string;
  const id = params?.id as string;

  const [GetStudentScoreDetailByID, setGetStudentScoreDetailByID] = useState<
    ScoreListsByID[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  // 身份驗證檢查
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/stafflogin");
    } else if (status === "authenticated" && session?.user.id !== parentId) {
      setError("無權訪問此頁面");
    }
  }, [status, session, parentId, router]);

  // 獲取成績數據
  useEffect(() => {
    if (studentId && id) {
      const getStudentScoreDetailById = async (studentId: string) => {
        try {
          const res = await fetch(
            `/api/Parents_Student/Parents_Student_Lists/${studentId}?grade=${grade}&year=${year}&quarter=${quarter}&subject=${subject}&id=${id}`,
            { cache: "no-store" }
          );
          if (!res.ok) {
            throw new Error("無法連線至伺服器！");
          }
          const result = await res.json();
          setGetStudentScoreDetailByID(result);
        } catch (error: any) {
          console.error("獲取學生成績詳情失敗:", error.message);
          setError("無法載入成績數據，請稍後重試");
        }
      };
      getStudentScoreDetailById(studentId);
    }
  }, [studentId, id, grade, year, quarter, subject]);

  // 檢查是否為圖片格式的輔助函數
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  if (status === "loading") {
    return <div>載入中...</div>;
  }

  if (error) {
    return (
      <>
        <span>ScoreLists_Year_Quarter_Subject_List_By_ID</span>
        <br />
        <div className="text-red-500">{error}</div>
      </>
    );
  }

  if (GetStudentScoreDetailByID.length === 0) {
    return (
      <>
        <span>ScoreLists_Year_Quarter_Subject_List_By_ID</span>
        <br />
        <div>暫無成績資料</div>
      </>
    );
  }

  return (
    <>
      <span>ScoreLists_Year_Quarter_Subject_List_By_ID</span>
      <br />
      {GetStudentScoreDetailByID.map((d) => {
        return (
          <div key={d.id} className="my-2">
            {d.name}
            <br />
            {d.Score.length > 0 && d.Score[0]?.img && isImage(d.Score[0].img) ? (
              <Image
                src={d.Score[0].img}
                width={500}
                height={500}
                alt={d.name}
                style={{ objectFit: "contain" }}
              />
            ) : d.Score.length > 0 && d.Score[0]?.img ? (
              <a
                href={d.Score[0].img}
                target="_blank"
                rel="noopener noreferrer"
              >
                查看 PDF 文件
              </a>
            ) : (
              <span>無可用文件</span>
            )}
          </div>
        );
      })}
    </>
  );
};

export default ScoreLists_Year_Quarter_Subject_List_By_ID;