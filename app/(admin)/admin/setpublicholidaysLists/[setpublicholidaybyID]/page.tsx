// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// const SetPublicHolidaybyID = () => {
//   const param = useParams();
//   const PublicHolidayID = param?.setpublicholidaybyID as string;
//   const [GetPublicHolidaysById, setGetPublicHolidaysById] = useState([]);

//   useEffect(() => {
//     const fetchPublicHolidaysLists = async (id: any) => {
//       const res = await fetch(`/api/PublicHoliday_Lists_by_id/${id}`);
//       if (!res) {
//         throw new Error("斷線！");
//       }

//       const result = await res.json();

//       setGetPublicHolidaysById(result);
//     };

//     fetchPublicHolidaysLists(PublicHolidayID);
//   }, [PublicHolidayID]);

//   const formatDateString = (dateString: string) => {
//     const date = new Date(dateString);
//     const options: Intl.DateTimeFormatOptions = { 
//       year: "numeric", 
//       month: "2-digit", 
//       day: "2-digit", 
//       weekday: "short"
//     };
//     return date.toLocaleDateString("zh-HK", options).replace(/\//g, "-");
//   };

//   console.log("GetPublicHolidaysById: ", GetPublicHolidaysById, " END ");

//   return (
//     <div>
//       {GetPublicHolidaysById.map((d: any) => {
//         return (
//           <div key={d.id}>
//             <p>假期:
//               {d.publicholiday.map((holiday: string, index: number) => (
//                 <span key={index}>{formatDateString(holiday)}{index < d.publicholiday.length - 1 ? ", " : ""}</span>
//               ))}
//             </p>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default SetPublicHolidaybyID;


"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SetPublicHolidaybyID = () => {
  const param = useParams();
  const PublicHolidayID = param?.setpublicholidaybyID as string;
  const [GetPublicHolidaysById, setGetPublicHolidaysById] = useState([]);

  useEffect(() => {
    const fetchPublicHolidaysLists = async (id: any) => {
      const res = await fetch(`/api/PublicHoliday_Lists_by_id/${id}`,{                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
              });
      if (!res.ok) {
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
      weekday: "short",
    };
    return date.toLocaleDateString("zh-HK", options).replace(/\//g, "-");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow-lg rounded-md p-6">
        {GetPublicHolidaysById.length > 0 ? (
          GetPublicHolidaysById.map((d: any) => (
            <div key={d.id} className="space-y-4">
              <h3 className="text-lg font-semibold text-[#80A8BD]">
                公眾假期
              </h3>
              <p className="text-gray-700">
                {d.publicholiday.map((holiday: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block mr-2 hover:text-cyan-200 transition-colors duration-300"
                  >
                    {formatDateString(holiday)}
                    {index < d.publicholiday.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">無公眾假期資料</p>
        )}
      </div>
    </div>
  );
};

export default SetPublicHolidaybyID;