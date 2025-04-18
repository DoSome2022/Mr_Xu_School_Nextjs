"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const Student_BookLists_School_Year_Grade_Id_Detail = () => {
  const params = useParams<{ studentid: string }>();
  const StudentID = params?.studentid as string;
console.log(params);
  const [GetStudentBookListsDetailByID, setGetStudentBookListsDetailByID] = useState<any[]>([]);

  useEffect(() => {
    if (StudentID) {
      const getstudentbooklistsdetailbyid = async (StudentID: string) => {
        try {
            const res = await fetch(`/api/Parents_Student/Parents_Student_Lists/${StudentID}`);
          if (!res.ok) {
            throw new Error("斷線！");
          }
          const result = await res.json();
          setGetStudentBookListsDetailByID(result);
        } catch (error) {
          console.error(error);
        }
      };
      getstudentbooklistsdetailbyid(StudentID);
    }
  }, [StudentID]);

  // 檢查是否為圖片格式的輔助函數
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };



console.log("GetStudentBookListsDetailByID : ", GetStudentBookListsDetailByID , "-- END --")

  return (
    <>
      <span>Student_BookLists_School_Year_Grade_Id_Detail</span>
      <br />
      {GetStudentBookListsDetailByID.map((d: any) => (
        <div key={d.id}>
          {d.name}
          <br />
          {isImage(d.BookList[0]?.img) ? (
            <Image
              src={d.BookList[0]?.img}
              width={500}
              height={500}
              alt={d.name}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <a href={`http://localhost:3000${d.BookList[0]?.img}`} target="_blank" rel="noopener noreferrer">
              查看 PDF 文件
            </a>
          )}
        </div>
      ))}
    </>
  );
};

export default Student_BookLists_School_Year_Grade_Id_Detail;