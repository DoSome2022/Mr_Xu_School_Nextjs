"use client"

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const studentDetail = () => {
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

    

    return(
        <>
            <span>studentDetail</span>
            <br />
            <Link href={`/parent/${parentId}/studentLists/${studentId}/Mycourse`}>
                MyCourse
            </Link>
            <br />
        </>
    )

}

export default studentDetail