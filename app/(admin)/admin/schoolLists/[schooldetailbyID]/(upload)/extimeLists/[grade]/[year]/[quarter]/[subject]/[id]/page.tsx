"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SchoolExTimeData {
  name: string;
  img: string;
  grade: number;
  quarter: number;
  subject: string;
  year: string;
  student_ex_timetable_id: string;
}

const ExTimeLists_Grade_Year_Quarter_Subject_extimelists_Detail = () => {
  const params = useParams<{
    grade: string;
    year: string;
    quarter: string;
    subject: string;
    id: string;
    schooldetailbyID: string;
  }>();
  const SchoolId = params?.schooldetailbyID as string;
  const GradeId = params?.grade as string;
  const YearId = params?.year as string;
  const QuarterId = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";
  const ExTimeListById = params?.id as string;

  const [GetExTimeListsDetailDataById, setGetExTimeListsDetailDataById] = useState<
    SchoolExTimeData[]
  >([]);

  useEffect(() => {
    if (SchoolId && GradeId && YearId && QuarterId && SubjectId && ExTimeListById) {
      const getExTimeListsDetailById = async (
        SchoolId: string,
        GradeId: string,
        YearId: string,
        QuarterId: string,
        SubjectId: string,
        ExTimeListById: string
      ) => {
        try {
          const res = await fetch(
            `/api/Extimelists_detail_data_by_id/${SchoolId}/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${ExTimeListById}`
          );
          if (!res.ok) {
            throw new Error("無法連線！");
          }
          const result = await res.json();
          setGetExTimeListsDetailDataById(result);
        } catch (error) {
          console.error(error);
        }
      };
      getExTimeListsDetailById(SchoolId, GradeId, YearId, QuarterId, SubjectId, ExTimeListById);
    }
  }, [SchoolId, GradeId, YearId, QuarterId, SubjectId, ExTimeListById]);
  // 下載圖片的功能
  const handleDownload = async (imgUrl: string, fileName: string) => {
    try {
      const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(imgUrl)}`);
      if (!response.ok) {
        throw new Error("無法下載圖片");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "Extime-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("下載圖片失敗:", error);
      alert("下載圖片失敗，請稍後再試");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm px-4 sm:px-6 lg:px-8">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學校列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/schoolLists/${SchoolId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校資料
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          年級 {GradeId}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {YearId}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          季度 {QuarterId}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${encodeURIComponent(SubjectId)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SubjectId}
        </Link>
        <span className="mx-2">/</span>
        <span>{GetExTimeListsDetailDataById[0]?.name || "考試時間表詳情"}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">考試時間表詳情</h1>

          {GetExTimeListsDetailDataById.length === 0 ? (
            <div className="text-gray-700 text-sm">暫無試卷詳情資料</div>
          ) : (
            <div className="space-y-6">
              {GetExTimeListsDetailDataById.map((d) => {
                if (
                  d.grade === Number(GradeId) &&
                  d.quarter === Number(QuarterId) &&
                  d.subject === SubjectId &&
                  d.year === YearId &&
                  d.student_ex_timetable_id === ExTimeListById
                ) {
                  return (
                    <div key={d.student_ex_timetable_id} className="p-4 bg-gray-50 rounded-md">
                      <h2 className="text-lg font-medium text-gray-800 mb-4">{d.name}</h2>
                      {d.img && (
                        <Image
                          width={500}
                          height={500}
                          src={d.img}
                          alt={d.name}
                          className="rounded-md shadow-md"
                        />
                        
                      )}
                     <button
                        onClick={() => handleDownload(d.img, `${d.name}.jpg`)}
                        className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                      >
                        下載圖片
                      </button>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExTimeLists_Grade_Year_Quarter_Subject_extimelists_Detail;