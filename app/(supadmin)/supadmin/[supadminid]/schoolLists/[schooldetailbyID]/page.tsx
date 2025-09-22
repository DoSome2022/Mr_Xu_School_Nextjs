"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import SchoolDetailListsbysupadmin from "@/components/CreateForm/SUPADMIN/DatasLIsts/Sup-SchoolDetailLists";

// 定義資料的介面
interface SchoolData {
  id: string;
  school_name: string; // 與 School 介面保持一致
  // 添加其他相關欄位
}

interface SchoolExDay {
  id: string;
  title: string;
  grade: string;
  subject: string;
  quarter: string;
  year: string;
  EX_Day: string;
}

const SchoolDetailbysupadmin = () => {
  const params = useParams();
  const SchoolId = params?.schooldetailbyID as string;
  const supadminid = params?.supadminid as string;
  console.log("supadminid:", supadminid);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];
    return `${year}/${month}/${day} (${weekday})`;
  };

  const [GetSchoolDataById, setGetSchoolDataById] = useState<SchoolData[] | null>(null);
  const [GetSchoolExDayLists, setGetSchoolExDayLists] = useState<SchoolExDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (SchoolId) {
      const fetchSchoolDetail = async (id: string) => {
        try {
          setLoading(true);
          const res = await fetch(`/api/School_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法獲取學校資料！");
          }
          const result = await res.json();
          setGetSchoolDataById(result);
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };

      const fetchSchoolExDay = async (id: string) => {
        try {
          const res = await fetch(`/api/School_Ex_Day_by_id_Lists/${id}`);
          if (!res.ok) {
            throw new Error("無法獲取考試日期資料！");
          }
          const result = await res.json();
          setGetSchoolExDayLists(result);
        } catch (error) {
          setError((error as Error).message);
        }
      };

      fetchSchoolDetail(SchoolId);
      fetchSchoolExDay(SchoolId);
    }
  }, [SchoolId]);

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

  console.log('GetSchoolExDayLists:', GetSchoolExDayLists);

  return (
    <>
      {/* <span>學校詳情</span>

      <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/edit`}>
        更改
      </Link>
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/createSchoolEXDay`}>
        新增學校考試時間
      </Link>
      <br />
      <SchoolDetailListsbysupadmin data={GetSchoolDataById} />
      <br />
      <br /><br /><br /><br />
      {GetSchoolExDayLists.length > 0 ? (
        GetSchoolExDayLists.map((d, index) => (
          <div key={index}>
            <p>標題: {d.title}</p>
            <p>年級: {d.grade}</p>
            <p>科目: {d.subject}</p>
            <p>季度: {d.quarter}</p>
            <p>年份: {d.year}</p>
            <p>考試日期: {formatDate(d.EX_Day)}</p>
            <br />
          </div>
        ))
      ) : (
        <p>無考試日期資料</p>
      )} */}

 <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">學校詳情</h1>
          <div className="flex space-x-4">
            <Link
              href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/edit`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              更改學校
            </Link>
            <Link
              href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/createSchoolEXDay`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              新增考試時間
            </Link>
            <Link
              href="/supadmin/${supadminid}/schoolLists"
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回學校列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-8">
          <SchoolDetailListsbysupadmin data={GetSchoolDataById} supadminid={supadminid}/>
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

    </>
  );
};

export default SchoolDetailbysupadmin;