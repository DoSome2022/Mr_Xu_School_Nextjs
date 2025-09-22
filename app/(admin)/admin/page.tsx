// "use client"

// import ClassRoomCalendar from "@/components/calendar/classroomCalendar";
// import ShowCalendar from "@/components/calendar/ShowCalendar";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// const AdminComponents = () => {
//     const session = useSession();
//     const [events, setEvents] = useState([]);
//     // const [getClassDatas, setGetClassDatas] = useState([]);

//     const [GetClassRoom , setGetClassRoom] = useState([])

//     useEffect(()=>{
//         const getclassdata = async () => {
//             const res = await fetch('/api/Class_Lists');
//             if(!res){
//                 throw new Error("斷線！")
//             }
//             const result = await res.json();
//             setEvents(result);
//         }
//         getclassdata()

//         const fetchClassRoom = async () => {
//             const res = await fetch('/api/ClassRoom_Lists');
//             if(!res){
//                 throw new Error("斷線！")
//             }
//             const result = await res.json();
//             setGetClassRoom(result);

//         }
//         fetchClassRoom()

//     },[])

//     console.log("GetClassRoom :",GetClassRoom,"--End--")

//     // console.log("events-data : ", events)



//   //  console.log("--admin_session data : --  ",session?.data?.user,"-- END --")
//     return(
//         <>
//             <span>admin</span>
//             {/* <ShowCalendar events={events} /> */}


//             <ClassRoomCalendar />


//         </>
//     )
// }

// export default AdminComponents






// "use client";

// import ClassRoomCalendar from "@/components/calendar/classroomCalendar";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// const AdminComponents = () => {
//   const session = useSession();
//   const [events, setEvents] = useState([]);
//   const [GetClassRoom, setGetClassRoom] = useState([]);

//   useEffect(() => {
//     const getclassdata = async () => {
//       const res = await fetch("/api/Class_Lists");
//       if (!res.ok) {
//         throw new Error("斷線！");
//       }
//       const result = await res.json();
//       setEvents(result);
//     };
//     getclassdata();

//     const fetchClassRoom = async () => {
//       const res = await fetch("/api/ClassRoom_Lists");
//       if (!res.ok) {
//         throw new Error("斷線！");
//       }
//       const result = await res.json();
//       setGetClassRoom(result);
//     };
//     fetchClassRoom();
//   }, []);

//   console.log("GetClassRoom :", GetClassRoom, "--End--");

//   return (
//     <div className="min-h-screen bg-[#e7915b] pt-20">
//       <div className="max-w-7xl mx-auto px-4">
//         <br />
//         <h1 className="text-3xl font-bold text-white text-center mb-6">管理員面板</h1>
//         <ClassRoomCalendar />
//       </div>
//     </div>
//   );
// };

// export default AdminComponents;




"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClassRoomCalendar from "@/components/calendar/classroomCalendar";
import { CalendarEvent, ClassRoom } from "@/lib/types";

const AdminComponents = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [GetClassRoom, setGetClassRoom] = useState<ClassRoom[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 檢查是否為管理員
    if (status === "loading") return;
    if (!session?.user?.isAdmin) {
      router.push("/unauthorized");
    }

    const getclassdata = async () => {
      try {
        const res = await fetch("/api/Class_Lists");
        if (!res.ok) {
          throw new Error("無法獲取課程數據");
        }
        const result = await res.json();
        // 確保 API 返回的資料符合 CalendarEvent 類型
        const formattedEvents: CalendarEvent[] = result.map((item: any) => ({
          id: String(item.id), // 將 id 轉為 string
          title: item.title,
          start: item.start,
          end: item.end,
        }));
        setEvents(formattedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知錯誤");
      }
    };

    const fetchClassRoom = async () => {
      try {
        const res = await fetch("/api/ClassRoom_Lists");
        if (!res.ok) {
          throw new Error("無法獲取教室數據");
        }
        const result = await res.json();
        // 確保 API 返回的資料符合 ClassRoom 類型
        setGetClassRoom(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知錯誤");
      }
    };

    getclassdata();
    fetchClassRoom();
  }, [session, status, router]);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  console.log("GetClassRoom :", GetClassRoom, "--End--");

  return (
    <div className="min-h-screen bg-[#80A8BD] pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <br />
        <h1 className="text-3xl font-bold text-white text-center mb-6">管理員面板</h1>
        <ClassRoomCalendar events={events} classRooms={GetClassRoom} />
      </div>
    </div>
  );
};

export default AdminComponents;