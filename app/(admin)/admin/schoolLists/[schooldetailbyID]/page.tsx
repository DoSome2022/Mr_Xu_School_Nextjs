"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SchoolDetailLists from "@/components/DatasLIsts/SchoolDetailLists";

interface SchoolExDay {
  id: string;
  title: string;
  grade: number;
  subject: string;
  year: string;
  quarter: number;
  EX_Day: string;
  createdAt: string;
  updatedAt: string;
}

interface School {
  id: string;
  school_name: string;
  // 可根據實際 API 返回結構添加其他字段
}

const SchoolDetail = () => {
  const params = useParams();
  const schoolId = params?.schooldetailbyID as string;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const weekday = weekdays[date.getDay()];
    return `${year}/${month}/${day} (${weekday})`;
  };

  const [GetSchoolDataById, setGetSchoolDataById] = useState<School | null>(null);
  const [GetSchoolExDayLists, setGetSchoolExDayLists] = useState<SchoolExDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (schoolId) {
      const fetchSchoolDetail = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/School_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法載入學校資料");
          }
          const result = await res.json();
          setGetSchoolDataById(result);
        } catch (err: any) {
          console.error("載入錯誤:", err);
          setError(err.message || "無法載入學校資料");
        }
      };

      const fetchSchoolExDay = async (id: string) => {
        try {
          const res = await fetch(`/api/School_Ex_Day_by_id_Lists/${id}`);
          if (!res.ok) {
            throw new Error("無法載入考試時間資料");
          }
          const result: SchoolExDay[] = await res.json();
          setGetSchoolExDayLists(result);
        } catch (err: any) {
          console.error("載入錯誤:", err);
          setError(err.message || "無法載入考試時間資料");
        }
      };

      Promise.all([fetchSchoolDetail(schoolId), fetchSchoolExDay(schoolId)]).finally(() => {
        setLoading(false);
      });
    } else {
      setError("無效的學校ID");
      setLoading(false);
    }
  }, [schoolId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !GetSchoolDataById) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無學校資料"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">學校詳情</h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${schoolId}/edit`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              更改學校
            </Link>
            <Link
              href={`/admin/schoolLists/${schoolId}/createSchoolEXDay`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              新增考試時間
            </Link>
            <Link
              href="/admin/schoolLists"
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回學校列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-8">
          <SchoolDetailLists data={GetSchoolDataById} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">考試時間列表</h2>
          {GetSchoolExDayLists.length === 0 ? (
            <p className="text-gray-500">尚未新增考試時間</p>
          ) : (
            <div className="space-y-4">
              {GetSchoolExDayLists.map((d: SchoolExDay) => (
                <div key={d.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <p className="text-gray-800"><span className="font-semibold">標題:</span> {d.title}</p>
                  <p className="text-gray-600"><span className="font-semibold">年級:</span> {d.grade}</p>
                  <p className="text-gray-600"><span className="font-semibold">科目:</span> {d.subject}</p>
                  <p className="text-gray-600"><span className="font-semibold">季度:</span> {d.quarter}</p>
                  <p className="text-gray-600"><span className="font-semibold">年份:</span> {d.year}</p>
                  <p className="text-gray-500"><span className="font-semibold">考試日期:</span> {formatDate(d.EX_Day)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolDetail;