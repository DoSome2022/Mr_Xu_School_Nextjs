"use client";

import ClassLists from "@/components/DatasLIsts/ClassDetailLists";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";
import ClassDetailLists from "@/components/DatasLIsts/ClassDetailLists";




const CourseDetail = () => {
    const params = useParams();//plz use console.log see params name
    const CourseId = params?.coursedetailbyID as string;// 獲取URL中的CourseId參數

    // 為了拿course data by id
    const [GetCourseDataById, setGetCourseDataById] = useState();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  

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

    if (!GetCourseDataById) {
        return <div>Loading...</div>;
      }

    return(
        <>
      {/* <Link
        href={`/admin/courseLists/${GetCourseDataById.id}/createClass`}
        className="text-2xl font-bold mb-4"
      >
        建立課堂
        </Link> */}


            <br />
        <Link
        href={`/admin/courseLists/${GetCourseDataById.id}/edit`}
        className="text-2xl font-bold mb-4"
      >
        更改課程
        </Link>
        <br />

            課程資料

            <br />
            

            <ClassDetailLists  data={GetCourseDataById} />

        </>
    )
}

export default CourseDetail