// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from 'next/navigation';
// import Link from "next/link";




// interface Teacher {
//     id: string;
//     username: string;
//     nickname?: string;
//     email: string;
//     phone?: string;
//     role: string;
//   }


// const TeacherDetail = () => {
//     const params = useParams();//plz use console.log see params name
//   const TeacherId = params?.teacherdetailbyID as string;// 獲取URL中的TeacherId參數
  
//   // 為了拿老師data by id
//   const [GetTeacherDataById, setGetTeacherDataById] = useState<Teacher | null>();

//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // 拿老師data by id
//   useEffect(() => {
//     if (TeacherId) {
//       const getTeacherDetail = async (id: string) => {
//         try {
//           const res = await fetch(`/api/Course_data_teacher_by_id/${id}`);
//           if (!res.ok) {
//             throw new Error("斷線！");
//           }
//           const result = await res.json();
//           setGetTeacherDataById(result);
//         } catch (error) {
//           console.error(error);
//         }
//       };
//       getTeacherDetail(TeacherId);
//     }
//   }, [TeacherId]);

//   // console.log("-- params id : --",TeacherId, " -- end -- ")

//   if (!GetTeacherDataById) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-4">
//       <Link
//         href={`/admin/userLists/teachersLists/${GetTeacherDataById.id}/edit`}
//         className="text-2xl font-bold mb-4"
//       >
//         更改老師數據
//       </Link>
//       <span className="block text-lg font-semibold mb-2">TeacherDetail</span>
//       <div className="bg-white shadow-md rounded-lg p-4">
//         <p className="mb-2"><span className="font-semibold">id:</span> {GetTeacherDataById.id}</p>
//         <p className="mb-2"><span className="font-semibold">username:</span> {GetTeacherDataById.username}</p>
//         <p className="mb-2"><span className="font-semibold">nickname:</span> {GetTeacherDataById.nickname}</p>
//         <p className="mb-2"><span className="font-semibold">email:</span> {GetTeacherDataById.email}</p>
//         <p className="mb-2"><span className="font-semibold">phone:</span> {GetTeacherDataById.phone}</p>
//         <p className="mb-2"><span className="font-semibold">role:</span> {GetTeacherDataById.role}</p>
//       </div>
//     </div>
//   );
// };

// export default TeacherDetail;


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Teacher {
  id: string;
  username: string;
  nickname?: string;
  email: string;
  phone?: string;
  role: string;
}

const TeacherDetail = () => {
  const params = useParams();
  const teacherId = params?.teacherdetailbyID as string;

  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teacherId) {
      const fetchTeacherDetail = async (id: string) => {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/Course_data_teacher_by_id/${id}`);
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
      fetchTeacherDetail(teacherId);
    }
  }, [teacherId]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <div className="bg-[#e7915b] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">老師詳情</h1>
        {isLoading ? (
          <p className="text-white text-center">正在載入數據...</p>
        ) : error ? (
          <p className="text-cyan-200 text-center">{error}</p>
        ) : !teacherData ? (
          <p className="text-white text-center">無老師數據</p>
        ) : (
          <>
            <div className="mb-6">
              <Link
                href={`/admin/userLists/teachersLists/${teacherData.id}/edit`}
                className="inline-block px-4 py-2 bg-white text-[#e7915b] font-medium rounded-md hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300"
              >
                更改老師數據
              </Link>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="mb-2 text-[#e7915b]">
                <span className="font-medium">ID:</span> {teacherData.id}
              </p>
              <p className="mb-2 text-[#e7915b]">
                <span className="font-medium">用戶名稱:</span> {teacherData.username}
              </p>
              <p className="mb-2 text-[#e7915b]">
                <span className="font-medium">暱稱:</span> {teacherData.nickname || "未設置"}
              </p>
              <p className="mb-2 text-[#e7915b]">
                <span className="font-medium">電郵:</span> {teacherData.email}
              </p>
              <p className="mb-2 text-[#e7915b]">
                <span className="font-medium">電話:</span> {teacherData.phone || "未設置"}
              </p>
              <p className="mb-2 text-[#e7915b]">
                <span className="font-medium">角色:</span> {teacherData.role}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDetail;