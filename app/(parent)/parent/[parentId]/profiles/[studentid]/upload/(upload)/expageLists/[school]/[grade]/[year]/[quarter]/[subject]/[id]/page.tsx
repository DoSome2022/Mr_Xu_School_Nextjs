"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ExPageListsByIDData{
    id : string;
    school : string;
    grade : number;
    year : string;
    quarter : number;
    img:  string;
    name: string;
}


const ExPageListsByID = () => {

    const params = useParams<{grade : string ; year : string ; quarter : string ; subject : string ; school : string; id: string; parentId: string; studentid:string;}>();
    // const Grade = params?.grade as string;
    // const Year = params?.year as string;
    // const Quarter = params?.quarter as string;
    // const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';
    // const SchoolName = params?.school as string;
    const Id = params?.id as string;
    // const ParentID = params?.parentId as string;
    // const StudentID = params?.studentid as string;


    console.log("params : ", params)

    const [ExPageListsDetailByID ,setExPageListsDetailByID]= useState<ExPageListsByIDData[]>([]);

      useEffect(() => {
        if (Id) {
          const getstudentbooklistsdetailbyid = async (Id: string) => {
            try {
                const res = await fetch(`/api/Parents_Student/Parents_Student_ExPage_by_id_Lists/${Id}`);
              if (!res.ok) {
                throw new Error("斷線！");
              }
              const result = await res.json();
              setExPageListsDetailByID(result);
            } catch (error) {
              console.error(error);
            }
          };
          getstudentbooklistsdetailbyid(Id);
        }
      }, [Id]);

      console.log("ExPageListsDetailByID :", ExPageListsDetailByID)


  // 檢查是否為圖片格式的輔助函數
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };



  return (
    <>
      <span>Student_ExPage_School_Year_Grade_Id_Detail</span>
      <br />
      {ExPageListsDetailByID.map((d) => {

          if(
            true
            //  d.BookList[0]?.year == Year
            // && d.parentid == ParentID &&  && d.grade ==  Number(Grade) && d.school == SchoolName && d.BookList[0]?.id == Id
          
          ){   
            return(
          <div key={d.id}>
            {d.name}
            <br />
            {isImage(d.img) ? (
              <Image
                src={d.img}
                width={500}
                height={500}
                alt={d.name}
                style={{ objectFit: "contain" }}
              />
            ) : (
              <div>
                {d.name}
  <br />
              
              <a href={`http://localhost:3000${d.img}`} target="_blank" rel="noopener noreferrer">
                查看 PDF 文件
              </a>
  
              </div>
            )}
          </div>
  
            )
  
  
  
  
  
       }
          
        


}
      
      )}
    </>
  );

}

export default ExPageListsByID;