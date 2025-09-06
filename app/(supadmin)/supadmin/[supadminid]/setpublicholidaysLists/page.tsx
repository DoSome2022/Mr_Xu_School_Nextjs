"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PublicHoliday {
  id: string;
  publicholiday: string[];
}

const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // 星期幾的映射
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  const dayOfWeek = days[date.getDay()];

  return `${year}/${month}/${day} (${dayOfWeek})`;
};

const SetPublicHolidaysListsbysupadmin = () => {
  const params = useParams();
  const supadminid = params?.supadminid as string;
  const [GetPublicHolidaysLists, setGetPublicHolidaysLists] = useState<PublicHoliday[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPublicHolidaysLists = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/PublicHoliday_Lists");
        if (!res.ok) {
          throw new Error("無法獲取公眾假期列表數據");
        }
        const result = await res.json();
        setGetPublicHolidaysLists(result);
      } catch (error: any) {
        console.error("獲取公眾假期數據失敗:", error);
        setError("無法載入公眾假期列表");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicHolidaysLists();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-medium">正在載入...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600">公眾假期列表</h1>
          <Link
            href={`/supadmin/${supadminid}/setpublicholidaysLists/createpublicholidays`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
          >
            創建公眾假期
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {GetPublicHolidaysLists.length === 0 ? (
            <p className="text-gray-500 text-sm font-medium">
              正在載入數據或無公眾假期記錄...
            </p>
          ) : (
            <div className="space-y-4">
              {GetPublicHolidaysLists.map((phl) => (
                <div
                  key={phl.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <Link
                    href={`/supadmin/${supadminid}/setpublicholidaysLists/${phl.id}/edit`}
                    className="text-blue-600 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                  >
                    <div>
                      <span className="font-semibold">公眾假期:</span>
                      <ul className="list-disc pl-6 mt-2">
                        {phl.publicholiday.map((date, index) => (
                          <li key={index} className="text-gray-600">
                            {formatDate(date)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetPublicHolidaysListsbysupadmin;