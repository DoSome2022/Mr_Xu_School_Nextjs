// "use client";

// import { useParams } from 'next/navigation';
// // import Link from "next/link";
// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// interface ExTimeListsByIdData {
//   id: string;
//   img: string;
//   name: string;
//   year: string;
//   grade : number;
//   quarter : number;
// }

// const ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID = () => {
//     const params = useParams<{ studentid : string ; id:string}>();

//     const StudentID = params?.studentid as string;
//     const Id = params?.id as string;


//     const [ GetStudentExTimeDetailByID , setGetStudentExTimeDetailByID ] = useState<ExTimeListsByIdData[]>([]);

//     useEffect(()=>{
//         if(Id){
//             const getstudentextimedetailbyid = async (studentdataid: string) => {
//                 try {
//                     const res = await fetch(`/api/Parents_Student/Parents_Student_ExTime_by_id_Lists/${studentdataid}`);
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentExTimeDetailByID(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentextimedetailbyid(Id)
//         }
//     },[Id])
//     // 檢查是否為圖片格式的輔助函數
//     const isImage = (url: string) => {
//         return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
//       };
    

//     console.log(GetStudentExTimeDetailByID[0])

//     return(
//         <>
//             <span> ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID </span>
//             <br />
// {GetStudentExTimeDetailByID.map((d)=>{
//     return(
//         <div key={d.id} className="my-2">
//           {d.name}
//           <br />
//           {isImage(d.EX_Time[0]?.img) ? (
//             <Image
//               src={d.EX_Time[0]?.img}
//               width={500}
//               height={500}
//               alt={d.name}
//               style={{ objectFit: "contain" }}
//             />
//           ) : (
//             <a href={`http://localhost:3000${d.EX_Time[0]?.img}`} target={`http://localhost:3000${d.EX_Time[0]?.img}`}  rel="noopener noreferrer">
//               查看 PDF 文件
//             </a>
//           )}
//         </div>
//     )
// })}
//         </>
//     )
// }

// export default ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

// 定義 EX_Time 物件的介面
interface ExTime {
  img: string;
  // 添加其他可能的字段，例如 id、createdAt 等
}

interface ExTimeListsByIdData {
  id: string;
  name: string;
  year: string;
  grade: number;
  quarter: number;
  EX_Time: ExTime[]; // 添加 EX_Time 陣列
}

const ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID = () => {
  const params = useParams<{ studentid: string; id: string }>();

  const StudentID = params?.studentid as string;
  const Id = params?.id as string;

  const [GetStudentExTimeDetailByID, setGetStudentExTimeDetailByID] = useState<
    ExTimeListsByIdData[]
  >([]);

  useEffect(() => {
    if (Id) {
      const getstudentextimedetailbyid = async (studentdataid: string) => {
        try {
          const res = await fetch(
            `/api/Parents_Student/Parents_Student_ExTime_by_id_Lists/${studentdataid}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            }
          );
          if (!res.ok) {
            throw new Error("無法連線至伺服器！");
          }
          const result = await res.json();
          setGetStudentExTimeDetailByID(result);
        } catch (error) {
          console.error("獲取學生額外時間詳情失敗:", error);
        }
      };
      getstudentextimedetailbyid(Id);
    }
  }, [Id]);

  // 檢查是否為圖片格式的輔助函數
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  // 處理空數據
  if (GetStudentExTimeDetailByID.length === 0) {
    return (
      <>
        <span>ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID</span>
        <br />
        <div>暫無資料</div>
      </>
    );
  }

  return (
    <>
      <span>ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID</span>
      <br />
      {GetStudentExTimeDetailByID.map((d) => {
        return (
          <div key={d.id} className="my-2">
            {d.name}
            <br />
            {d.EX_Time.length > 0 && d.EX_Time[0]?.img && isImage(d.EX_Time[0].img) ? (
              <Image
                src={d.EX_Time[0].img}
                width={500}
                height={500}
                alt={d.name}
                style={{ objectFit: "contain" }}
              />
            ) : d.EX_Time.length > 0 && d.EX_Time[0]?.img ? (
              <a
                href={d.EX_Time[0].img}
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

export default ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID;