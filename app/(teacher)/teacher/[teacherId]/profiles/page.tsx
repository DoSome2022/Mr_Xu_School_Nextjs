// "use client";


// import TeacherNavber from "../_components/navbar"
// import { useSession } from "next-auth/react";
// import { Logout_Button } from "@/components/logout_button";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// const profiles = () => {
// // components/ProfileInfo.js
//     // const session = useSession();

//     // console.log("--teacher_session data : --  ",session?.data?.user,"-- END --")

//     // const teacherId = session?.data.user?.id ; 

//     const param = useParams();
//     const teacherId = param?.teacherId as string ;


//     console.log("id : " , teacherId);

//     const [ getTeacherData , setGetTeacherData ] = useState([]);

//     useEffect(() => {
//       const getTeacherData = async (id:string) =>{
//           const res = await fetch(`/api/Teacher_detail_data_by_id/${id}`);

//           if (!res.ok) {
//             throw new Error("Failed to fetch teacher data");
//           }

//           const result = await res.json();
//           setGetTeacherData(result);
//         } 
//         getTeacherData(teacherId)
//     },[teacherId])


//     console.log("--getTeacherData : --  ",getTeacherData,"-- END --")

//     const P_HR = getTeacherData[0]?.teacher_time_work[0]?.P_HR;
//     const HS_HR = getTeacherData[0]?.teacher_time_work[0]?.HS_HR;
//     const JHS_HR = getTeacherData[0]?.teacher_time_work[0]?.JHS_HR;
//     const P_number = getTeacherData[0]?.teacher_time_work[0]?.P_number;
//     const HS_number = getTeacherData[0]?.teacher_time_work[0]?.HS_number;
//     const JHS_number = getTeacherData[0]?.teacher_time_work[0]?.JHS_number;


//     return (
//       <div className="container mx-auto h-full w-full bg-blue-200 p-4">
//         <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
//           <div className="col-span-6 flex justify-between">
//             <p className="text-gray-500 text-lg">個人信息</p>
//             <div className="flex space-x-2">
//               <Logout_Button />
//             </div>
//           </div>

//           <TeacherNavber  teacherId={teacherId} />
//           <div className="col-span-5 mt-8">
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               {getTeacherData.map((d:any)=>{
//                 return(
//                   <div key={d.id}>
//                     nickname : {d.nickname}
//                     <br />
//                     phone: {d.phone}
//                     <br />


//                     總時:
//                     <br />
//                     小學時數課 : {P_HR} 小時 {P_number} 人
//                     <br />
//                     初中時數課： {JHS_HR} 小時 {JHS_number} 人
//                     <br />
//                     高中時數課： {HS_HR} 小時 {HS_number} 人
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  

// export default profiles


"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Logout_Button } from "@/components/logout_button";
import TeacherNavbar from "../_components/navbar"; // 修正拼寫

// 定義型別
interface TeacherTimeWork {
  P_HR: number;
  JHS_HR: number;
  HS_HR: number;
  P_number: number;
  JHS_number: number;
  HS_number: number;
}

interface TeacherData {
  id: string;
  nickname?: string;
  phone?: string;
  teacher_time_work: TeacherTimeWork[];
}

const Profiles = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ teacherId: string }>();
  const teacherId = params?.teacherId as string;

  const [teacherData, setTeacherData] = useState<TeacherData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 身份驗證檢查
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/stafflogin");
    } else if (session?.user.id !== teacherId || session?.user.role !== "TEACHER") {
      setError("無權訪問此頁面");
      router.push("/auth/error?error=AccessDenied");
    }
  }, [status, session, teacherId, router]);

  // 獲取教師數據
  useEffect(() => {
    if (teacherId && status === "authenticated" && !error) {
      const fetchTeacherData = async (id: string) => {
        try {
          const response = await fetch(`/api/Teacher_detail_data_by_id/${id}`, {
            cache: "no-store",
          });
          if (!response.ok) throw new Error("無法獲取教師數據");
          const data: TeacherData[] = await response.json();
          setTeacherData(data);
        } catch (error: any) {
          console.error("獲取教師數據失敗:", error.message);
          setError("無法載入教師數據，請稍後重試");
        }
      };
      fetchTeacherData(teacherId);
    }
  }, [teacherId, status, error]);

  if (status === "loading") {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <span>個人信息</span>
        <br />
        {error}
      </div>
    );
  }

  const P_HR = teacherData[0]?.teacher_time_work[0]?.P_HR ?? 0;
  const HS_HR = teacherData[0]?.teacher_time_work[0]?.HS_HR ?? 0;
  const JHS_HR = teacherData[0]?.teacher_time_work[0]?.JHS_HR ?? 0;
  const P_number = teacherData[0]?.teacher_time_work[0]?.P_number ?? 0;
  const HS_number = teacherData[0]?.teacher_time_work[0]?.HS_number ?? 0;
  const JHS_number = teacherData[0]?.teacher_time_work[0]?.JHS_number ?? 0;

  return (
    <div className="container mx-auto h-full w-full bg-blue-200 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        <div className="col-span-6 flex justify-between">
          <p className="text-gray-500 text-lg">個人信息</p>
          <div className="flex space-x-2">
            <Logout_Button />
          </div>
        </div>

        <TeacherNavbar teacherId={teacherId} />
        <div className="col-span-5 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {teacherData.length > 0 ? (
              teacherData.map((d) => (
                <div key={d.id}>
                  <p>Nickname: {d.nickname || "未設置"}</p>
                  <p>Phone: {d.phone || "未設置"}</p>
                  <br />
                  <p>總時:</p>
                  <p>小學時數課: {P_HR} 小時 {P_number} 人</p>
                  <p>初中時數課: {JHS_HR} 小時 {JHS_number} 人</p>
                  <p>高中時數課: {HS_HR} 小時 {HS_number} 人</p>
                </div>
              ))
            ) : (
              <p>暫無教師數據</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;