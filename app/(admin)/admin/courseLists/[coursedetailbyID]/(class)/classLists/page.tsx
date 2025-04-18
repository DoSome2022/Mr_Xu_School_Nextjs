"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// 定義年級對應對象
const gradeMapping = {
    1: "小學1年級",
    2: "小學2年級",
    3: "小學3年級",
    4: "小學4年級",
    5: "小學5年級",
    6: "小學6年級",
    7: "初中1年級",
    8: "初中2年級",
    9: "初中3年級",
    10: "高中1年級",
    11: "高中2年級",
    12: "高中3年級",
  };
  
const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth()+ 1).padStart(2, '0');
    const year = date.getFullYear()%100;
    const daysOfWeek = ['日','一 ','二','三','四','五','六'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `${year}-${month}-${day} (${dayOfWeek})`
}


const ClassLists = () => {
    const params = useParams();//plz use console.log see params name
    const CourseId = params?.coursedetailbyID as string;// 獲取URL中的CourseId參數

    // 為了拿course data by id
    const [GetCourseDataById, setGetCourseDataById] = useState([]);

        // 拿course data by id
        useEffect(() =>{
            if(CourseId) {
                const getCourseDetail = async (id: string) => {
                    try {
                    const res = await fetch(`/api/Course_detail_data_by_id/${id}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetCourseDataById(result);                    
                    } catch (error) {
                        console.error(error);
                    }
                };
                getCourseDetail(CourseId);
            }
        },[CourseId] )
    
        console.log('GetCourseDataById : ', GetCourseDataById)

        
    return(
    

        <>
            <span>ClassLists</span>
            {GetCourseDataById?.class?.map((d:any)=>{
                return(
                    <>
                    <Link href={`/admin/courseLists/${CourseId}/classLists/${d.id}`}>
                    
                    <br />
                    課室：{d.classroom}
                    <br />
                    日期：{getFormattedDate(d.class_date)}
                    <br />
                    人數: {d.persons}
                    <br />
                    年級: { gradeMapping[d.grade] ||d.grade}
                    <br />
                    課節: {d.class_lesson}

                    </Link>
                    </>
                )
            })}
        </>
    )
}

export default ClassLists