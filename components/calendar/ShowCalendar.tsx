// "use client";
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import rrulePlugin from '@fullcalendar/rrule';
// import interactionPlugin from "@fullcalendar/interaction";
// import { useEffect, useState } from 'react';

// export default function ShowCalendar({ events }:any) {
//   const [Events, setEvents] = useState([]);
//   const [CustomDates, setCustomDates] = useState([]);
//   const [WeeklyDates, setWeeklyDates] = useState([]);

//   useEffect(() => {
//     if (events) {
//       const formatted = events.map((event:any) => {
//         if (event.class_date) {
//           const newDate = event.class_date + 'T';
//           return {
//             title: event.title,
//             start: `${newDate}${event.class_start_time}`,
//             end: `${newDate}${event.class_end_time}`, // 可選：添加結束時間
//             classroom: event.classroom,
//             grade: event.grade,
//             persons: event.persons,
//           };
//         }
//         return null;
//       }).filter(event => event !== null);

//       setCustomDates(formatted);
//     }
//   }, [events]);

//   useEffect(() => {
//     if (events) {
//       const weeklydata = events.map((event:any) => {
//         if (event.freq === "weekly") {
//           return {
//             title: event.title,
//             classroom: event.classroom,
//             grade: event.grade,
//             persons: event.persons,
//             rrule: {
//               freq: event.freq,
//               dtstart: event.class_date + 'T' + event.class_start_time, // 設定開始日期
//               byweekday: [weekdayMapping[event.byweekday] || 0], // 如果有 byweekday 屬性
//             },
//           };
//         }
//         return null;
//       }).filter(event => event !== null);

//       setWeeklyDates(weeklydata);
//     }
//   }, [events]);

//   useEffect(() => {
//     const mergedevent = [...CustomDates, ...WeeklyDates];
//     setEvents(mergedevent);
//   }, [CustomDates, WeeklyDates]);

//   const renderEventContent = (eventInfo:any) => {
//     return (
//       <div className='custom-event-content'>
//         <strong>標題:{eventInfo.event.title}</strong>
//         <br />
//         <span>課室:{eventInfo.event.extendedProps.classroom}</span>
//         <br />
//         <span>年級:{eventInfo.event.extendedProps.grade}</span>
//         <br />
//         <span>人數:{eventInfo.event.extendedProps.persons}</span>
//       </div>
//     );
//   };

//   return (
//     <FullCalendar
//       plugins={[dayGridPlugin, rrulePlugin, timeGridPlugin, interactionPlugin]}
//       headerToolbar={{
//         left: "prev next",
//         center: "title",
//         right: "dayGridMonth,timeGridWeek"
//       }}
//       initialView='dayGridMonth'
//       fixedWeekCount={true}
//       displayEventTime={true}
//       events={Events}
//       eventContent={renderEventContent}
//       handleWindowResize={true}
//     />
//   );
// }

// const weekdayMapping = {
//   'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6,
// };


"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { EventInput, EventContentArg } from "@fullcalendar/core";

// 定義與 Prisma Class 模型對應的介面
interface Class {
  id: string;
  title: string;
  class_date: string;
  class_start_time: string;
  class_end_time: string;
  classroom: string;
  grade: number;
  persons: number;
  freq?: string;
  byweekday?: string | string[];
}

// 組件 props 介面
interface ShowCalendarProps {
  events: Class[];
}

const ShowCalendar = ({ events }: ShowCalendarProps) => {
  const [Events, setEvents] = useState<EventInput[]>([]);
  const [CustomDates, setCustomDates] = useState<EventInput[]>([]);
  const [WeeklyDates, setWeeklyDates] = useState<EventInput[]>([]);

  useEffect(() => {
    if (events) {
      const formatted = events
        .filter((event) => event.class_date && event.class_start_time)
        .map((event) => ({
          title: event.title,
          start: `${event.class_date}T${event.class_start_time}`,
          end: event.class_end_time ? `${event.class_date}T${event.class_end_time}` : undefined,
          extendedProps: {
            classroom: event.classroom,
            grade: event.grade,
            persons: event.persons,
          },
        }));

      setCustomDates(formatted);
    }
  }, [events]);

  useEffect(() => {
    if (events) {
      const weeklyData = events
        .filter((event) => event.freq === "weekly" && event.class_date && event.class_start_time)
        .map((event) => {
          const byweekday = Array.isArray(event.byweekday)
            ? event.byweekday.map((day) => weekdayMapping[day] ?? 0)
            : event.byweekday
              ? [weekdayMapping[event.byweekday] ?? 0]
              : [];

          return {
            title: event.title,
            extendedProps: {
              classroom: event.classroom,
              grade: event.grade,
              persons: event.persons,
            },
            rrule: {
              freq: event.freq,
              dtstart: `${event.class_date}T${event.class_start_time}`,
              byweekday,
            },
          };
        });

      setWeeklyDates(weeklyData);
    }
  }, [events]);

  useEffect(() => {
    const mergedEvents = [...CustomDates, ...WeeklyDates];
    setEvents(mergedEvents);
  }, [CustomDates, WeeklyDates]);

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div className="custom-event-content p-2">
        <strong>標題: {eventInfo.event.title}</strong>
        <br />
        <span>課室: {eventInfo.event.extendedProps.classroom}</span>
        <br />
        <span>年級: {eventInfo.event.extendedProps.grade}</span>
        <br />
        <span>人數: {eventInfo.event.extendedProps.persons}</span>
      </div>
    );
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, rrulePlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "prev next",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      initialView="dayGridMonth"
      fixedWeekCount={true}
      displayEventTime={true}
      events={Events}
      eventContent={renderEventContent}
      handleWindowResize={true}
    />
  );
};

const weekdayMapping: { [key: string]: number } = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

export default ShowCalendar;