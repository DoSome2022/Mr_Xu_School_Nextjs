"use client";

import { Logout_Button } from "@/components/logout_button";
import { useSession } from "next-auth/react";
import TeacherNavber from "../_components/navbar";
import { useEffect, useState } from "react";
import Link from "next/link";

const CourseLists = () => {
    const session = useSession();

    console.log("--teacher_session data : --  ",session?.data?.user,"-- END --")
  
    const teacherId = session?.data.user?.id ; 
  
    console.log("id : " , teacherId);

        const [ GetTeacherData , setGetTeacherData ] = useState([]);
    
        useEffect(()=>{
          if(teacherId){
            const fetchTeacherData = async (id:string) => {
              try {
                const response = await fetch(`/api/Teacher_detail_data_by_id/${id}`);
                if (!response.ok) {
                  throw new Error("Failed to fetch teacher data");
                }
                const data = await response.json();
                setGetTeacherData(data);
              } catch (error) {
                console.error("Errorfetching teacher data:", error);
              }
            }
            fetchTeacherData(teacherId)
          }
        },[teacherId])
    
        console.log("--teacher_data : --  ",GetTeacherData,"-- END --")
        const CourseData = GetTeacherData[0]?.Course;

    return(
        <>
        <div>
            <p>CourseLists</p>
            {CourseData?.map((data:any)=>{
                return(

                    <>
                    <Link href={`/teacher/${teacherId}/courseLists/${data.id}`}>
                    <br />
                    課程名稱 : {data.course_name}
                    <br />
                    課程科目: {data.course_subject}
                    <br />
                    年級:{data.grade}
                    <br />
                    </Link>

                    </>
                )
            })}

        </div>
        </>
    )
}
export default CourseLists