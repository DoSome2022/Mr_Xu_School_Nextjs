"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import useSWR from "swr";

// 定義接口
interface VisibleRooms {
  [key: string]: boolean;
}

interface GetTime {
  id: number;
  course_time: string;
}

interface GetRoom {
  id: string;
  room: string;
  Class: Class[];
}

interface Class {
  id: string;
  class_date: string;
  class_start_time: string;
  class_end_time: string;
  class_subject: string;
  teacher: string;
  persons: number;
  title: string;
  grade: number;
  class_course_id: string;
  class_course: {
    id: string;
    course_name: string;
    day_start: string;
    day_end: string;
    start_time: string;
    end_time: string;
  };
  student: Student[];
  Leave: Leave[];
  addClass: AddClass[];
  change_class: ChangeClass[];
}

interface Student {
  name: string;
}

interface Leave {
  name: string;
}

interface AddClass {
  name: string;
}

interface ChangeClass {
  id: string;
  name: string;
  currentclassId: string;
  targetclassId: string;
  date: string;
  class_date: string;
  createData: string;
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
    const startTime = formatTime(times[i]?.course_time || '');
    const endTime = formatTime(times[i + 2]?.course_time || '');
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

  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return [
    {
      date: today.toISOString().split('T')[0],
      label: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
      weekday: weekdays[today.getDay()],
    },
    {
      date: tomorrow.toISOString().split('T')[0],
      label: `${tomorrow.getFullYear()}年${tomorrow.getMonth() + 1}月${tomorrow.getDate()}日`,
      weekday: weekdays[tomorrow.getDay()],
    },
  ];
};

export default function ClassRoomCalendar() {
  const [classRooms, setClassRooms] = useState<GetRoom[]>([]);
  const [visibleRooms, setVisibleRooms] = useState<VisibleRooms>({});
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // 新增搜尋狀態

  const fetcher = async (url: string, init?: RequestInit): Promise<GetTime[]> => {
    const res = await fetch(url, init);
    const data = await res.json();
    if (!Array.isArray(data) || !data.every((item) => typeof item.id === 'number' && typeof item.course_time === 'string')) {
      throw new Error('API 資料格式不正確');
    }
    return data;
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(`${apiUrl}/api/course_data/coursetimes`, fetcher);

  useEffect(() => {
    const fetchClassRoom = async () => {
      try {
        const res = await fetch('/api/ClassRoom_Lists');
        if (!res.ok) {
          throw new Error("無法載入教室列表");
        }
        const result = await res.json();
        setClassRooms(result);

        const initialVisibleRooms: VisibleRooms = {};
        result.forEach((room: GetRoom) => {
          room.Class.forEach((cls: Class) => {
            initialVisibleRooms[`${room.id}-${cls.id}`] = true;
          });
        });
        setVisibleRooms(initialVisibleRooms);
      } catch (err) {
        console.error("教室載入錯誤:", err);
        setClassRooms([]);
      }
    };
    fetchClassRoom();
  }, []);

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

  // 處理搜尋輸入變化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const dates = getDates(baseDate);
  const timeSlots = data && Array.isArray(data) ? generateTimeSlots(data) : [];

  // 篩選課室和課堂
  const filteredRooms = selectedRoomId
    ? classRooms.filter((room) => room.id === selectedRoomId)
    : classRooms;

  // 根據搜尋詞篩選課堂
  const filteredClassRooms = filteredRooms
    .map((room) => ({
      ...room,
      Class: room.Class.filter((cls) => {
        if (!searchQuery) return true; // 無搜尋詞時顯示所有課堂
        const query = searchQuery.toLowerCase();
        const courseNameMatch = cls.class_course.course_name.toLowerCase().includes(query);
        const studentNameMatch = cls.student.some((st) => st.name.toLowerCase().includes(query));
        return courseNameMatch || studentNameMatch;
      }),
    }))
    .filter((room) => room.Class.length > 0); // 僅保留有匹配課堂的課室

  // 檢查是否有匹配結果
  const hasResults = filteredClassRooms.length > 0;

  console.log('classRooms :', classRooms);
  console.log('filteredClassRooms :', filteredClassRooms);

  return (
    <div className="mt-2.5 px-4">
      {error ? (
        <div className="p-4 text-red-500">錯誤: {error.message}</div>
      ) : isLoading ? (
        <div className="p-4">載入中...</div>
      ) : !data || !Array.isArray(data) ? (
        <div className="p-4 text-red-500">無效的資料格式</div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <ChevronLeftIcon className="h-8 w-8 cursor-pointer" onClick={handlePrevDay} />
            <ChevronRightIcon className="h-8 w-8 cursor-pointer" onClick={handleNextDay} />
          </div>

          {/* 搜尋框 */}
          <div className="mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="輸入課程名稱或學生姓名進行搜尋"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-[14%_43%_43%] gap-2 mt-4">
            <div></div>
            <h4 className="text-center font-bold">{dates[0].label}</h4>
            <h4 className="text-center font-bold">{dates[1].label}</h4>
          </div>
          <div className="grid grid-cols-[14%_43%_43%] gap-2">
            <div></div>
            <h5 className="text-center">{dates[0].weekday}</h5>
            <h5 className="text-center">{dates[1].weekday}</h5>
          </div>

          {hasResults ? (
            <table className="w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="w-[9%] border border-gray-300"></th>
                  {filteredClassRooms.map((room) => (
                    <th
                      key={`${room.id}-day1`}
                      className={`w-[15%] border border-gray-300 font-bold text-center cursor-pointer ${
                        selectedRoomId === room.id ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => handleRoomClick(room.id)}
                    >
                      {room.room}
                    </th>
                  ))}
                  <th className="w-[1%] border border-gray-300"></th>
                  {filteredClassRooms.map((room) => (
                    <th
                      key={`${room.id}-day2`}
                      className={`w-[15%] border border-gray-300 font-bold text-center cursor-pointer ${
                        selectedRoomId === room.id ? 'bg-blue-100' : ''
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
                    <th className="border border-gray-300 p-2">{slot}</th>
                    {filteredClassRooms.map((room) => (
                      <th key={`${room.id}-day1-${slotIndex}`} className="border border-gray-300 p-2 hover:bg-blue-50">
                        {room.Class
                          .filter((cls) => {
                            const classDate = cls.class_date;
                            const startTime = cls.class_start_time;
                            const slotStart = slot.split('-')[0].replace(':', '');
                            return classDate === dates[0].date && startTime === slotStart;
                          })
                          .map((cls) => (
                            <div key={cls.id}>
                              <h5
                                className="cursor-pointer"
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
                                    學生:{' '}
                                    {cls.student.map((st) => (
                                      <span key={st.name}>{st.name} </span>
                                    ))}
                                  </p>
                                  <p>
                                    請假學生:{' '}
                                    {cls.Leave.map((le) => (
                                      <span key={le.name}>{le.name} </span>
                                    ))}
                                  </p>
                                  <p>
                                    加堂學生:{' '}
                                    {cls.addClass.map((ac) => (
                                      <span key={ac.name}>{ac.name} </span>
                                    ))}
                                  </p>
                                  <p>
                                    掉堂學生:{' '}
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
                                          {originalClass ? (
                                            ` (原課堂: ${originalClass.title}, 課程: ${
                                              originalClass.class_course.course_name || '無課程名稱'
                                            })`
                                          ) : (
                                            ' (原課堂: 未找到)'
                                          )}{' '}
                                        </span>
                                      );
                                    })}
                                  </p>
                                  <Link href={`/lesson/${cls.id}`}>
                                    <button className="mr-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
                                      課堂
                                    </button>
                                  </Link>
                                  <button
                                    className="rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600"
                                    onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
                                  >
                                    {visibleRooms[`${room.id}-${cls.id}`] ? '顯示簡化' : '顯示詳情'}
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                      </th>
                    ))}
                    <th className="border border-gray-300"></th>
                    {filteredClassRooms.map((room) => (
                      <th key={`${room.id}-day2-${slotIndex}`} className="border border-gray-300 p-2 hover:bg-blue-50">
                        {room.Class
                          .filter((cls) => {
                            const classDate = cls.class_date;
                            const startTime = cls.class_start_time;
                            const slotStart = slot.split('-')[0].replace(':', '');
                            return classDate === dates[1].date && startTime === slotStart;
                          })
                          .map((cls) => (
                            <div key={cls.id}>
                              <h5
                                className="cursor-pointer"
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
                                    學生:{' '}
                                    {cls.student.map((st) => (
                                      <span key={st.name}>{st.name} </span>
                                    ))}
                                  </p>
                                  <p>
                                    請假學生:{' '}
                                    {cls.Leave.map((le) => (
                                      <span key={le.name}>{le.name} </span>
                                    ))}
                                  </p>
                                  <p>
                                    加堂學生:{' '}
                                    {cls.addClass.map((ac) => (
                                      <span key={ac.name}>{ac.name} </span>
                                    ))}
                                  </p>
                                  <p>
                                    掉堂學生:{' '}
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
                                          {originalClass ? (
                                            ` (原課堂: ${originalClass.title}, 課程: ${
                                              originalClass.class_course.course_name || '無課程名稱'
                                            })`
                                          ) : (
                                            ' (原課堂: 未找到)'
                                          )}{' '}
                                        </span>
                                      );
                                    })}
                                  </p>
                                  <Link href={`/lesson/${cls.id}`}>
                                    <button className="mr-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
                                      課堂
                                    </button>
                                  </Link>
                                  <button
                                    className="rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600"
                                    onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
                                  >
                                    {visibleRooms[`${room.id}-${cls.id}`] ? '顯示簡化' : '顯示詳情'}
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                      </th>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-500">沒有這學生／課程紀錄</div>
          )}
        </>
      )}
    </div>
  );
}

// "use client";
// import React from 'react';
// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
// import useSWR from "swr";

// // 定義接口
// interface VisibleRooms {
//   [key: string]: boolean;
// }

// interface GetTime {
//   id: number;
//   course_time: string;
// }

// interface GetRoom {
//   id: string;
//   room: string;
//   Class: Class[];
// }

// interface Class {
//   id: string;
//   class_date: string;
//   class_start_time: string;
//   class_end_time: string;
//   class_subject: string;
//   teacher: string;
//   persons: number;
//   title: string;
//   grade: number;
//   class_course_id: string;
//   class_course: {
//     id: string;
//     course_name: string;
//     day_start: string;
//     day_end: string;
//     start_time: string;
//     end_time: string;
//   };
//   student: Student[];
//   Leave: Leave[];
//   addClass: AddClass[];
//   change_class: ChangeClass[];
// }

// interface Student {
//   name: string;
// }

// interface Leave {
//   name: string;
// }

// interface AddClass {
//   name: string;
// }

// interface ChangeClass {
//   id: string;
//   name: string;
//   currentclassId: string;
//   targetclassId: string;
//   date: string;
//   class_date: string;
//   createData: string;
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
//     const startTime = formatTime(times[i]?.course_time || '');
//     const endTime = formatTime(times[i + 2]?.course_time || '');
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

//   const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
//   return [
//     {
//       date: today.toISOString().split('T')[0],
//       label: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
//       weekday: weekdays[today.getDay()],
//     },
//     {
//       date: tomorrow.toISOString().split('T')[0],
//       label: `${tomorrow.getFullYear()}年${tomorrow.getMonth() + 1}月${tomorrow.getDate()}日`,
//       weekday: weekdays[tomorrow.getDay()],
//     },
//   ];
// };

// export default function ClassRoomCalendar() {
//   const [classRooms, setClassRooms] = useState<GetRoom[]>([]);
//   const [visibleRooms, setVisibleRooms] = useState<VisibleRooms>({});
//   const [baseDate, setBaseDate] = useState(new Date());
//   const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null); // 新增狀態追蹤選中課室

//   const fetcher = async (url: string, init?: RequestInit): Promise<GetTime[]> => {
//     const res = await fetch(url, init);
//     const data = await res.json();
//     if (!Array.isArray(data) || !data.every((item) => typeof item.id === 'number' && typeof item.course_time === 'string')) {
//       throw new Error('API 資料格式不正確');
//     }
//     return data;
//   };
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
//   const { data, error, isLoading } = useSWR(`${apiUrl}/api/course_data/coursetimes`, fetcher);

//   useEffect(() => {
//     const fetchClassRoom = async () => {
//       try {
//         const res = await fetch('/api/ClassRoom_Lists');
//         if (!res.ok) {
//           throw new Error("無法載入教室列表");
//         }
//         const result = await res.json();
//         setClassRooms(result);

//         const initialVisibleRooms: VisibleRooms = {};
//         result.forEach((room: GetRoom) => {
//           room.Class.forEach((cls: Class) => {
//             initialVisibleRooms[`${room.id}-${cls.id}`] = true;
//           });
//         });
//         setVisibleRooms(initialVisibleRooms);
//       } catch (err) {
//         console.error("教室載入錯誤:", err);
//         setClassRooms([]);
//       }
//     };
//     fetchClassRoom();
//   }, []);

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

//   // 處理課室點擊事件
//   const handleRoomClick = (roomId: string) => {
//     setSelectedRoomId((prev) => (prev === roomId ? null : roomId));
//   };

//   const dates = getDates(baseDate);
//   const timeSlots = data && Array.isArray(data) ? generateTimeSlots(data) : [];

//   // 篩選要顯示的課室
//   const filteredRooms = selectedRoomId
//     ? classRooms.filter((room) => room.id === selectedRoomId)
//     : classRooms;

//   console.log('classRooms :', classRooms);

//   return (
//     <div className="mt-2.5 px-4">
//       {error ? (
//         <div className="p-4 text-red-500">錯誤: {error.message}</div>
//       ) : isLoading ? (
//         <div className="p-4">載入中...</div>
//       ) : !data || !Array.isArray(data) ? (
//         <div className="p-4 text-red-500">無效的資料格式</div>
//       ) : (
//         <>
//           <div className="flex items-center justify-between">
//             <ChevronLeftIcon className="h-8 w-8 cursor-pointer" onClick={handlePrevDay} />
//             <ChevronRightIcon className="h-8 w-8 cursor-pointer" onClick={handleNextDay} />
//           </div>

//           <div className="grid grid-cols-[14%_43%_43%] gap-2 mt-4">
//             <div></div>
//             <h4 className="text-center font-bold">{dates[0].label}</h4>
//             <h4 className="text-center font-bold">{dates[1].label}</h4>
//           </div>
//           <div className="grid grid-cols-[14%_43%_43%] gap-2">
//             <div></div>
//             <h5 className="text-center">{dates[0].weekday}</h5>
//             <h5 className="text-center">{dates[1].weekday}</h5>
//           </div>

//           <table className="w-full border border-gray-300">
//             <thead>
//               <tr>
//                 <th className="w-[9%] border border-gray-300"></th>
//                 {filteredRooms.map((room) => (
//                   <th
//                     key={`${room.id}-day1`}
//                     className={`w-[15%] border border-gray-300 font-bold text-center cursor-pointer ${
//                       selectedRoomId === room.id ? 'bg-blue-100' : ''
//                     }`}
//                     onClick={() => handleRoomClick(room.id)}
//                   >
//                     {room.room}
//                   </th>
//                 ))}
//                 <th className="w-[1%] border border-gray-300"></th>
//                 {filteredRooms.map((room) => (
//                   <th
//                     key={`${room.id}-day2`}
//                     className={`w-[15%] border border-gray-300 font-bold text-center cursor-pointer ${
//                       selectedRoomId === room.id ? 'bg-blue-100' : ''
//                     }`}
//                     onClick={() => handleRoomClick(room.id)}
//                   >
//                     {room.room}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {timeSlots.map((slot, slotIndex) => (
//                 <tr key={slotIndex}>
//                   <th className="border border-gray-300 p-2">{slot}</th>
//                   {filteredRooms.map((room) => (
//                     <th key={`${room.id}-day1-${slotIndex}`} className="border border-gray-300 p-2 hover:bg-blue-50">
//                       {room.Class
//                         .filter((cls) => {
//                           const classDate = cls.class_date;
//                           const startTime = cls.class_start_time;
//                           const slotStart = slot.split('-')[0].replace(':', '');
//                           return classDate === dates[0].date && startTime === slotStart;
//                         })
//                         .map((cls) => (
//                           <div key={cls.id}>
//                             <h5
//                               className="cursor-pointer"
//                               onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
//                             >
//                               {cls.title}
//                             </h5>
//                             {visibleRooms[`${room.id}-${cls.id}`] && (
//                               <div>
//                                 <p>科目：{cls.class_subject}</p>
//                                 <p>人數：{cls.persons}</p>
//                                 <p>教師：{cls.teacher}</p>
//                                 <p>年級：{cls.grade}</p>
//                                 <p>
//                                   學生:{' '}
//                                   {cls.student.map((st) => (
//                                     <span key={st.name}>{st.name} </span>
//                                   ))}
//                                 </p>
//                                 <p>
//                                   請假學生:{' '}
//                                   {cls.Leave.map((le) => (
//                                     <span key={le.name}>{le.name} </span>
//                                   ))}
//                                 </p>
//                                 <p>
//                                   加堂學生:{' '}
//                                   {cls.addClass.map((ac) => (
//                                     <span key={ac.name}>{ac.name} </span>
//                                   ))}
//                                 </p>
//                                 <p>
//                                   掉堂學生:{' '}
//                                   {cls.change_class.map((cc) => {
//                                     let originalClass: Class | undefined;
//                                     classRooms.forEach((room) => {
//                                       const foundClass = room.Class.find((c) => c.id === cc.currentclassId);
//                                       if (foundClass) {
//                                         originalClass = foundClass;
//                                       }
//                                     });
//                                     return (
//                                       <span key={cc.id}>
//                                         {cc.name}
//                                         {originalClass ? (
//                                           ` (原課堂: ${originalClass.title}, 課程: ${
//                                             originalClass.class_course.course_name || '無課程名稱'
//                                           })`
//                                         ) : (
//                                           ' (原課堂: 未找到)'
//                                         )}{' '}
//                                       </span>
//                                     );
//                                   })}
//                                 </p>
//                                 <Link href={`/lesson/${cls.id}`}>
//                                   <button className="mr-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
//                                     課堂
//                                   </button>
//                                 </Link>
//                                 <button
//                                   className="rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600"
//                                   onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
//                                 >
//                                   {visibleRooms[`${room.id}-${cls.id}`] ? '顯示簡化' : '顯示詳情'}
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                     </th>
//                   ))}
//                   <th className="border border-gray-300"></th>
//                   {filteredRooms.map((room) => (
//                     <th key={`${room.id}-day2-${slotIndex}`} className="border border-gray-300 p-2 hover:bg-blue-50">
//                       {room.Class
//                         .filter((cls) => {
//                           const classDate = cls.class_date;
//                           const startTime = cls.class_start_time;
//                           const slotStart = slot.split('-')[0].replace(':', '');
//                           return classDate === dates[1].date && startTime === slotStart;
//                         })
//                         .map((cls) => (
//                           <div key={cls.id}>
//                             <h5
//                               className="cursor-pointer"
//                               onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
//                             >
//                               {cls.title}
//                             </h5>
//                             {visibleRooms[`${room.id}-${cls.id}`] && (
//                               <div>
//                                 <p>科目：{cls.class_subject}</p>
//                                 <p>人數：{cls.persons}</p>
//                                 <p>教師：{cls.teacher}</p>
//                                 <p>年級：{cls.grade}</p>
//                                 <p>
//                                   學生:{' '}
//                                   {cls.student.map((st) => (
//                                     <span key={st.name}>{st.name} </span>
//                                   ))}
//                                 </p>
//                                 <p>
//                                   請假學生:{' '}
//                                   {cls.Leave.map((le) => (
//                                     <span key={le.name}>{le.name} </span>
//                                   ))}
//                                 </p>
//                                 <p>
//                                   加堂學生:{' '}
//                                   {cls.addClass.map((ac) => (
//                                     <span key={ac.name}>{ac.name} </span>
//                                   ))}
//                                 </p>
//                                 <p>
//                                   掉堂學生:{' '}
//                                   {cls.change_class.map((cc) => {
//                                     let originalClass: Class | undefined;
//                                     classRooms.forEach((room) => {
//                                       const foundClass = room.Class.find((c) => c.id === cc.currentclassId);
//                                       if (foundClass) {
//                                         originalClass = foundClass;
//                                       }
//                                     });
//                                     return (
//                                       <span key={cc.id}>
//                                         {cc.name}
//                                         {originalClass ? (
//                                           ` (原課堂: ${originalClass.title}, 課程: ${
//                                             originalClass.class_course.course_name || '無課程名稱'
//                                           })`
//                                         ) : (
//                                           ' (原課堂: 未找到)'
//                                         )}{' '}
//                                       </span>
//                                     );
//                                   })}
//                                 </p>
//                                 <Link href={`/lesson/${cls.id}`}>
//                                   <button className="mr-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
//                                     課堂
//                                   </button>
//                                 </Link>
//                                 <button
//                                   className="rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600"
//                                   onClick={() => toggleVisibility(`${room.id}-${cls.id}`)}
//                                 >
//                                   {visibleRooms[`${room.id}-${cls.id}`] ? '顯示簡化' : '顯示詳情'}
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// }