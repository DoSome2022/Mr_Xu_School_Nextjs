// "use client"


// import Link from "next/link";
// import { useEffect, useState } from "react";



// const teacherLists =  () =>{

//     //為了拿老師data
//     const [ GetTeacherData , setgetTeacherData ] = useState([]);

//         //拿老師data
//         useEffect(() => {
//             const getTeacherData = async () =>{
//                 //在app/api/Course_data/route.ts
//                 const res = await fetch('/api/Course_data_teacher');
//                 if(!res){
//                     throw new Error("斷線！")
//                 }
                
//                const result = await res.json()
    
//                setgetTeacherData(result)
    
//             }
//             getTeacherData()
//         },[])
    

//     return(
//         <>
//         <div>
//             teacherLists
//             <div>
//                 <Link href="/admin/userLists/teachersLists/createTeacher" > 建立老師 </Link>
//             </div>

//             <div>

//             {GetTeacherData.map((data)=>{
//                 if( data.role === "TEACHER" )
//                     {
//                         return(
//                             <>
//                                 <Link href={`/admin/userLists/teachersLists/${data.id}`} key={data.id} >
//                                 id:{data.id}
//                                 <br />
//                                 名：{data.username}


//                                 </Link>
//                             </>
//                                 )
//                     }

//                 })}

//             </div>

//         </div>
//         </>
//     )
// }

// export default teacherLists


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface TeacherData {
  id: string;
  username: string;
  role: string;
}

const TeacherLists = () => {
  const [teacherData, setTeacherData] = useState<TeacherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/Course_data_teacher");
        if (!res.ok) {
          throw new Error("無法連接到伺服器");
        }
        const result = await res.json();
        setTeacherData(result);
      } catch (error) {
        console.error("獲取老師數據失敗:", error);
        setError("無法載入老師數據，請稍後再試");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacherData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <div className="bg-[#e7915b] shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">老師列表</h1>
        <div className="mb-6">
          <Link
            href="/admin/userLists/teachersLists/createTeacher"
            className="inline-block px-4 py-2 bg-white text-[#e7915b] font-medium rounded-md hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300"
          >
            建立老師
          </Link>
        </div>
        {isLoading ? (
          <p className="text-white text-center">正在載入數據...</p>
        ) : error ? (
          <p className="text-cyan-200 text-center">{error}</p>
        ) : teacherData.length === 0 ? (
          <p className="text-white text-center">尚未有老師數據</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teacherData.map((data) => {
              if (data.role === "TEACHER") {
                return (
                  <div
                    key={data.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link
                      href={`/admin/userLists/teachersLists/${data.id}`}
                      className="block text-[#e7915b] hover:text-cyan-200 transition-colors duration-300"
                    >
                      <p className="font-medium">ID: {data.id}</p>
                      <p>名稱: {data.username}</p>
                    </Link>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherLists;