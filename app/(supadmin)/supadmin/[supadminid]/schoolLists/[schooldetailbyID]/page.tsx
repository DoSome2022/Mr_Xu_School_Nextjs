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

  const [GetSchoolDataById, setGetSchoolDataById] = useState<SchoolData | null>(null);
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
    return <div>載入中...</div>;
  }

  if (error) {
    return <div>錯誤: {error}</div>;
  }

  if (!GetSchoolDataById) {
    return <div>無學校資料</div>;
  }

  console.log('GetSchoolExDayLists:', GetSchoolExDayLists);

  return (
    <>
      <span>學校詳情</span>

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
      )}
    </>
  );
};

export default SchoolDetailbysupadmin;