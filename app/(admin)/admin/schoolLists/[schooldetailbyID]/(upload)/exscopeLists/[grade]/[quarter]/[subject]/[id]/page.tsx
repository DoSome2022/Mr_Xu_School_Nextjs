"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface SchoolExScopeData {
  name: string;
  img: string;
  grade: number;
  quarter: number;
  subject: string;
  schooldetailbyID: string;
}

const ExScopeLists_Grade_Subject_exscpelists = () => {
  const params = useParams<{
    grade: string;
    quarter: string;
    subject: string;
    id: string;
    schooldetailbyID: string;
  }>();
  const SchoolId = params?.schooldetailbyID as string;
  const GradeId = params?.grade as string;
  const QuarterId = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";
  const ExScopeListById = params?.id as string;

  const [GetExScopeListDetailDataById, setGetExScopeListDetailDataById] = useState<
    SchoolExScopeData[]
  >([]);

  useEffect(() => {
    if (SchoolId && GradeId && QuarterId && SubjectId && ExScopeListById) {
      const getExScopeListDetailById = async (
        SchoolId: string,
        GradeId: string,
        QuarterId: string,
        SubjectId: string,
        ExScopeListById: string
      ) => {
        try {
          const res = await fetch(
            `/api/Exscopelists_detail_data_by_id/${SchoolId}/${GradeId}/${QuarterId}/${SubjectId}/${ExScopeListById}`
          );
          if (!res.ok) {
            throw new Error("無法連線！");
          }
          const result = await res.json();
          setGetExScopeListDetailDataById(result);
        } catch (error) {
          console.error(error);
        }
      };
      getExScopeListDetailById(SchoolId, GradeId, QuarterId, SubjectId, ExScopeListById);
    }
  }, [SchoolId, GradeId, QuarterId, SubjectId, ExScopeListById]);

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">試卷詳情</h1>

          {GetExScopeListDetailDataById.length === 0 ? (
            <div className="text-gray-700 text-sm">暫無試卷詳情資料</div>
          ) : (
            <div className="space-y-6">
              {GetExScopeListDetailDataById.map((d) => {
                if (
                  d.grade === Number(GradeId) &&
                  d.quarter === Number(QuarterId) &&
                  d.subject === SubjectId &&
                  d.schooldetailbyID === SchoolId
                ) {
                  return (
                    <div key={d.name} className="p-4 bg-gray-50 rounded-md">
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

export default ExScopeLists_Grade_Subject_exscpelists;