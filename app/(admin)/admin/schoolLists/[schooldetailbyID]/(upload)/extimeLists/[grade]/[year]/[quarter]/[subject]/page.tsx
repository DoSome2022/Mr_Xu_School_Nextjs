"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SchoolExTime {
  id: string;
  name: string;
  grade: number;
  quarter: number;
  year: string;
  subject: string;
}

const ExTimeLists_Grade_Year_Quarter_Subject_extimelists = () => {
  const params = useParams<{
    grade: string;
    year: string;
    quarter: string;
    subject: string;
    schooldetailbyID: string;
  }>();
  const SchoolId = params?.schooldetailbyID as string;
  const GradeId = params?.grade as string;
  const YearId = params?.year as string;
  const QuarterId = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";

  const [GetExTimeListsDataById, setGetExTimeListsDataById] = useState<SchoolExTime[]>([]);

  useEffect(() => {
    if (SchoolId && GradeId && YearId && QuarterId && SubjectId) {
      const getExTimeListsDetail = async (
        SchoolId: string,
        GradeId: string,
        YearId: string,
        QuarterId: string,
        SubjectId: string
      ) => {
        try {
          const res = await fetch(
            `/api/Extimelists_by_id/${SchoolId}/${GradeId}/${YearId}/${QuarterId}/${SubjectId}`
          );
          if (!res.ok) {
            throw new Error("無法連線！");
          }
          const result = await res.json();
          setGetExTimeListsDataById(result);
        } catch (error) {
          console.error(error);
        }
      };
      getExTimeListsDetail(SchoolId, GradeId, YearId, QuarterId, SubjectId);
    }
  }, [SchoolId, GradeId, YearId, QuarterId, SubjectId]);

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">考試時間表 - 試卷列表</h1>

          {GetExTimeListsDataById.length === 0 ? (
            <div className="text-gray-700 text-sm">暫無試卷資料</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GetExTimeListsDataById.map((d) => {
                if (
                  d.grade === Number(GradeId) &&
                  d.quarter === Number(QuarterId) &&
                  d.year === YearId &&
                  d.subject === SubjectId
                ) {
                  return (
                    <Link
                      key={d.id}
                      href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${d.id}`}
                      className="block p-4 bg-gray-50 rounded-md hover:bg-[#e7915b] hover:text-white transition-colors duration-300 text-gray-800 font-medium text-center"
                    >
                      {d.name}
                    </Link>
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

export default ExTimeLists_Grade_Year_Quarter_Subject_extimelists;