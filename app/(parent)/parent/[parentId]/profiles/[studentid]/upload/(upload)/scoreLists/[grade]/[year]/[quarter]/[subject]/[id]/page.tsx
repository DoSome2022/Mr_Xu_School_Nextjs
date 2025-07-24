"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ScoreListsByID{
    name : string;
    img: string;
}

const ScoreLists_Year_Quarter_Subject_List_By_ID = () => {
    const params = useParams<{ studentid : string ;}>();

    const StudentID = params?.studentid as string;

    const [ GetStudentScoreDetailByID , setGetStudentScoreDetailByID] = useState<ScoreListsByID[]>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentscoredetailbyid = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/Parents_Student/Parents_Student_Lists/${StudentID}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentScoreDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentscoredetailbyid(StudentID)
        }
    },[StudentID])

        // 檢查是否為圖片格式的輔助函數
        const isImage = (url: string) => {
            return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
          };
        
    console.log(GetStudentScoreDetailByID[0])

    return(
        <>
            <span> ScoreLists_Year_Quarter_Subject_List_By_ID </span>
            <br />
{GetStudentScoreDetailByID.map((d)=>{
    return(
        <div key={d.id} className="my-2">
          {d.name}
          <br />
          {isImage(d.Score[0]?.img) ? (
            <Image
              src={d.Score[0]?.img}
              width={500}
              height={500}
              alt={d.name}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <a href={`http://localhost:3000${d.Score[0]?.img}`} target={`http://localhost:3000${d.Score[0]?.img}`}  rel="noopener noreferrer">
              查看 PDF 文件
            </a>
          )}
        </div>
    )
})}
        </>
    )
}

export default ScoreLists_Year_Quarter_Subject_List_By_ID