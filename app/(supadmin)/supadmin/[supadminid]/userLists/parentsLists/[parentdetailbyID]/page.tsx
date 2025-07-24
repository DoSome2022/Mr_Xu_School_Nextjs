"use client"
import Link from "next/link"
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';


interface ParentData {
  nickname: string;
  username: string;
}


interface StudentData {
    id: string;
    name: string;
    school: string;
    grade: number;
    Parent_data: ParentData;
    
  }

const ParentDetailbysupadmin = () => {
    const params = useParams();
    const ParentId = params?.parentdetailbyID as string;
    const supadminId = params?.supadminId as string;


    //Student的DATA
    const [GetStudentData , setGetStudentData] = useState<StudentData[]>([]);


  
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


        setGetStudentData(result);
      }
      fetchStudentData(ParentId)
    }
  },[ParentId])

console.log("-- Student Data : --",GetStudentData,"-- END --")
return(

  <>


    <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/createstudent`}>
      建立學生
    </Link>
  <br />
    <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/edit`}>
      修改家長
    </Link>
  <br />

 {GetStudentData.map((student)=>{
  return(
    <>
    <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${student.id}`}>
      學生名:{student.name}<br />
      學校:{student.school}<br />
      年級:{student.grade} <br/>
      家長名:{student.Parent_data.nickname} / {student.Parent_data.username}
      <br />

    </Link>
    
    </>
  )
 })}
  
  </>


)





}
export default ParentDetailbysupadmin