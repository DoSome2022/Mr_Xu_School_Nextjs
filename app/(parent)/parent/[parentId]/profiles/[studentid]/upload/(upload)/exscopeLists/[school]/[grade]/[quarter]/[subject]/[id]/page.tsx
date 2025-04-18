"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const ExScope_Grade_Quarter_Subject_Lists_By_ID = () => {
  const params = useParams<{ studentid: string }>();
  const StudentID = params?.studentid as string;

  const [GetStudentExScopeDetailByID, setGetStudentExScopeDetailByID] = useState<any[]>([]);

  useEffect(() => {
    if (StudentID) {
      const getstudentexscopedetailbyid = async (StudentID: string) => {
        try {
          const res = await fetch(`/api/Parents_Student/Parents_Student_Lists/${StudentID}`);
          if (!res.ok) {
            throw new Error("斷線！");
          }
          const result = await res.json();
          setGetStudentExScopeDetailByID(result);
        } catch (error) {
          console.error(error);
        }
      };
      getstudentexscopedetailbyid(StudentID);
    }
  }, [StudentID]);

    // 檢查是否為圖片格式的輔助函數
    const isImage = (url: string) => {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    };
  

  console.log(GetStudentExScopeDetailByID[0]);

  return (
    <>
      <span>ExScope_Grade_Quarter_Subject_Lists_By_ID</span>
      <br />
      {GetStudentExScopeDetailByID.map((d: any) => (
        <div key={d.id} className="my-2">
          {d.name}
          <br />
          {isImage(d.EX_scope[0]?.img) ? (
            <Image
              src={d.EX_scope[0]?.img}
              width={500}
              height={500}
              alt={d.name}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <a href={`http://localhost:3000${d.EX_scope[0]?.img}`} target="_blank" rel="noopener noreferrer">
              查看 PDF 文件
            </a>
          )}
        </div>
      ))}
    </>
  );
};

export default ExScope_Grade_Quarter_Subject_Lists_By_ID;