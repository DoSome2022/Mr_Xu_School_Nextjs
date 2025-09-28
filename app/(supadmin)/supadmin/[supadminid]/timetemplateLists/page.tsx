"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  publicholiday_model: { [key: number]: string };
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

const TimeTemplateListsbysupadmin: React.FC = () => {
  const params = useParams();
  const supadminid = params?.supadminid as string;
  const [GetTimeTempList, setGetTimeTempList] = useState<TimeTemplateData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTimeTemp = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/TimeTemplate_Lists", {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("無法獲取時間模板列表數據");
        }
        const result = await res.json();
        setGetTimeTempList(result);
      } catch (error: any) {
        console.error("獲取時間模板數據失敗:", error);
        setError("無法載入時間模板列表");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeTemp();
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
          <h1 className="text-3xl font-semibold text-blue-600">時間模板列表</h1>
          <Link
            href={`/supadmin/${supadminid}/timetemplateLists/createtimetemp`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
          >
            創建時間模板
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {GetTimeTempList.length === 0 ? (
            <p className="text-gray-500 text-sm font-medium">
              正在載入數據或無時間模板記錄...
            </p>
          ) : (
            <div className="space-y-4">
              {GetTimeTempList.map((d) => (
                <div
                  key={d.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <Link
                    href={`/supadmin/${supadminid}/timetemplateLists/${d.id}`}
                    className="text-blue-600 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-semibold">標題: {d.title}</span>
 <p>開始日子: {d.day_start}</p>
                                            <p>結束日期: {d.day_end}</p>
                                            
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

export default TimeTemplateListsbysupadmin;