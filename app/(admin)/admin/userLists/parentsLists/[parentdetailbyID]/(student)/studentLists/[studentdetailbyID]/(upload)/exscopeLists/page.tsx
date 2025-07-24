"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

interface Student_School{
  school:string;
}

const ExScope = () => {
    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string}>();
    const ParentId = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;

           //拿學生資料
    const [GetSutudentData , setGetSutudentData] = useState<Student_School[]>([]);
    
    //用ParentId去拿student DB裹的DATA
    useEffect(()=>{
      if(ParentId){
        const fetchStudentData = async (parentdataid : string) => {
          //在app/api/student/Student_Lists/[id]/route.ts
          const res = await fetch(`/api/student/Student_Lists/${parentdataid}`);
          if(!res){
            throw new Error("斷線！")
          }
          const result = await res.json();
          setGetSutudentData(result);
        }
        fetchStudentData(ParentId)
      }
    },[ParentId])

    console.log("-- Student Data : --",GetSutudentData,"-- END --")

    return(
        <>
            <span> ExScope </span>
            <br />

            <Link
                    className="text-stone-950 hover:text-gray-700"
                  href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/exscopeLists/upload`}
                >
                    
                        上傳考試範圍
                    </Link>
            <br />
            {GetSutudentData.map((d)=>{
                return(
                <>
                    <br />
                    <Link
                    className="text-stone-950 hover:text-gray-700"
                    href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/exscopeLists/${d.school}`}
                >
                    
                        school: {d.school}
                    </Link>
                    
                    </>
                )
                
            })}

            <br />
        </>
    )
}

export default ExScope