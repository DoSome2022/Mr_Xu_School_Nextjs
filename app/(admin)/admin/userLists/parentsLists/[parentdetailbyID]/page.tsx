// "use client"
// import Link from "next/link"
// import { useEffect, useState } from "react";
// import { useParams } from 'next/navigation';


// interface ParentData {
//   nickname: string;
//   username: string;
// }


// interface StudentData {
//     id: string;
//     name: string;
//     school: string;
//     grade: number;
//     Parent_data: ParentData;
    
//   }

// const ParentDetail = () => {
//     const params = useParams();
//     const ParentId = params?.parentdetailbyID as string;



//     //Student的DATA
//     const [GetStudentData , setGetStudentData] = useState<StudentData[]>([]);


  
//   //用ParentId去拿student DB裹的DATA
//   useEffect(()=>{
//     if(ParentId){
//       const fetchStudentData = async (parentdataid : string) => {
//         //在app/api/student/Student_Lists/[id]/route.ts
//         const res = await fetch(`/api/student/Student_Lists/${parentdataid}`);
//         if(!res){
//           throw new Error("斷線！")
//         }
//         const result = await res.json();


//         setGetStudentData(result);
//       }
//       fetchStudentData(ParentId)
//     }
//   },[ParentId])

// console.log("-- Student Data : --",GetStudentData,"-- END --")
// return(

//   <>


//     <Link className="text-stone-950 hover:text-gray-700" href={`/admin/userLists/parentsLists/${ParentId}/createstudent`}>
//       建立學生
//     </Link>
//   <br />
//     <Link className="text-stone-950 hover:text-gray-700" href={`/admin/userLists/parentsLists/${ParentId}/edit`}>
//       修改家長
//     </Link>
//   <br />

//  {GetStudentData.map((student)=>{
//   return(
//     <>
//     <Link className="text-stone-950 hover:text-gray-700" href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}`}>
//       學生名:{student.name}<br />
//       學校:{student.school}<br />
//       年級:{student.grade} <br/>
//       家長名:{student.Parent_data.nickname} / {student.Parent_data.username}
//       <br />

//     </Link>
    
//     </>
//   )
//  })}
  
//   </>


// )





// }
// export default ParentDetail



"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

const ParentDetail = () => {
  const params = useParams();
  const parentId = params?.parentdetailbyID as string;

  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parentId) {
      const fetchStudentData = async (parentId: string) => {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/student/Student_Lists/${parentId}`);
          if (!res.ok) {
            throw new Error("無法連接到伺服器");
          }
          const result = await res.json();
          setStudentData(result);
        } catch (error) {
          console.error("獲取學生數據失敗:", error);
          setError("無法載入學生數據，請稍後再試");
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudentData(parentId);
    }
  }, [parentId]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <div className="bg-[#e7915b] shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">家長詳情</h1>
        <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <Link
            href={`/admin/userLists/parentsLists/${parentId}/createstudent`}
            className="inline-block px-4 py-2 bg-white text-[#e7915b] font-medium rounded-md hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300 text-center"
          >
            建立學生
          </Link>
          <Link
            href={`/admin/userLists/parentsLists/${parentId}/edit`}
            className="inline-block px-4 py-2 bg-white text-[#e7915b] font-medium rounded-md hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300 text-center"
          >
            修改家長
          </Link>
        </div>
        {isLoading ? (
          <p className="text-white text-center">正在載入數據...</p>
        ) : error ? (
          <p className="text-cyan-200 text-center">{error}</p>
        ) : studentData.length === 0 ? (
          <p className="text-white text-center">尚未有學生數據</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {studentData.map((student) => (
              <div
                key={student.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >



                <Link
                  href={`/admin/userLists/parentsLists/${parentId}/studentLists/${student.id}`}
                  className="block text-[#e7915b] hover:text-cyan-200 transition-colors duration-300"
                >
                  <p className="font-medium">學生姓名: {student.name}</p>
                  <p>學校: {student.school}</p>
                  <p>年級: {student.grade}</p>
                  <p>家長姓名: {student.Parent_data.nickname} / {student.Parent_data.username}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDetail;