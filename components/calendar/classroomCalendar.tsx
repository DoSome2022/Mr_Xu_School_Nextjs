// "use client";
// import React, { useEffect, useState, useTransition } from "react";
// import Link from "next/link";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
// import useSWR from "swr";
// import { CalendarEvent, ClassRoom, Class, Course } from "@/lib/types";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toggleClassVisibility, toggleCourseVisibility } from "@/actions/Classroom";

// // 定義 VisibleRooms 介面
// interface VisibleRooms {
//   [key: string]: boolean;
// }

// // 定義 GetTime 介面
// interface GetTime {
//   id: number;
//   course_time: string;
// }

// // 定義 ClassRoomCalendar 的 Props 介面
// interface ClassRoomCalendarProps {
//   events: CalendarEvent[];
//   classRooms: ClassRoom[];
// }

// // 格式化時間
// const formatTime = (time: string): string => {
//   const hours = time.slice(0, 2);
//   const minutes = time.slice(2, 4);
//   return `${hours}:${minutes}`;
// };

// // 生成時間段
// const generateTimeSlots = (times: GetTime[]): string[] => {
//   const slots: string[] = [];
//   if (!times || times.length < 3) return slots;
//   for (let i = 0; i < times.length - 2; i += 2) {
//     const startTime = formatTime(times[i]?.course_time || "");
//     const endTime = formatTime(times[i + 2]?.course_time || "");
//     if (startTime && endTime) {
//       slots.push(`${startTime}-${endTime}`);
//     }
//   }
//   return slots;
// };

// // 獲取日期和星期
// const getDates = (baseDate: Date) => {
//   const today = new Date(baseDate);
//   const tomorrow = new Date(baseDate);
//   tomorrow.setDate(today.getDate() + 1);

//   const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
//   return [
//     {
//       date: today.toISOString().split("T")[0],
//       label: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
//       weekday: weekdays[today.getDay()],
//     },
//     {
//       date: tomorrow.toISOString().split("T")[0],
//       label: `${tomorrow.getFullYear()}年${tomorrow.getMonth() + 1}月${tomorrow.getDate()}日`,
//       weekday: weekdays[tomorrow.getDay()],
//     },
//   ];
// };

// export default function ClassRoomCalendar({ events, classRooms }: ClassRoomCalendarProps) {
//   const [visibleRooms, setVisibleRooms] = useState<VisibleRooms>({});
//   const [baseDate, setBaseDate] = useState(new Date());
//   const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
//   const apiUrl_next = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";

//   // SWR 獲取 coursetimes
//   const fetcher = async (url: string, init?: RequestInit): Promise<GetTime[]> => {
//     const res = await fetch(url, init);
//     const data = await res.json();
//     if (!Array.isArray(data) || !data.every((item) => typeof item.id === "number" && typeof item.course_time === "string")) {
//       throw new Error("API 資料格式不正確");
//     }
//     return data;
//   };
//   const { data: timeData, error: timeError, isLoading: timeLoading } = useSWR(`${apiUrl}/api/course_data/coursetimes`, fetcher);

//   // SWR 獲取所有課程（不論 isshow）
//   const { data: allCoursesData, error: coursesError } = useSWR(
//     `${apiUrl_next}/api/Course_Lists`,
//     async (url: string) => {
//       const res = await fetch(url);
//       const data = await res.json();
//       if (!Array.isArray(data)) throw new Error("Invalid courses data");
//       return data as Course[];
//     }
//   );

//   useEffect(() => {
//     const initialVisibleRooms: VisibleRooms = {};
//     classRooms.forEach((room: ClassRoom) => {
//       room.Class.forEach((cls: Class) => {
//         initialVisibleRooms[`${room.id}-${cls.id}`] = true;
//       });
//     });
//     setVisibleRooms(initialVisibleRooms);
//   }, [classRooms]);

//   const handlePrevDay = () => {
//     setBaseDate((prev) => {
//       const newDate = new Date(prev);
//       newDate.setDate(prev.getDate() - 1);
//       return newDate;
//     });
//   };

//   const handleNextDay = () => {
//     setBaseDate((prev) => {
//       const newDate = new Date(prev);
//       newDate.setDate(prev.getDate() + 1);
//       return newDate;
//     });
//   };

//   const toggleVisibility = (key: string) => {
//     setVisibleRooms((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const handleRoomClick = (roomId: string) => {
//     setSelectedRoomId((prev) => (prev === roomId ? null : roomId));
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleToggleClassVisibility = async (classId: string, isshow: boolean) => {
//     startTransition(async () => {
//       setError(null);
//       setSuccess(null);
//       const result = await toggleClassVisibility(classId, isshow);
//       if (result.error) {
//         setError(result.error);
//       } else if (result.success) {
//         setSuccess(result.success);
//       }
//     });
//   };

//   const handleToggleCourseVisibility = async (isshow: boolean) => {
//     if (!selectedCourseId) {
//       setError("請先選擇一個課程");
//       return;
//     }
//     startTransition(async () => {
//       setError(null);
//       setSuccess(null);
//       const result = await toggleCourseVisibility(selectedCourseId, isshow, true);
//       if (result.error) {
//         setError(result.error);
//       } else if (result.success) {
//         setSuccess(result.success);
//       }
//     });
//   };

//   const dates = getDates(baseDate);
//   const timeSlots = timeData && Array.isArray(timeData) ? generateTimeSlots(timeData) : [];

//   const filteredRooms = selectedRoomId ? classRooms.filter((room) => room.id === selectedRoomId) : classRooms;

//   const filteredClassRooms = filteredRooms
//     .map((room) => ({
//       ...room,
//       Class: room.Class.filter((cls) => {
//         if (!searchQuery) return cls.isshow;
//         const query = searchQuery.toLowerCase();
//         const courseNameMatch = cls.class_course.course_name.toLowerCase().includes(query);
//         const studentNameMatch = cls.student.some((st) => st.name.toLowerCase().includes(query));
//         return (courseNameMatch || studentNameMatch) && cls.isshow;
//       }),
//     }))
//     .filter((room) => room.Class.length > 0 || room.Course.some((course) => course.isshow));

//   const hasResults = filteredClassRooms.length > 0;

//   // 使用 SWR 獲取的課程清單，若無則回退到 classRooms
//   const allCourses = allCoursesData || classRooms
//     .flatMap((room) => room.Course)
//     .filter((course, index, self) => self.findIndex((c) => c.id === course.id) === index);

//   return (
//     <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
//       {error && <div className="p-4 text-red-500">{error}</div>}
//       {success && <div className="p-4 text-green-500">{success}</div>}
//       {timeError ? (
//         <div className="p-4 text-cyan-200">錯誤: {timeError.message}</div>
//       ) : timeLoading ? (
//         <div className="p-4 text-white">載入中...</div>
//       ) : !timeData || !Array.isArray(timeData) ? (
//         <div className="p-4 text-cyan-200">無效的資料格式</div>
//       ) : (
//         <>
//           <div className="flex items-center justify-between mb-4">
//             <ChevronLeftIcon
//               className="h-8 w-8 text-white cursor-pointer hover:text-cyan-200 transition-colors duration-300"
//               onClick={handlePrevDay}
//             />
//             <div className="flex items-center space-x-4">
//               <Select onValueChange={setSelectedCourseId} value={selectedCourseId || undefined}>
//                 <SelectTrigger className="w-[200px] bg-white/20 text-white border-none">
//                   <SelectValue placeholder="選擇課程" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {allCourses.map((course) => (
//                     <SelectItem key={course.id} value={course.id}>
//                       {course.course_name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <button
//                 className="rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600 disabled:bg-gray-500 transition-all duration-300"
//                 onClick={() => handleToggleCourseVisibility(true)}
//                 disabled={isPending || !selectedCourseId}
//               >
//                 顯示
//               </button>
//               <button
//                 className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 disabled:bg-gray-500 transition-all duration-300"
//                 onClick={() => handleToggleCourseVisibility(false)}
//                 disabled={isPending || !selectedCourseId}
//               >
//                 隱藏
//               </button>
//             </div>
//             <ChevronRightIcon
//               className="h-8 w-8 text-white cursor-pointer hover:text-cyan-200 transition-colors duration-300"
//               onClick={handleNextDay}
//             />
//           </div>

//           <div className="mb-4">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               placeholder="輸入課程名稱或學生姓名進行搜尋"
//               className="w-full p-2 bg-white/20 text-white placeholder:text-gray-300 border-none rounded-md focus:ring-2 focus:ring-cyan-200 transition-all duration-300"
//             />
//           </div>

//           <div className="grid grid-cols-[14%_43%_43%] gap-2 mb-4">
//             <div></div>
//             <h4 className="text-center font-bold text-white">{dates[0].label}</h4>
//             <h4 className="text-center font-bold text-white">{dates[1].label}</h4>
//           </div>
//           <div className="grid grid-cols-[14%_43%_43%] gap-2 mb-4">
//             <div></div>
//             <h5 className="text-center text-white">{dates[0].weekday}</h5>
//             <h5 className="text-center text-white">{dates[1].weekday}</h5>
//           </div>

//           {hasResults ? (
//             <div className="overflow-x-auto">
//               <table className="w-full border border-white/30">
//                 <thead>
//                   <tr>
//                     <th className="w-[9%] border border-white/30 text-white p-2"></th>
//                     {filteredClassRooms.map((room) => (
//                       <th
//                         key={`${room.id}-day1`}
//                         className={`w-[15%] border border-white/30 font-bold text-center text-white cursor-pointer hover:bg-blue-300/20 transition-all duration-300 ${
//                           selectedRoomId === room.id ? "bg-blue-300/20" : ""
//                         }`}
//                         onClick={() => handleRoomClick(room.id)}
//                       >
//                         {room.room}
//                       </th>
//                     ))}
//                     <th className="w-[1%] border border-white/30"></th>
//                     {filteredClassRooms.map((room) => (
//                       <th
//                         key={`${room.id}-day2`}
//                         className={`w-[15%] border border-white/30 font-bold text-center text-white cursor-pointer hover:bg-blue-300/20 transition-all duration-300 ${
//                           selectedRoomId === room.id ? "bg-blue-300/20" : ""
//                         }`}
//                         onClick={() => handleRoomClick(room.id)}
//                       >
//                         {room.room}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {timeSlots.map((slot, slotIndex) => (
//                     <tr key={slotIndex}>
//                       <th className="border border-white/30 p-2 text-white">{slot}</th>
//                       {filteredClassRooms.map((room) => (
//                         <th
//                           key={`${room.id}-day1-${slotIndex}`}
//                           className="border border-white/30 p-2 hover:bg-blue-300/20 transition-all duration-300"
//                         >
//                           {room.Class
//                             .filter((cls) => {
//                               const classDate = cls.class_date;
//                               const startTime = cls.class_start_time;
//                               const slotStart = slot.split("-")[0].replace(":", "");
//                               return classDate === dates[0].date && startTime === slotStart;
//                             })
//                             .map((cls) => (
//                               <div key={cls.id} className="text-white">
//                                 <h5
//                                   className="cursor-pointer hover:text-cyan-200 transition-colors duration-300"
//                                   onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
//                                 >
//                                   {cls.title}
//                                 </h5>
//                                 {visibleRooms[`${room.id}-${cls.id}`] && (
//                                   <div>
//                                     <p>科目：{cls.class_subject}</p>
//                                     <p>人數：{cls.persons}</p>
//                                     <p>教師：{cls.teacher}</p>
//                                     <p>年級：{cls.grade}</p>
//                                     <p>
//                                       學生:{" "}
//                                       {cls.student.map((st) => (
//                                         <span key={st.name}>{st.name} </span>
//                                       ))}
//                                     </p>
//                                     <p>
//                                       請假學生:{" "}
//                                       {cls.Leave.map((le) => (
//                                         <span key={le.name}>{le.name} </span>
//                                       ))}
//                                     </p>
//                                     <p>
//                                       加堂學生:{" "}
//                                       {cls.addClass.map((ac) => (
//                                         <span key={ac.name}>{ac.name} </span>
//                                       ))}
//                                     </p>
//                                     <p>
//                                       掉堂學生:{" "}
//                                       {cls.change_class.map((cc) => {
//                                         let originalClass: Class | undefined;
//                                         classRooms.forEach((room) => {
//                                           const foundClass = room.Class.find((c) => c.id === cc.currentclassId);
//                                           if (foundClass) {
//                                             originalClass = foundClass;
//                                           }
//                                         });
//                                         return (
//                                           <span key={cc.id}>
//                                             {cc.name}
//                                             {originalClass
//                                               ? ` (原課堂: ${originalClass.title}, 課程: ${
//                                                   originalClass.class_course.course_name || "無課程名稱"
//                                                 })`
//                                               : " (原課堂: 未找到)"}{" "}
//                                           </span>
//                                         );
//                                       })}
//                                     </p>
//                                     <Link href={`/lesson/${cls.id}`}>
//                                       <button className="mr-2 rounded bg-blue-300 px-2 py-1 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300">
//                                         課堂
//                                       </button>
//                                     </Link>
//                                     <button
//                                       className="mr-2 rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
//                                       onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
//                                     >
//                                       {visibleRooms[`${room.id}-${cls.id}`] ? "顯示簡化" : "顯示詳情"}
//                                     </button>
//                                     <button
//                                       className={`mr-2 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ${
//                                         cls.isshow
//                                           ? "bg-red-500 hover:bg-red-600"
//                                           : "bg-green-500 hover:bg-green-600"
//                                       }`}
//                                       onClick={() => handleToggleClassVisibility(cls.id, !cls.isshow)}
//                                       disabled={isPending}
//                                     >
//                                       {cls.isshow ? "隱藏" : "顯示"}
//                                     </button>
//                                   </div>
//                                 )}
//                               </div>
//                             ))}
//                           {room.Class.length === 0 && room.Course.length > 0 && (
//                             <div className="text-white">
//                               <p>課程：{room.Course.filter((course) => course.isshow).map((course) => course.course_name).join(", ")}</p>
//                               <p>無具體課堂安排</p>
//                             </div>
//                           )}
//                         </th>
//                       ))}
//                       <th className="border border-white/30"></th>
//                       {filteredClassRooms.map((room) => (
//                         <th
//                           key={`${room.id}-day2-${slotIndex}`}
//                           className="border border-white/30 p-2 hover:bg-blue-300/20 transition-all duration-300"
//                         >
//                           {room.Class
//                             .filter((cls) => {
//                               const classDate = cls.class_date;
//                               const startTime = cls.class_start_time;
//                               const slotStart = slot.split("-")[0].replace(":", "");
//                               return classDate === dates[1].date && startTime === slotStart;
//                             })
//                             .map((cls) => (
//                               <div key={cls.id} className="text-white">
//                                 <h5
//                                   className="cursor-pointer hover:text-cyan-200 transition-colors duration-300"
//                                   onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
//                                 >
//                                   {cls.title}
//                                 </h5>
//                                 {visibleRooms[`${room.id}-${cls.id}`] && (
//                                   <div>
//                                     <p>科目：{cls.class_subject}</p>
//                                     <p>人數：{cls.persons}</p>
//                                     <p>教師：{cls.teacher}</p>
//                                     <p>年級：{cls.grade}</p>
//                                     <p>
//                                       學生:{" "}
//                                       {cls.student.map((st) => (
//                                         <span key={st.name}>{st.name} </span>
//                                       ))}
//                                     </p>
//                                     <p>
//                                       請假學生:{" "}
//                                       {cls.Leave.map((le) => (
//                                         <span key={le.name}>{le.name} </span>
//                                       ))}
//                                     </p>
//                                     <p>
//                                       加堂學生:{" "}
//                                       {cls.addClass.map((ac) => (
//                                         <span key={ac.name}>{ac.name} </span>
//                                       ))}
//                                     </p>
//                                     <p>
//                                       掉堂學生:{" "}
//                                       {cls.change_class.map((cc) => {
//                                         let originalClass: Class | undefined;
//                                         classRooms.forEach((room) => {
//                                           const foundClass = room.Class.find((c) => c.id === cc.currentclassId);
//                                           if (foundClass) {
//                                             originalClass = foundClass;
//                                           }
//                                         });
//                                         return (
//                                           <span key={cc.id}>
//                                             {cc.name}
//                                             {originalClass
//                                               ? ` (原課堂: ${originalClass.title}, 課程: ${
//                                                   originalClass.class_course.course_name || "無課程名稱"
//                                                 })`
//                                               : " (原課堂: 未找到)"}{" "}
//                                           </span>
//                                         );
//                                       })}
//                                     </p>
//                                     <Link href={`/lesson/${cls.id}`}>
//                                       <button className="mr-2 rounded bg-blue-300 px-2 py-1 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300">
//                                         課堂
//                                       </button>
//                                     </Link>
//                                     <button
//                                       className="mr-2 rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
//                                       onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
//                                     >
//                                       {visibleRooms[`${room.id}-${cls.id}`] ? "顯示簡化" : "顯示詳情"}
//                                     </button>
//                                     <button
//                                       className={`mr-2 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ${
//                                         cls.isshow
//                                           ? "bg-red-500 hover:bg-red-600"
//                                           : "bg-green-500 hover:bg-green-600"
//                                       }`}
//                                       onClick={() => handleToggleClassVisibility(cls.id, !cls.isshow)}
//                                       disabled={isPending}
//                                     >
//                                       {cls.isshow ? "隱藏" : "顯示"}
//                                     </button>
//                                   </div>
//                                 )}
//                               </div>
//                             ))}
//                           {room.Class.length === 0 && room.Course.length > 0 && (
//                             <div className="text-white">
//                               <p>課程：{room.Course.filter((course) => course.isshow).map((course) => course.course_name).join(", ")}</p>
//                               <p>無具體課堂安排</p>
//                             </div>
//                           )}
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-4 text-center text-cyan-200">沒有這學生／課程紀錄</div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 引入 useRouter
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import useSWR from "swr";
import { CalendarEvent, ClassRoom, Class, Course } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toggleClassVisibility, toggleCourseVisibility } from "@/actions/Classroom";

// 定義 VisibleRooms 介面
interface VisibleRooms {
  [key: string]: boolean;
}

// 定義 GetTime 介面
interface GetTime {
  id: number;
  course_time: string;
}

// 定義 ClassRoomCalendar 的 Props 介面
interface ClassRoomCalendarProps {
  events: CalendarEvent[];
  classRooms: ClassRoom[];
}

// 格式化時間
const formatTime = (time: string): string => {
  const hours = time.slice(0, 2);
  const minutes = time.slice(2, 4);
  return `${hours}:${minutes}`;
};

// 生成時間段
const generateTimeSlots = (times: GetTime[]): string[] => {
  const slots: string[] = [];
  if (!times || times.length < 3) return slots;
  for (let i = 0; i < times.length - 2; i += 2) {
    const startTime = formatTime(times[i]?.course_time || "");
    const endTime = formatTime(times[i + 2]?.course_time || "");
    if (startTime && endTime) {
      slots.push(`${startTime}-${endTime}`);
    }
  }
  return slots;
};

// 獲取日期和星期
const getDates = (baseDate: Date) => {
  const today = new Date(baseDate);
  const tomorrow = new Date(baseDate);
  tomorrow.setDate(today.getDate() + 1);

  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return [
    {
      date: today.toISOString().split("T")[0],
      label: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
      weekday: weekdays[today.getDay()],
    },
    {
      date: tomorrow.toISOString().split("T")[0],
      label: `${tomorrow.getFullYear()}年${tomorrow.getMonth() + 1}月${tomorrow.getDate()}日`,
      weekday: weekdays[tomorrow.getDay()],
    },
  ];
};

export default function ClassRoomCalendar({ events, classRooms }: ClassRoomCalendarProps) {
  const [visibleRooms, setVisibleRooms] = useState<VisibleRooms>({});
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter(); // 初始化 useRouter

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const apiUrl_next = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";

  // SWR 獲取 coursetimes
  const fetcher = async (url: string, init?: RequestInit): Promise<GetTime[]> => {
    const res = await fetch(url, init);
    const data = await res.json();
    if (!Array.isArray(data) || !data.every((item) => typeof item.id === "number" && typeof item.course_time === "string")) {
      throw new Error("API 資料格式不正確");
    }
    return data;
  };
  const { data: timeData, error: timeError, isLoading: timeLoading } = useSWR(`${apiUrl}/api/course_data/coursetimes`, fetcher);

  // SWR 獲取所有課程（不論 isshow）
  const { data: allCoursesData, error: coursesError } = useSWR(
    `${apiUrl_next}/api/Course_Lists`,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid courses data");
      return data as Course[];
    }
  );

  useEffect(() => {
    const initialVisibleRooms: VisibleRooms = {};
    classRooms.forEach((room: ClassRoom) => {
      room.Class.forEach((cls: Class) => {
        initialVisibleRooms[`${room.id}-${cls.id}`] = true;
      });
    });
    setVisibleRooms(initialVisibleRooms);
  }, [classRooms]);

  const handlePrevDay = () => {
    setBaseDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setBaseDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const toggleVisibility = (key: string) => {
    setVisibleRooms((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleRoomClick = (roomId: string) => {
    setSelectedRoomId((prev) => (prev === roomId ? null : roomId));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleClassVisibility = async (classId: string, isshow: boolean) => {
    startTransition(async () => {
      setError(null);
      setSuccess(null);
      const result = await toggleClassVisibility(classId, isshow);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(result.success);
      }
    });
  };

  const handleToggleCourseVisibility = async (isshow: boolean) => {
    if (!selectedCourseId) {
      setError("請先選擇一個課程");
      return;
    }
    startTransition(async () => {
      setError(null);
      setSuccess(null);
      const result = await toggleCourseVisibility(selectedCourseId, isshow, true);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(result.success);
        console.log("-- 成功 --");
        // 延遲 1 秒跳轉，讓用戶看到成功訊息
        
        setTimeout(() => {
router.push("/admin");
          
        }, 1000);
      }
    });
  };

  const dates = getDates(baseDate);
  const timeSlots = timeData && Array.isArray(timeData) ? generateTimeSlots(timeData) : [];

  const filteredRooms = selectedRoomId ? classRooms.filter((room) => room.id === selectedRoomId) : classRooms;

  const filteredClassRooms = filteredRooms
    .map((room) => ({
      ...room,
      Class: room.Class.filter((cls) => {
        if (!searchQuery) return cls.isshow;
        const query = searchQuery.toLowerCase();
        const courseNameMatch = cls.class_course.course_name.toLowerCase().includes(query);
        const studentNameMatch = cls.student.some((st) => st.name.toLowerCase().includes(query));
        return (courseNameMatch || studentNameMatch) && cls.isshow;
      }),
    }))
    .filter((room) => room.Class.length > 0 || room.Course.some((course) => course.isshow));

  const hasResults = filteredClassRooms.length > 0;

  // 使用 SWR 獲取的課程清單，若無則回退到 classRooms
  const allCourses = allCoursesData || classRooms
    .flatMap((room) => room.Course)
    .filter((course, index, self) => self.findIndex((c) => c.id === course.id) === index);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
      {error && <div className="p-4 text-red-500">{error}</div>}
      {success && <div className="p-4 text-green-500">{success}</div>}
      {timeError ? (
        <div className="p-4 text-cyan-200">錯誤: {timeError.message}</div>
      ) : timeLoading ? (
        <div className="p-4 text-white">載入中...</div>
      ) : !timeData || !Array.isArray(timeData) ? (
        <div className="p-4 text-cyan-200">無效的資料格式</div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <ChevronLeftIcon
              className="h-8 w-8 text-white cursor-pointer hover:text-cyan-200 transition-colors duration-300"
              onClick={handlePrevDay}
            />
            <div className="flex items-center space-x-4">
              <Select onValueChange={setSelectedCourseId} value={selectedCourseId || undefined}>
                <SelectTrigger className="w-[200px] bg-white/20 text-white border-none">
                  <SelectValue placeholder="選擇課程" />
                </SelectTrigger>
                <SelectContent>
                  {allCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                className="rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600 disabled:bg-gray-500 transition-all duration-300"
                onClick={() => handleToggleCourseVisibility(true)}
                disabled={isPending || !selectedCourseId}
              >
                顯示
              </button>
              <button
                className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 disabled:bg-gray-500 transition-all duration-300"
                onClick={() => handleToggleCourseVisibility(false)}
                disabled={isPending || !selectedCourseId}
              >
                隱藏
              </button>
            </div>
            <ChevronRightIcon
              className="h-8 w-8 text-white cursor-pointer hover:text-cyan-200 transition-colors duration-300"
              onClick={handleNextDay}
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="輸入課程名稱或學生姓名進行搜尋"
              className="w-full p-2 bg-white/20 text-white placeholder:text-gray-300 border-none rounded-md focus:ring-2 focus:ring-cyan-200 transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-[14%_43%_43%] gap-2 mb-4">
            <div></div>
            <h4 className="text-center font-bold text-white">{dates[0].label}</h4>
            <h4 className="text-center font-bold text-white">{dates[1].label}</h4>
          </div>
          <div className="grid grid-cols-[14%_43%_43%] gap-2 mb-4">
            <div></div>
            <h5 className="text-center text-white">{dates[0].weekday}</h5>
            <h5 className="text-center text-white">{dates[1].weekday}</h5>
          </div>

          {hasResults ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-white/30">
                <thead>
                  <tr>
                    <th className="w-[9%] border border-white/30 text-white p-2"></th>
                    {filteredClassRooms.map((room) => (
                      <th
                        key={`${room.id}-day1`}
                        className={`w-[15%] border border-white/30 font-bold text-center text-white cursor-pointer hover:bg-blue-300/20 transition-all duration-300 ${
                          selectedRoomId === room.id ? "bg-blue-300/20" : ""
                        }`}
                        onClick={() => handleRoomClick(room.id)}
                      >
                        {room.room}
                      </th>
                    ))}
                    <th className="w-[1%] border border-white/30"></th>
                    {filteredClassRooms.map((room) => (
                      <th
                        key={`${room.id}-day2`}
                        className={`w-[15%] border border-white/30 font-bold text-center text-white cursor-pointer hover:bg-blue-300/20 transition-all duration-300 ${
                          selectedRoomId === room.id ? "bg-blue-300/20" : ""
                        }`}
                        onClick={() => handleRoomClick(room.id)}
                      >
                        {room.room}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, slotIndex) => (
                    <tr key={slotIndex}>
                      <th className="border border-white/30 p-2 text-white">{slot}</th>
                      {filteredClassRooms.map((room) => (
                        <th
                          key={`${room.id}-day1-${slotIndex}`}
                          className="border border-white/30 p-2 hover:bg-blue-300/20 transition-all duration-300"
                        >
                          {room.Class
                            .filter((cls) => {
                              const classDate = cls.class_date;
                              const startTime = cls.class_start_time;
                              const slotStart = slot.split("-")[0].replace(":", "");
                              return classDate === dates[0].date && startTime === slotStart;
                            })
                            .map((cls) => (
                              <div key={cls.id} className="text-white">
                                <h5
                                  className="cursor-pointer hover:text-cyan-200 transition-colors duration-300"
                                  onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
                                >
                                  {cls.title}
                                </h5>
                                {visibleRooms[`${room.id}-${cls.id}`] && (
                                  <div>
                                    <p>科目：{cls.class_subject}</p>
                                    <p>人數：{cls.persons}</p>
                                    <p>教師：{cls.teacher}</p>
                                    <p>年級：{cls.grade}</p>
                                    <p>
                                      學生:{" "}
                                      {cls.student.map((st) => (
                                        <span key={st.name}>{st.name} </span>
                                      ))}
                                    </p>
                                    <p>
                                      請假學生:{" "}
                                      {cls.Leave.map((le) => (
                                        <span key={le.name}>{le.name} </span>
                                      ))}
                                    </p>
                                    <p>
                                      加堂學生:{" "}
                                      {cls.addClass.map((ac) => (
                                        <span key={ac.name}>{ac.name} </span>
                                      ))}
                                    </p>
                                    <p>
                                      掉堂學生:{" "}
                                      {cls.change_class.map((cc) => {
                                        let originalClass: Class | undefined;
                                        classRooms.forEach((room) => {
                                          const foundClass = room.Class.find((c) => c.id === cc.currentclassId);
                                          if (foundClass) {
                                            originalClass = foundClass;
                                          }
                                        });
                                        return (
                                          <span key={cc.id}>
                                            {cc.name}
                                            {originalClass
                                              ? ` (原課堂: ${originalClass.title}, 課程: ${
                                                  originalClass.class_course.course_name || "無課程名稱"
                                                })`
                                              : " (原課堂: 未找到)"}{" "}
                                          </span>
                                        );
                                      })}
                                    </p>
                                    <Link href={`/lesson/${cls.id}`}>
                                      <button className="mr-2 rounded bg-blue-300 px-2 py-1 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300">
                                        課堂
                                      </button>
                                    </Link>
                                    <button
                                      className="mr-2 rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
                                      onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
                                    >
                                      {visibleRooms[`${room.id}-${cls.id}`] ? "顯示簡化" : "顯示詳情"}
                                    </button>
                                    <button
                                      className={`mr-2 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ${
                                        cls.isshow
                                          ? "bg-red-500 hover:bg-red-600"
                                          : "bg-green-500 hover:bg-green-600"
                                      }`}
                                      onClick={() => handleToggleClassVisibility(cls.id, !cls.isshow)}
                                      disabled={isPending}
                                    >
                                      {cls.isshow ? "隱藏" : "顯示"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          {room.Class.length === 0 && room.Course.length > 0 && (
                            <div className="text-white">
                              <p>課程：{room.Course.filter((course) => course.isshow).map((course) => course.course_name).join(", ")}</p>
                              <p>無具體課堂安排</p>
                            </div>
                          )}
                        </th>
                      ))}
                      <th className="border border-white/30"></th>
                      {filteredClassRooms.map((room) => (
                        <th
                          key={`${room.id}-day2-${slotIndex}`}
                          className="border border-white/30 p-2 hover:bg-blue-300/20 transition-all duration-300"
                        >
                          {room.Class
                            .filter((cls) => {
                              const classDate = cls.class_date;
                              const startTime = cls.class_start_time;
                              const slotStart = slot.split("-")[0].replace(":", "");
                              return classDate === dates[1].date && startTime === slotStart;
                            })
                            .map((cls) => (
                              <div key={cls.id} className="text-white">
                                <h5
                                  className="cursor-pointer hover:text-cyan-200 transition-colors duration-300"
                                  onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
                                >
                                  {cls.title}
                                </h5>
                                {visibleRooms[`${room.id}-${cls.id}`] && (
                                  <div>
                                    <p>科目：{cls.class_subject}</p>
                                    <p>人數：{cls.persons}</p>
                                    <p>教師：{cls.teacher}</p>
                                    <p>年級：{cls.grade}</p>
                                    <p>
                                      學生:{" "}
                                      {cls.student.map((st) => (
                                        <span key={st.name}>{st.name} </span>
                                      ))}
                                    </p>
                                    <p>
                                      請假學生:{" "}
                                      {cls.Leave.map((le) => (
                                        <span key={le.name}>{le.name} </span>
                                      ))}
                                    </p>
                                    <p>
                                      加堂學生:{" "}
                                      {cls.addClass.map((ac) => (
                                        <span key={ac.name}>{ac.name} </span>
                                      ))}
                                    </p>
                                    <p>
                                      掉堂學生:{" "}
                                      {cls.change_class.map((cc) => {
                                        let originalClass: Class | undefined;
                                        classRooms.forEach((room) => {
                                          const foundClass = room.Class.find((c) => c.id === cc.currentclassId);
                                          if (foundClass) {
                                            originalClass = foundClass;
                                          }
                                        });
                                        return (
                                          <span key={cc.id}>
                                            {cc.name}
                                            {originalClass
                                              ? ` (原課堂: ${originalClass.title}, 課程: ${
                                                  originalClass.class_course.course_name || "無課程名稱"
                                                })`
                                              : " (原課堂: 未找到)"}{" "}
                                          </span>
                                        );
                                      })}
                                    </p>
                                    <Link href={`/lesson/${cls.id}`}>
                                      <button className="mr-2 rounded bg-blue-300 px-2 py-1 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300">
                                        課堂
                                      </button>
                                    </Link>
                                    <button
                                      className="mr-2 rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
                                      onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
                                    >
                                      {visibleRooms[`${room.id}-${cls.id}`] ? "顯示簡化" : "顯示詳情"}
                                    </button>
                                    <button
                                      className={`mr-2 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ${
                                        cls.isshow
                                          ? "bg-red-500 hover:bg-red-600"
                                          : "bg-green-500 hover:bg-green-600"
                                      }`}
                                      onClick={() => handleToggleClassVisibility(cls.id, !cls.isshow)}
                                      disabled={isPending}
                                    >
                                      {cls.isshow ? "隱藏" : "顯示"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          {room.Class.length === 0 && room.Course.length > 0 && (
                            <div className="text-white">
                              <p>課程：{room.Course.filter((course) => course.isshow).map((course) => course.course_name).join(", ")}</p>
                              <p>無具體課堂安排</p>
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-cyan-200">沒有這學生／課程紀錄</div>
          )}
        </>
      )}
    </div>
  );
}