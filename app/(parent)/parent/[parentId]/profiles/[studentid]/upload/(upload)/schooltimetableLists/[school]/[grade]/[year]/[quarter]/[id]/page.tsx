"use client";

import { useParams } from 'next/navigation';
// import Link from "next/link";
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SchoolTimeTableByID {
    id: string;
    name: string;
}


const SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID = () => {
    const params = useParams<{ studentid : string ; id:string}>();

    const StudentID = params?.studentid as string;
    const Id = params?.id as string;

    const [ GetStudentSchoolTimeTableDetailByID , setGetStudentSchoolTimeTableDetailByID ] = useState<SchoolTimeTableByID[]>([]);

    useEffect(()=>{
        if(Id){
            const getstudentschooltimetabledetailbyid = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/Parents_Student/Parents_Student_Lists/${StudentID}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentSchoolTimeTableDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentschooltimetabledetailbyid(Id)
        }
    },[Id])

        // 檢查是否為圖片格式的輔助函數
        const isImage = (url: string) => {
            return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
          };
        

    console.log(GetStudentSchoolTimeTableDetailByID)


    return(
        <>
            <span> SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID </span>
            <br />
{GetStudentSchoolTimeTableDetailByID.map((d:any)=>{
    return(
        <div key={d.id} className="my-2">
          {d.name}
          <br />
          {isImage(d.SC_Timetable[0]?.img) ? (
            <Image
              src={d.SC_Timetable[0]?.img}
              width={500}
              height={500}
              alt={d.name}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <a href={`http://localhost:3000${d.SC_Timetable[0]?.img}`} target={`http://localhost:3000${d.SC_Timetable[0]?.img}`}  rel="noopener noreferrer">
              查看 PDF 文件
            </a>
          )}
        </div>
    )
})}
        </>
    )
}

export default SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID