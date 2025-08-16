"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SchoolName {
  id: string;
  name: string;
  grade: number;
  quarter: number;
  subject: string;
}

const ExScopeLists_Grade_Subject_exscpelists = () => {
  const params = useParams<{ grade: string; quarter: string; subject: string; schooldetailbyID: string }>();
  const SchoolId = params?.schooldetailbyID as string;
  const GradeId = params?.grade as string;
  const QuarterId = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";

  const [GetExScopeListsDataById, setGetExScopeListsDataById] = useState<SchoolName[]>([]);

  useEffect(() => {
    if (SchoolId && GradeId && QuarterId && SubjectId) {
      const getExScopeListsDetail = async (
        SchoolId: string,
        GradeId: string,
        QuarterId: string,
        SubjectId: string
      ) => {
        try {
          const res = await fetch(
            `/api/Exscopelists_by_id/${SchoolId}/${GradeId}/${QuarterId}/${SubjectId}`
          );
          if (!res.ok) {
            throw new Error("無法連線！");
          }
          const result = await res.json();
          setGetExScopeListsDataById(result);
        } catch (error) {
          console.error(error);
        }
      };
      getExScopeListsDetail(SchoolId, GradeId, QuarterId, SubjectId);
    }
  }, [SchoolId, GradeId, QuarterId, SubjectId]);

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">考試範圍 - 試卷列表</h1>

          {GetExScopeListsDataById.length === 0 ? (
            <div className="text-gray-700 text-sm">暫無試卷資料</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GetExScopeListsDataById.map((d) => {
                if (d.grade === Number(GradeId) && d.quarter === Number(QuarterId) && d.subject === SubjectId) {
                  return (
                    <Link
                      key={d.id}
                      href={`/admin/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/${SubjectId}/${d.id}`}
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

export default ExScopeLists_Grade_Subject_exscpelists;