"use client";

import { Logout_Button } from "@/components/logout_button";
import { useSession } from "next-auth/react";
import TeacherNavber from "../_components/navbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const StudentLists = () => {
  const param = useParams();
  const teacherId = param?.teacherId as string;
  console.log(" teacherId :",teacherId);
  const [getteacherData , setgetteacherData] = useState([]);

    useEffect(() => {
      const fetchstudentLists = async (id:string) => {
        const res = await fetch(`/api/Teacher_detail_data_by_id/${id}`);
        if (!res) {
          throw new Error("斷線！");
        }
        const result = await res.json();
        setgetteacherData(result);
      }
      fetchstudentLists(teacherId);
    },[teacherId])

    console.log(" getteacherData : ",getteacherData);

    const studentLists = getteacherData[0]?.Student;

    console.log(" Student : ", studentLists)
  
    return (
      <div className="container mx-auto h-full w-full bg-blue-200 p-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-1">

      {studentLists?.map((d:any)=>{
        return(
          <>
         <Link href={`/teacher/${teacherId}/studentLists/${d.id}`}>
           姓名:{d.name}
         
         </Link>
          </>
        )
      })}


      </div>
    </div>
      );
}
export default StudentLists