"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';
import Image from 'next/image';


const ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID = () => {
    const params = useParams<{ studentid : string ;}>();

    const StudentID = params?.studentid as string;
    const [ GetStudentExTimeDetailByID , setGetStudentExTimeDetailByID ] = useState<any>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentextimedetailbyid = async (studentdataid: string) => {
                try {
                    const res = await fetch(`/api/Parents_Student/Parents_Student_Lists/${studentdataid}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentExTimeDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentextimedetailbyid(StudentID)
        }
    },[StudentID])
    // 檢查是否為圖片格式的輔助函數
    const isImage = (url: string) => {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
      };
    

    console.log(GetStudentExTimeDetailByID[0])

    return(
        <>
            <span> ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID </span>
            <br />
{GetStudentExTimeDetailByID.map((d:any)=>{
    return(
        <div key={d.id} className="my-2">
          {d.name}
          <br />
          {isImage(d.EX_Time[0]?.img) ? (
            <Image
              src={d.EX_Time[0]?.img}
              width={500}
              height={500}
              alt={d.name}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <a href={`http://localhost:3000${d.EX_Time[0]?.img}`} target={`http://localhost:3000${d.EX_Time[0]?.img}`}  rel="noopener noreferrer">
              查看 PDF 文件
            </a>
          )}
        </div>
    )
})}
        </>
    )
}

export default ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID