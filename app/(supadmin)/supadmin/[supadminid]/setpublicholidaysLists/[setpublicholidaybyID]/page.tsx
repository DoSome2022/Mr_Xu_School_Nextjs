"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SetPublicHolidaybyIDbysupadmin = () => {
  const param = useParams();
    const supadminid = param?.supadminid as string;
    console.log("supadminid :", supadminid);
  const PublicHolidayID = param?.setpublicholidaybyID as string;
  const [GetPublicHolidaysById, setGetPublicHolidaysById] = useState([]);

  useEffect(() => {
    const fetchPublicHolidaysLists = async (id: any) => {
      const res = await fetch(`/api/PublicHoliday_Lists_by_id/${id}`);
      if (!res) {
        throw new Error("斷線！");
      }

      const result = await res.json();

      setGetPublicHolidaysById(result);
    };

    fetchPublicHolidaysLists(PublicHolidayID);
  }, [PublicHolidayID]);

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: "numeric", 
      month: "2-digit", 
      day: "2-digit", 
      weekday: "short"
    };
    return date.toLocaleDateString("zh-HK", options).replace(/\//g, "-");
  };

  console.log("GetPublicHolidaysById: ", GetPublicHolidaysById, " END ");

  return (
    <div>
      {GetPublicHolidaysById.map((d: any) => {
        return (
          <div key={d.id}>
            <p>假期:
              {d.publicholiday.map((holiday: string, index: number) => (
                <span key={index}>{formatDateString(holiday)}{index < d.publicholiday.length - 1 ? ", " : ""}</span>
              ))}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SetPublicHolidaybyIDbysupadmin;
