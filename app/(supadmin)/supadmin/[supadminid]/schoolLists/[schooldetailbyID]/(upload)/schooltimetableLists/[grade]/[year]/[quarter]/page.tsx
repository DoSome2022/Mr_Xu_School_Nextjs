"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

import Link from "next/link";

interface SchoolData {
    id: string;
    name: string;
}

const SchoolTimeTableLists_Grade_Year_Quarter_Subjectbysupadmin = () =>{

    const params = useParams<{grade : string; year : string; quarter: string; schooldetailbyID:  string;supadminid: string;}>();
    console.log("params : ",params)
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;

    const [ GetSchoolTimeTableListsById , setGetSchoolTimeTableListsById ] = useState<SchoolData[]>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId ) {
            const getSchoolTimeTableListsDetail = async (SchoolId: string ,yearId:string , GradeId:string ,QuarterId:string ) => {
                try {
                const res = await fetch(`/api/Schooltimetablelists_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetSchoolTimeTableListsById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getSchoolTimeTableListsDetail(SchoolId,YearId,GradeId,QuarterId);
        }
    },[SchoolId,YearId,GradeId,QuarterId] )


    console.log("-- ExPageLists Data : --",GetSchoolTimeTableListsById,"-- end --")




    return(
        <>
            {/* SchoolTimeTableLists_Grade_Year_Quarter

            {GetSchoolTimeTableListsById.map((d)=>{
            return(
                <>
                                        <br />
                    <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}/${QuarterId}/${d.id}`}
                >
                   name:{d.name}
                    </Link>

                        <br />
                
                
                </>
            )
        })} */}
        <div className="min-h-screen bg-gray-50">
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
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校名
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {GradeId}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {YearId}
        </Link>
        <span className="mx-2">/</span>
        <span>{QuarterId}</span>
      </nav>
            
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        School Time Table Lists - Grade {GradeId}, Year {YearId}, Quarter {QuarterId}
                    </h1>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {GetSchoolTimeTableListsById.map((d) => (
                            <Link 
                                key={d.id}
                                href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}/${QuarterId}/${d.id}`}
                                className="block p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors duration-200"
                            >
                                <div className="font-medium text-gray-800 hover:text-orange-600">
                                    {d.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    {GetSchoolTimeTableListsById.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No data available
                        </div>
                    )}
                </div>
            </main>
        </div>
        </>
    )
}

export default SchoolTimeTableLists_Grade_Year_Quarter_Subjectbysupadmin