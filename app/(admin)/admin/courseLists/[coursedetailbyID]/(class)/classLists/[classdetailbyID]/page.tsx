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

const ClassDetail = () => {
    const params = useParams();//plz use console.log see params name
    const CourseId = params?.coursedetailbyID as string;// 獲取URL中的CourseId參數
    const ClassId = params?.classdetailbyID as string
    console.log(ClassId)

    // 為了拿course data by id
    const [GetClassDataById, setGetClassDataById] = useState([]);

        // 拿course data by id
        useEffect(() =>{
            if(ClassId) {
                const getClassDetail = async (id: string) => {
                    try {
                    const res = await fetch(`/api/Class_detail_data_by_id/${id}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetClassDataById(result);                    
                    } catch (error) {
                        console.error(error);
                    }
                };
                getClassDetail(ClassId);
            }
        },[ClassId] )
    
        console.log('GetClassDataById : ', GetClassDataById)


    return(
        <>
            <Link href={`/admin/courseLists/${CourseId}/classLists/${ClassId}/edit`} >
                更改課堂
            </Link>
            <br />

            <span>ClassDetailByID</span>

            <br />
            課堂地點: {GetClassDataById[0]?.cram}
            <br />
            課室: {GetClassDataById[0]?.classroom}
            <br />
            節數: {GetClassDataById[0]?.class_lesson}
            <br />
            人數: {GetClassDataById[0]?.persons}
            <br />
            老師:{GetClassDataById[0]?.teacher}
            <br />
            學生:{GetClassDataById[0]?.student.map((student:any) => student.name)}
            <br />
            筆記數目:{GetClassDataById[0]?.node}
            <br />
            日期:{getFormattedDate(GetClassDataById[0]?.class_date)}
            <br />
            年級: { gradeMapping[GetClassDataById[0]?.grade] ||GetClassDataById[0]?.grade}
            <br />
            <Link href={`/admin/courseLists/${CourseId}/classLists/${ClassId}/addclassstudent`}>
            加入加堂學生
            </Link>
            <br />
            <Link href={`/admin/courseLists/${CourseId}/classLists/${ClassId}/changeclassstudent`}>
            加入掉堂學生
            </Link>
        </>
    )
}

export default ClassDetail