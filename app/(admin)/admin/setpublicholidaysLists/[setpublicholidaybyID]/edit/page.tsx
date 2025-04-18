"use client";

import Public_Holidays_Edit_Form from "@/components/UpdateForm/editSetPublicHolidays-Form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditPublicHolidaysPage = () => {
  const param = useParams();
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
      <h1>Edit PublicHolidays</h1>
      <Public_Holidays_Edit_Form PublicHolidays={GetPublicHolidaysById} />
    </div>
  );
};

export default EditPublicHolidaysPage;