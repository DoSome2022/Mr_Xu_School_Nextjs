"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface BooKLIstsDataById {
  
 
  school : string;
  year: string;
  grade: number;  
  name: string;
  img: string;
  id: string;
  
}
const Student_BookLists_School_Year_Grade_Id_Detail = () => {
  const params = useParams<{ studentid: string ; school: string ; year: string ; grade: string ; parentId: string ; id: string;}>();
  
  // const StudentID = params?.studentid as string;
  // const ParentID = params?.parentId as string;
  // const SchoolName = params?.school as string;
  // const Year = params?.year as string;
  // const Grade = params?.grade as string;
  const Id = params?.id as string;


  

console.log(params);
  const [GetStudentBookListsDetailByID, setGetStudentBookListsDetailByID] = useState<BooKLIstsDataById[]>([]);

  useEffect(() => {
    if (Id) {
      const getstudentbooklistsdetailbyid = async (Id: string) => {
        try {
            const res = await fetch(`/api/Parents_Student/Parents_Student_Booklist_by_id_Lists/${Id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
          if (!res.ok) {
            throw new Error("斷線！");
          }
          const result = await res.json();
          setGetStudentBookListsDetailByID(result);
        } catch (error) {
          console.error(error);
        }
      };
      getstudentbooklistsdetailbyid(Id);
    }
  }, [Id]);

  // 檢查是否為圖片格式的輔助函數
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };



console.log("GetStudentBookListsDetailByID : ", GetStudentBookListsDetailByID , "-- END --")

  return (
    <>
      <span>Student_BookLists_School_Year_Grade_Id_Detail</span>
      <br />
      {GetStudentBookListsDetailByID.map((d) => {

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
};

export default Student_BookLists_School_Year_Grade_Id_Detail;