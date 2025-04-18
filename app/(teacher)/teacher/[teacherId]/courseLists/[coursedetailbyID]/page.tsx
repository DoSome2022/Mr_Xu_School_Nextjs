"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const CourseDetail = () => {
    const params = useParams<{teacherId : string , coursedetailbyID : string}>();
    const teacherId = params?.teacherId as string;
    const courseId = params?.coursedetailbyID as string;
    console.log("params : ",params)

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


    console.log("--CourseData : --  ",CourseData,"-- END --")


    return(
        <>
            <span>CourseDetail</span>
            <br />
            {CourseData?.map((data:any)=>{
                return(
                    <>
                    課程名稱 : {data.course_name}
                    <br />
                    課程科目: {data.course_subject}
                    <br />
                    年級:{data.grade}
                    <br />
                    人數:{data.persons}
                    <br />
                    課堂:
                        {data?.class.map((classData:any)=>{
                            return(
                              <>
                              <br />
                              <Link href={`/teacher/${teacherId}/courseLists/${courseId}/classLists/${classData.id}`}>
                              名：{classData.title}
                              </Link>
                              <br />
                              </>
                            )
                        })}
                        
            
                    </>
                )
            })}



        </>
    )
}
export default CourseDetail