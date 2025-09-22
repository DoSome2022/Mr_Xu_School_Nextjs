"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DayData {
  date: string;
  start_time: string;
  end_time: string;
  lesson: string;
}

interface Weekdays {
  date: string;
  start_time: string;
  end_time: string;
  lesson: string;
}

interface TimeTemplateData {
  id: string;
  publicholiday_model: {
    [prop: number]: string;
  };
  title: string;
  day_start: string;
  day_end: string;
  start_time: string;
  end_time: string;
  weekdays: Weekdays[];
  days: DayData[];
  grade: number;
  lesson: string;
}

const TimeTemplatebyId: React.FC = () => {
  const param = useParams();
  const TimeTempById = param?.timetemplatebyId as string;
  const [GetTimeTempById, setGetTimeTempById] = useState<TimeTemplateData[]>([]);

  useEffect(() => {
    const timetempbyid = async (id: string) => {
      const res = await fetch(`/api/TimeTemplate_Lists_by_id/${id}`);
      if (!res.ok) {
        throw new Error("斷線！");
      }
      const result = await res.json();
      setGetTimeTempById(result);
    };
    timetempbyid(TimeTempById);
  }, [TimeTempById]);

  console.log("-- Time Template by ID : --", GetTimeTempById, "-- END --");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
      <div className="bg-white shadow-lg rounded-md p-6">
        <h1 className="text-xl font-semibold text-[#80A8BD] mb-6">
          時間模組詳情
        </h1>
        {GetTimeTempById.length === 0 ? (
          <p className="text-gray-700 text-sm font-medium">載入中...</p>
        ) : (
          GetTimeTempById.map((d) => (
            <div
              key={d.id}
              className="space-y-4 border-b border-gray-200 pb-4 last:border-b-0"
            >
              <h2 className="text-lg font-medium text-[#80A8BD]">
                標題: {d.title}
              </h2>
              <p className="text-sm font-medium text-gray-700">
                月開始時間: {d.day_start}
              </p>
              <p className="text-sm font-medium text-gray-700">
                月結束時間: {d.day_end}
              </p>
              <h3 className="text-base font-semibold text-[#80A8BD] mt-4">
                星期日子
              </h3>
              <ul className="space-y-2">
                {d.weekdays.map((wd, index) => (
                  <li
                    key={index}
                    className="text-sm font-medium text-gray-700 hover:text-cyan-200 transition-colors duration-300"
                  >
                    <span>日期: {wd.date}</span>,{" "}
                    <span>開始時間: {wd.start_time}</span>,{" "}
                    <span>結束時間: {wd.end_time}</span>,{" "}
                    <span>課節: {wd.lesson}</span>
                  </li>
                ))}
              </ul>
              <h3 className="text-base font-semibold text-[#80A8BD] mt-4">
                單獨日子
              </h3>
              <ul className="space-y-2">
                {d.days.map((sd, index) => (
                  <li
                    key={index}
                    className="text-sm font-medium text-gray-700 hover:text-cyan-200 transition-colors duration-300"
                  >
                    <span>日期: {sd.date}</span>,{" "}
                    <span>開始時間: {sd.start_time}</span>,{" "}
                    <span>結束時間: {sd.end_time}</span>,{" "}
                    <span>課節: {sd.lesson}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimeTemplatebyId;