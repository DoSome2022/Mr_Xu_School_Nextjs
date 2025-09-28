"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

interface SchoolName {
    id: string;
    name: string;
    grade: number;
    quarter: number;
    subject: string;
}
const ExScopeLists_Grade_Subject_exscpelistsbysupadmin = () => {

    const params = useParams<{grade : string ; quarter: string ; subject: string ; schooldetailbyID: string ; supadminid: string ;}>();
    console.log("params :" , params)
    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as string;
    const QuarterId = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) :'';
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    const [ GetExScopeListsDataById , setGetExScopeListsDataById ] = useState<SchoolName[]>([]);

    useEffect(() =>{
        if(SchoolId && GradeId && QuarterId && SubjectId) {
            const getExScopeListsDetail = async (SchoolId: string  , GradeId:string ,QuarterId:string ,SubjectId: string) => {
                try {
                const res = await fetch(`/api/Exscopelists_by_id/${SchoolId}/${GradeId}/${QuarterId}/${SubjectId}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetExScopeListsDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getExScopeListsDetail(SchoolId,GradeId,QuarterId,SubjectId);
        }
    },[SchoolId,GradeId,QuarterId,SubjectId] )


    console.log("-- ExScopeLists Data : --",GetExScopeListsDataById,"-- end --")


    return(
        <>
            {/* ExScopeLists_Grade_Subject_exscpelists
            {GetExScopeListsDataById.map((d)=>{
                if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.subject == SubjectId){
                    return(
                        <>
                    
                <br />
                    <Link className="text-stone-950 hover:text-gray-700" 
                        href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/${SubjectId}/${d.id}`}
                    >
                        name:{d.name}
                    </Link>
                <br />    
                        </>
                    )

                }
            })} */}

    <div className="min-h-screen bg-gray-100 pt-20">
              {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm px-4 sm:px-6 lg:px-8">
        <Link href={`/supadmin/${supadminid}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminid}/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學校列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校資料
        </Link>
                <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試範圍
        </Link>
        

        <span className="mx-2">/</span>
                <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${GradeId}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          {GradeId}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          {QuarterId}
        </Link>
        <span className="mx-2">/</span>
        <span>{SubjectId}</span>
      </nav>
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
                      href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/${SubjectId}/${d.id}`}
                      className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300 text-gray-800 font-medium text-center"
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

        </>
    )
}

export default ExScopeLists_Grade_Subject_exscpelistsbysupadmin