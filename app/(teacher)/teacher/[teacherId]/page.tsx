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


"use client";

import { Logout_Button } from "@/components/logout_button";
import { useSession } from "next-auth/react";
import TeacherNavber from "./_components/navbar";
import { useEffect, useState } from "react";

const TeacherByIdComponents = () => {
  const session = useSession();
  const teacherId = session?.data?.user?.id;

  const [GetTeacherData, setGetTeacherData] = useState([]);
  const [GetSchoolData, setGetSchoolData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (teacherId) {
      const fetchTeacherData = async (id: string) => {
        try {
          const response = await fetch(`/api/Teacher_detail_data_by_id/${id}`);
          if (!response.ok) throw new Error("Failed to fetch teacher data");
          const data = await response.json();
          setGetTeacherData(data);
        } catch (error) {
          console.error("Error fetching teacher data:", error);
        }
      };
      fetchTeacherData(teacherId);
    }
  }, [teacherId]);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const response = await fetch(`/api/School_Lists`);
        if (!response.ok) throw new Error("Failed to fetch school data");
        const data = await response.json();
        setGetSchoolData(data);
      } catch (error) {
        console.error("Error fetching school data:", error);
      }
    };
    fetchSchoolData();
  }, []);

  // 計算提示欄邏輯
  useEffect(() => {
    const currentDate = new Date(); // 當前日期
    const fiveSecondsInMs = 5 * 1000; // 5 秒的毫秒數

    const newAlerts = GetSchoolData.flatMap((school) =>
      school.school_EX_Day
        .map((exDay: any) => {
          const exDayDate = new Date(exDay.EX_Day); // 將 EX_Day 轉為 Date 物件
          const timeDiff = exDayDate.getTime() - currentDate.getTime(); // 時間差

          // 檢查是否超過 5 秒
          if (timeDiff > fiveSecondsInMs) {
            console.log(`EX_Day ${exDay.EX_Day} 已超過 5 秒，當前時間: ${currentDate.toLocaleString()}`);
          }

          // 條件：EX_Day 在當前日期後，且在 5 秒內
          if (fiveSecondsInMs) {
            const triggerTime = new Date(currentDate.getTime() + fiveSecondsInMs); // 當前時間 + 5 秒
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
        .filter(Boolean)
    );

    setAlerts(newAlerts);
  }, [GetSchoolData]);

  return (
    <>
      <div className="container mx-auto p-4 bg-blue-100">
        <div className="grid grid-cols-6 gap-4">
          <TeacherNavber teacherId={teacherId} />
        </div>

        {/* 提示欄 */}
        {alerts.length > 0 && (
          <div className="mt-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="p-4 mb-2 bg-yellow-100 border border-yellow-400 rounded-md"
              >
                <p>
                  "{alert.schoolName}" 在 "{new Date(alert.exDay).toLocaleString()}" 進行 "{alert.subject}"，請去相關學生下留言。
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Logout_Button />
    </>
  );
};

export default TeacherByIdComponents;