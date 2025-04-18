"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from 'next/image';


const ExPageLists_Grade_Year_Quarter_Subject_Lists_By_ID = () => {
    const params = useParams<{ studentid : string ; }>();
    const StudentID = params?.studentid as string;


    const [ GetStudentExPaperDetailByID , setGetStudentExPaperDetailByID ] = useState<any>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentexpaperlist = async (StudentID: string) => {
                try {
        const res = await fetch(`/api/Parents_Student/Parents_Student_Lists/${StudentID}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentExPaperDetailByID(result);
                                     
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentexpaperlist(StudentID)
        }
    },[StudentID])

      // 檢查是否為圖片格式的輔助函數
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

    console.log(GetStudentExPaperDetailByID[0])
   
    return(
        <>
            <span> ExPageLists_Grade_Year_Quarter_Subject_Lists_By_ID </span>
            <br />
            {GetStudentExPaperDetailByID.map((d:any)=>{
                return(
                    <>
        <div key={d.id}>
          {d.name}
          <br />
          {isImage(d.EX_Paper[0]?.img) ? (
            <Image
              src={d.EX_Paper[0]?.img}
              width={500}
              height={500}
              alt={d.name}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <a href={`http://localhost:3000${d.EX_Paper[0]?.img}`} target="_blank" rel="noopener noreferrer">
              查看 PDF 文件
            </a>
          )}
        </div>
                                          
                    </>
                )

            })}
        </>
    )
}

export default ExPageLists_Grade_Year_Quarter_Subject_Lists_By_ID