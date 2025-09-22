"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

interface SchoolExTime {
    id: string;
    name: string;
    grade: number;
    quarter: number;
    year:string;
    subject: string;
}


const ExTimeLists_Grade_Year_Quarter_Subject_extimelistsbysupadmin = () =>{

    const params = useParams<{grade : string; year : string; quarter: string; subject: string; schooldetailbyID:string; supadminid: string}>();
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    console.log("params :" , params)
    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';


    const [ GetExTimeListsDataById , setGetExTimeListsDataById ] = useState<SchoolExTime[]>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId && SubjectId) {
            const getExTimeListsDetail = async (SchoolId: string , GradeId:string,yearId:string ,QuarterId:string ,SubjectId: string) => {
                try {
                const res = await fetch(`/api/Extimelists_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SubjectId}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetExTimeListsDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getExTimeListsDetail(SchoolId,GradeId,YearId,QuarterId,SubjectId);
        }
    },[SchoolId,GradeId,YearId,QuarterId,SubjectId] )


    console.log("-- ExTimeLists Data : --",GetExTimeListsDataById,"-- end --")


    return(
        <>
            {/* ExTimeLists_Grade_Year_Quarter_Subject_extimelists
            {GetExTimeListsDataById.map((d)=>{
                if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.year == YearId && d.subject == SubjectId){
                    return(
                        <>
                            <br />
                        <Link className="text-stone-950 hover:text-gray-700" 
                        href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${d.id}`}
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
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/extimeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校名
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/extimeLists/${GradeId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {GradeId}
        </Link>
        <span className="mx-2">/</span>
          <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {YearId}
        </Link>
        <span className="mx-2">/</span>
                  <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {QuarterId}
        </Link>
        <span className="mx-2">/</span>
        <span>{SubjectId}</span>
      </nav>
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
                      href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${d.id}`}
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

export default ExTimeLists_Grade_Year_Quarter_Subject_extimelistsbysupadmin