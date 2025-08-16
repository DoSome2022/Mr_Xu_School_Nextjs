"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Define TypeScript interfaces for the data structure
interface PublicHoliday {
  id: string;
  craetedAt: string; // Note: 'craetedAt' is likely a typo in the data; should be 'createdAt'
  updatedAt: string;
  publicholiday: string[];
}

const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const days = ["日", "一", "二", "三", "四", "五", "六"];
  const dayOfWeek = days[date.getDay()];

  return `${year}/${month}/${day} (${dayOfWeek})`;
};

const SetPublicHolidaysLists: React.FC = () => {
  const [GetPublicHolidaysLists, setGetPublicHolidaysLists] = useState<
    PublicHoliday[]
  >([]);

  useEffect(() => {
    const fetchPublicHolidaysLists = async () => {
      try {
        const res = await fetch("/api/PublicHoliday_Lists");
        if (!res.ok) {
          throw new Error("無法連線至伺服器");
        }
        const result: PublicHoliday[] = await res.json();
        setGetPublicHolidaysLists(result);
      } catch (error) {
        console.error("獲取公眾假期列表失敗:", error);
      }
    };

    fetchPublicHolidaysLists();
  }, []);

  console.log("GetPublicHolidaysLists:", GetPublicHolidaysLists);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-16">
      <Link
        href="/admin/setpublicholidaysLists/createpublicholidays"
        className="inline-block bg-[#e7915b] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300"
      >
        創建公眾假期
      </Link>
      <div className="mt-6 space-y-4">
        {GetPublicHolidaysLists.map((phl) => (
          <div
            key={phl.id}
            className="bg-white shadow-lg rounded-md p-4 hover:bg-[#e7915b] hover:bg-opacity-10 transition-colors duration-300"
          >
            <Link
              href={`/admin/setpublicholidaysLists/${phl.id}/edit`}
              className="text-[#e7915b] hover:text-cyan-200 font-medium transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold">公眾假期</h3>
              <ul className="mt-2 space-y-2">
                {phl.publicholiday.map((date, index) => (
                  <li key={index} className="text-gray-700 text-sm font-medium">
                    {formatDate(date)}
                  </li>
                ))}
              </ul>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetPublicHolidaysLists;