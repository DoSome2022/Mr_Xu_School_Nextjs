"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

const Student_BookLists_School = () =>{

    const params = useParams<{parentId : string ; studentid : string}>();
    const ParentId = params?.parentId as string;
    const StudentID = params?.studentid as string;

    console.log("-- Student_BookLists_School --",params,"-- END --")


    //拿學生資料
    const [GetSutudentData , setGetSutudentData] = useState([]);
    
  //用ParentId去拿student DB裹的DATA
  useEffect(()=>{
    if(ParentId){
      const fetchStudentData = async (studentdataid : string) => {
        //在app/api/student/Student_Lists/[id]/route.ts
        const res = await fetch(`/api/Parents_Student/Parents_Student_Lists/${studentdataid}`);
        if(!res){
          throw new Error("斷線！")
        }
        const result = await res.json();
        setGetSutudentData(result);
      }
      fetchStudentData(StudentID)
    }
  },[StudentID])

  console.log("-- Student Data : --",GetSutudentData,"-- END --")

    return(
        <>
            Student_BookLists_School
            {GetSutudentData.map((d:any)=>{
                return(
                    <>
            <br />

            <Link
              className="text-stone-950 hover:text-gray-700"
              href={`/parent/${ParentId}/profiles/${StudentID}/upload/bookLists/upload`}
              passHref
            >
                上傳書單
            </Link>
            <br />


                    <Link
                    className="text-stone-950 hover:text-gray-700"
                    href={`/parent/${ParentId}/profiles/${StudentID}/upload/bookLists/${d.school}`}
                >
                    
                        school: {d.school}
                    </Link>
                    
                    </>
                )
                
            })}
        </>
    )
}

export default Student_BookLists_School