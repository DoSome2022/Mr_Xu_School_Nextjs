"use client";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from 'react';

export default function ShowCalendar({ events }:any) {
  const [Events, setEvents] = useState([]);
  const [CustomDates, setCustomDates] = useState([]);
  const [WeeklyDates, setWeeklyDates] = useState([]);

  useEffect(() => {
    if (events) {
      const formatted = events.map((event:any) => {
        if (event.class_date) {
          const newDate = event.class_date + 'T';
          return {
            title: event.title,
            start: `${newDate}${event.class_start_time}`,
            end: `${newDate}${event.class_end_time}`, // 可選：添加結束時間
            classroom: event.classroom,
            grade: event.grade,
            persons: event.persons,
          };
        }
        return null;
      }).filter(event => event !== null);

      setCustomDates(formatted);
    }
  }, [events]);

  useEffect(() => {
    if (events) {
      const weeklydata = events.map((event:any) => {
        if (event.freq === "weekly") {
          return {
            title: event.title,
            classroom: event.classroom,
            grade: event.grade,
            persons: event.persons,
            rrule: {
              freq: event.freq,
              dtstart: event.class_date + 'T' + event.class_start_time, // 設定開始日期
              byweekday: [weekdayMapping[event.byweekday] || 0], // 如果有 byweekday 屬性
            },
          };
        }
        return null;
      }).filter(event => event !== null);

      setWeeklyDates(weeklydata);
    }
  }, [events]);

  useEffect(() => {
    const mergedevent = [...CustomDates, ...WeeklyDates];
    setEvents(mergedevent);
  }, [CustomDates, WeeklyDates]);

  const renderEventContent = (eventInfo:any) => {
    return (
      <div className='custom-event-content'>
        <strong>標題:{eventInfo.event.title}</strong>
        <br />
        <span>課室:{eventInfo.event.extendedProps.classroom}</span>
        <br />
        <span>年級:{eventInfo.event.extendedProps.grade}</span>
        <br />
        <span>人數:{eventInfo.event.extendedProps.persons}</span>
      </div>
    );
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, rrulePlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "prev next",
        center: "title",
        right: "dayGridMonth,timeGridWeek"
      }}
      initialView='dayGridMonth'
      fixedWeekCount={true}
      displayEventTime={true}
      events={Events}
      eventContent={renderEventContent}
      handleWindowResize={true}
    />
  );
}

const weekdayMapping = {
  'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6,
};