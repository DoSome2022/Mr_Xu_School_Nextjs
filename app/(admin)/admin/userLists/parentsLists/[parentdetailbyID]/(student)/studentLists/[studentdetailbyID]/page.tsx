"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import SchoolDetailLists from "@/components/DatasLIsts/SchoolDetailLists";

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

const StudentDetail = () => {

    const params = useParams<{parentdetailbyID: string , studentdetailbyID: string,}>();
    const ParentId = params?.parentdetailbyID as string;
    const StudentId = params?.studentdetailbyID as string;

    //這個是由user db開始出發拉下去直到parent data
    const [GetParentData , setGetParentData] = useState([]);

    //拿學生資料
    const [GetSutudentData , setGetSutudentData] = useState([]);

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
            <span>StudentDetail</span>
        <br />
        {GetSutudentData && GetSutudentData.map((student)=>{
            return(
                <>
                學生名: {student.name}
                <br />
                學校：{student.school}
                <br />
                年級:{ gradeMapping[ student.grade ]}

                <br />
                <Link
                   className="text-stone-950 hover:text-gray-700"
                    href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/bookLists`}
                >
                    書單
                </Link>
                <br />
                <Link
                    className="text-stone-950 hover:text-gray-700"
                    href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/schooltimetableLists`}
                >
                    學校時間表
                </Link>
                <br />
                <Link
                    className="text-stone-950 hover:text-gray-700"
                    href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/expageLists`}
                >
                    考試卷
                </Link>
                <br />
                <Link
                    className="text-stone-950 hover:text-gray-700"
                    href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/extimeLists`}
                >
                    考試時間表
                </Link>
                <br />
                <Link
                    className="text-stone-950 hover:text-gray-700"
                    href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/exscopeLists`}
                >
                    考試範圍表
                </Link>
                <br />
                <Link
                    className="text-stone-950 hover:text-gray-700"
                    href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/scoreLists`}
                >
                    成縝
                </Link>
                <br />
                </>
            )
        })}
          
        </>
    )
}
export default StudentDetail