"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

interface Student_School{
    school : string;
}

const ExTimeListsbysupadmin = () => {

    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string; supadminId: string;}>();
    const ParentId = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const supadminId = params?.supadminId as string;


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
            <span> ExTimeLists </span>

            <br />

                    <Link
                    className="text-stone-950 hover:text-gray-700"
                    href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/extimeLists/upload`}
                >
                    上傳考試時間表
                    </Link>
                    <br />
            {GetSutudentData.map((d)=>{
                return(
                    <>

                    <br />
                    <Link
                    className="text-stone-950 hover:text-gray-700"
                    href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/extimeLists/${d.school}`}
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

export default ExTimeListsbysupadmin