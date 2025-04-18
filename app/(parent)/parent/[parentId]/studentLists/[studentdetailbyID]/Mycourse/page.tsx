"use client"

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const Mycourse = () => {
  const param = useParams();
  console.log(param);
  const parentId = param.parentId as string;
  const studentId = param.studentdetailbyID as string;

  const [ GetStudentData , setGetStudentData ] = useState([]);


  useEffect(()=>{
    const fetchStudentDataById = async (id:string) => {
        try {
            const response = await fetch(`/api/Parents_Student/Parents_Student_Lists_detail_data_by_id/${id}`);
            console.log("1")
            const data = await response.json();
            setGetStudentData(data);
        } catch (error) {
            console.error("Error fetching parent data:", error);
        }
    }
    fetchStudentDataById(studentId);

},[studentId])

console.log("GetStudentData : ",GetStudentData);

const CourseLists = GetStudentData[0]?.course


    return (
       <>
       
          {CourseLists?.map((d:any)=>{
            return(
              <>
                <Link href={`/parent/${parentId}/studentLists/${studentId}/Mycourse/${d.id}`}>
                  <div >
                    <p>課程名稱: {d.course_name}</p>
                    <p>課程日期: {d.day_start} - {d.day_end}</p>
                    <p>課程時間: {d.start_time} - {d.end_time}</p>
                  </div>
                </Link>
              </>
            )
          })}

       
            <div className="col-span-1 flex flex-col sm:flex-row justify-between text-xs text-gray-500 mt-4">
              <p>九龍九龍灣宏光道80號麗晶花園商場1樓105號舖</p>
              <p>Whatsapp: 59190844</p>
              <p>info@target.edu.hk</p>
            </div>
       </>

 
      );

}

export default Mycourse