// "use client";

// import { Logout_Button } from "@/components/logout_button";
// import { useSession } from "next-auth/react";
// import TeacherNavber from "./_components/navbar";
// import { useEffect, useState } from "react";

// const TeacherByIdComponents = () => {
//   const session = useSession();

//   console.log("--teacher_session data : --  ", session?.data?.user, "-- END --");

//   const teacherId = session?.data?.user?.id;

//   console.log("id : ", teacherId);

//   const [GetTeacherData, setGetTeacherData] = useState([]);
//   const [GetSchoolData, setGetSchoolData] = useState<any[]>([]); // 指定類型為 any[]，因為數據是陣列
//   const [alerts, setAlerts] = useState<any[]>([]); // 用於儲存符合條件的提示

//   // 獲取教師資料
//   useEffect(() => {
//     if (teacherId) {
//       const fetchTeacherData = async (id: string) => {
//         try {
//           const response = await fetch(`/api/Teacher_detail_data_by_id/${id}`);
//           if (!response.ok) {
//             throw new Error("Failed to fetch teacher data");
//           }
//           const data = await response.json();
//           setGetTeacherData(data);
//         } catch (error) {
//           console.error("Error fetching teacher data:", error);
//         }
//       };
//       fetchTeacherData(teacherId);
//     }
//   }, [teacherId]);

//   console.log("--teacher_data : --  ", GetTeacherData, "-- END --");

//   // 獲取學校資料
//   useEffect(() => {
//     const fetchSchoolData = async () => {
//       try {
//         const response = await fetch(`/api/School_Lists`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch school data");
//         }
//         const data = await response.json();
//         setGetSchoolData(data);
//       } catch (error) {
//         console.error("Error fetching school data:", error);
//       }
//     };
//     fetchSchoolData();
//   }, []);

//   console.log("--school_data : --  ", GetSchoolData, "-- END --");

//   // 計算提示欄邏輯
//   useEffect(() => {
//     const currentDate = new Date(); // 當前日期，假設為 2025-04-10（根據你的系統日期）
//     // const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000; // 14 天的毫秒數
//     const fiveSecondsInMs = 5 * 1000; // 5 秒的毫秒數
//     const newAlerts = GetSchoolData.flatMap((school) =>
//       school.school_EX_Day
//         .map((exDay: any) => {
//           const exDayDate = new Date(exDay.EX_Day); // 將 EX_Day 轉為 Date 物件
//           const timeDiff = exDayDate.getTime() - currentDate.getTime(); // 時間差

//           // 條件：EX_Day 在當前日期前 14 天內，且未過期
//           if (timeDiff > 0 && timeDiff <= fiveSecondsInMs) {
//             return {
//               schoolName: school.school_name,
//               exDay: exDay.EX_Day,
//               subject: exDay.subject,
//             };
//           }
        
//           return null;
//         })
//         .filter(Boolean) // 過濾掉 null 值
//     );

//     setAlerts(newAlerts);
//   }, [GetSchoolData]);

//   return (
//     <>
//       <div className="container mx-auto p-4 bg-blue-100">
//         <div className="grid grid-cols-6 gap-4">
//           <TeacherNavber teacherId={teacherId} />
//         </div>

//         {/* 提示欄 */}
//         {alerts.length > 0 && (
//           <div className="mt-4">
//             {alerts.map((alert, index) => (
//               <div
//                 key={index}
//                 className="p-4 mb-2 bg-yellow-100 border border-yellow-400 rounded-md"
//               >
//                 <p>
//                   "{alert.schoolName}" 在 "{new Date(alert.exDay).toLocaleDateString()}" 進行 "{alert.subject}"，請去相關學生下留言。
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Logout_Button />
//     </>
//   );
// };

// export default TeacherByIdComponents;


//13-08-2025原本

// "use client";

// import { Logout_Button } from "@/components/logout_button";
// import { useSession } from "next-auth/react";
// import TeacherNavber from "./_components/navbar";
// import { useEffect, useState } from "react";

// const TeacherByIdComponents = () => {
//   const session = useSession();
//   const teacherId = session?.data?.user?.id;

//   const [GetTeacherData, setGetTeacherData] = useState([]);
//   const [GetSchoolData, setGetSchoolData] = useState<any[]>([]);
//   const [alerts, setAlerts] = useState<any[]>([]);

//   useEffect(() => {
//     if (teacherId) {
//       const fetchTeacherData = async (id: string) => {
//         try {
//           const response = await fetch(`/api/Teacher_detail_data_by_id/${id}`);
//           if (!response.ok) throw new Error("Failed to fetch teacher data");
//           const data = await response.json();
//           setGetTeacherData(data);
//         } catch (error) {
//           console.error("Error fetching teacher data:", error);
//         }
//       };
//       fetchTeacherData(teacherId);
//     }
//   }, [teacherId]);

//   useEffect(() => {
//     const fetchSchoolData = async () => {
//       try {
//         const response = await fetch(`/api/School_Lists`);
//         if (!response.ok) throw new Error("Failed to fetch school data");
//         const data = await response.json();
//         setGetSchoolData(data);
//       } catch (error) {
//         console.error("Error fetching school data:", error);
//       }
//     };
//     fetchSchoolData();
//   }, []);

//   // 計算提示欄邏輯
//   useEffect(() => {
//     const currentDate = new Date(); // 當前日期
//     const fiveSecondsInMs = 5 * 1000; // 5 秒的毫秒數

//     const newAlerts = GetSchoolData.flatMap((school) =>
//       school.school_EX_Day
//         .map((exDay: any) => {
//           const exDayDate = new Date(exDay.EX_Day); // 將 EX_Day 轉為 Date 物件
//           const timeDiff = exDayDate.getTime() - currentDate.getTime(); // 時間差

//           // 檢查是否超過 5 秒
//           if (timeDiff > fiveSecondsInMs) {
//             console.log(`EX_Day ${exDay.EX_Day} 已超過 5 秒，當前時間: ${currentDate.toLocaleString()}`);
//           }

//           // 條件：EX_Day 在當前日期後，且在 5 秒內
//           if (fiveSecondsInMs) {
//             const triggerTime = new Date(currentDate.getTime() + fiveSecondsInMs); // 當前時間 + 5 秒
//             console.log(
//               `提示將在 ${triggerTime.toLocaleString()} 發動，針對 EX_Day: ${exDay.EX_Day}`
//             );
//             return {
//               schoolName: school.school_name,
//               exDay: exDay.EX_Day,
//               subject: exDay.subject,
//             };
//           }
//           return null;
//         })
//         .filter(Boolean)
//     );

//     setAlerts(newAlerts);
//   }, [GetSchoolData]);

//   return (
//     <>
//       <div className="container mx-auto p-4 bg-blue-100">
//         <div className="grid grid-cols-6 gap-4">
//           <TeacherNavber teacherId={teacherId} />
//         </div>

//         {/* 提示欄 */}
//         {alerts.length > 0 && (
//           <div className="mt-4">
//             {alerts.map((alert, index) => (
//               <div
//                 key={index}
//                 className="p-4 mb-2 bg-yellow-100 border border-yellow-400 rounded-md"
//               >
//                 <p>
//                   "{alert.schoolName}" 在 "{new Date(alert.exDay).toLocaleString()}" 進行 "{alert.subject}"，請去相關學生下留言。
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <Logout_Button />
//     </>
//   );
// };

// export default TeacherByIdComponents;


"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Logout_Button } from "@/components/logout_button";
import TeacherNavbar from "./_components/navbar"; // 修正拼寫

// 定義型別
interface SessionUser {
  id: string;
  role: string;
  staff: boolean;
  isAdmin: boolean;
  username?: string;
  email?: string;
  nickname?: string;
}

interface TeacherData {
  id: string;
  username: string;
  courses?: { id: string; course_name: string; course_subject: string }[];
}

interface SchoolExDay {
  EX_Day: string;
  subject: string;
}

interface SchoolData {
  school_name: string;
  school_EX_Day: SchoolExDay[];
}

interface Alert {
  schoolName: string;
  exDay: string;
  subject: string;
}

const TeacherByIdComponents = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ teacherId: string }>();
  const teacherId = params?.teacherId as string;

  const [teacherData, setTeacherData] = useState<TeacherData[]>([]);
  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
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

  // 獲取學校數據
  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const response = await fetch(`/api/School_Lists`, { cache: "no-store" });
        if (!response.ok) throw new Error("無法獲取學校數據");
        const data: SchoolData[] = await response.json();
        setSchoolData(data);
      } catch (error: any) {
        console.error("獲取學校數據失敗:", error.message);
        setError("無法載入學校數據，請稍後重試");
      }
    };
    fetchSchoolData();
  }, []);

  // 計算提示欄邏輯
  useEffect(() => {
    const currentDate = new Date();
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000; // 改為 5 天

    const newAlerts = schoolData.flatMap((school) =>
      school.school_EX_Day
        .map((exDay: SchoolExDay) => {
          const exDayDate = new Date(exDay.EX_Day);
          const timeDiff = exDayDate.getTime() - currentDate.getTime();

          if (timeDiff > fiveDaysInMs) {
            console.log(`EX_Day ${exDay.EX_Day} 已超過 5 天，當前時間: ${currentDate.toLocaleString()}`);
            return null;
          }

          if (timeDiff > 0 && timeDiff <= fiveDaysInMs) {
            const triggerTime = new Date(currentDate.getTime() + timeDiff);
            console.log(
              `提示將在 ${triggerTime.toLocaleString()} 發動，針對 EX_Day: ${exDay.EX_Day}`
            );
            return {
              schoolName: school.school_name,
              exDay: exDay.EX_Day,
              subject: exDay.subject,
            };
          }
          return null;
        })
        .filter((alert): alert is Alert => alert !== null)
    );

    setAlerts(newAlerts);
  }, [schoolData]);

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
        <span>Teacher Dashboard</span>
        <br />
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white border border-blue-200 min-h-screen">
      <div className="grid grid-cols-6 gap-4">
        {/* 導航欄 */}
        <TeacherNavbar teacherId={teacherId} />

        {/* 主要內容區域 */}
        <div className="col-span-5 bg-white border border-blue-200 rounded-md p-6">
          {/* 提示欄 */}
          {alerts.length > 0 && (
            <div className="mb-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="p-4 mb-2 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-800"
                >
                  <p className="text-base">
                    <span className="font-semibold">{alert.schoolName}</span> 在{" "}
                    <span className="font-semibold">
                      {new Date(alert.exDay).toLocaleString()}
                    </span>{" "}
                    進行 <span className="font-semibold">{alert.subject}</span>
                    ，請前往相關學生頁面留言。
                  </p>
                </div>
              ))}
            </div>
          )}
          {/* 教師數據展示 */}
          {teacherData.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold">教師資訊</h2>
              <p>用戶名: {teacherData[0].username}</p>
              <p>課程數: {teacherData[0].courses?.length || 0}</p>
            </div>
          ) : (
            <p>暫無教師數據</p>
          )}
        </div>
      </div>

      {/* 登出按鈕 */}
      <div className="mt-4 flex justify-end">
        <Logout_Button />
      </div>
    </div>
  );
};

export default TeacherByIdComponents;