
"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

interface SchoolData{
    id: string;
    name: string;
    grade: number;
    year: string;
    quarter: number;
    subject: string;
}

const ExPageLists_grade_year_quarter_subject_expagelists_bysupadmin = () => {
    const params = useParams<{grade: string; year: string; quarter: string; subject: string; schooldetailbyID:string; supadminid: string}>();
    const SchoolId = params?.schooldetailbyID as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);




    const [ GetExPageListsDataById , setGetExPageListsDataById ] = useState<SchoolData[]>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId ) {
            const getExPageListsDetail = async (SchoolId: string , GradeId:string,YearId:string ,QuarterId:string, SubjectId:string) => {
                try {
                const res = await fetch(`/api/Expagelists_by_id/${SchoolId}/${GradeId}/${YearId}/${QuarterId}/${SubjectId}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetExPageListsDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getExPageListsDetail(SchoolId,GradeId,YearId,QuarterId,SubjectId);
        }
    },[SchoolId,GradeId,YearId,QuarterId,SubjectId] )


    console.log("-- ExPageLists Data : --",GetExPageListsDataById,"-- end --")


      const gradeMapping: { [key: string]: string } = {
    "1": "小學1年級",
    "2": "小學2年級",
    "3": "小學3年級",
    "4": "小學4年級",
    "5": "小學5年級",
    "6": "小學6年級",
    "7": "初中1年級",
    "8": "初中2年級",
    "9": "初中3年級",
    "10": "高中1年級",
    "11": "高中2年級",
    "12": "高中3年級",
  };

    return(
        <>
            {/* ExPageLists_grade_year_quarter_subject_expagelists
            {GetExPageListsDataById.map((d)=>{
                if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.year == YearId && d.subject == SubjectId){
                    return(
                        <>
                            <br />
                            <Link
                                className="text-stone-950 hover:text-gray-700" 
                                href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${d.id}`} 
                                >
                                  name:{d.name}
                                  <br />
                            </Link>
                            <br />
                        </>
                    )

                }
            })} */}

 <div className="min-h-screen bg-gray-100 pt-20">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminid}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminid}/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學枚列表
        </Link>
        <span className="mx-2">/</span>
            <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}`} className="text-blue-600 hover:text-blue-800">
          學枚資料
        </Link>
        <span className="mx-2">/</span>
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists`} className="text-blue-600 hover:text-blue-800">
          學枚名
        </Link>
        <span className="mx-2">/</span>
                
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}`} className="text-blue-600 hover:text-blue-800">
          {GradeId}
        </Link>

        <span className="mx-2">/</span>
                
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}`} className="text-blue-600 hover:text-blue-800">
          {YearId}
        </Link>

        <span className="mx-2">/</span>
                
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}`} className="text-blue-600 hover:text-blue-800">
          {QuarterId}
        </Link>

        <span className="mx-2">/</span>
        <span>{SubjectId}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            考試卷 - {gradeMapping[GradeId] || GradeId} {YearId} 季度 {QuarterId} {SubjectId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${SchoolId}/expageLists/upload`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳考試卷
            </Link>
            <Link
              href={`/admin/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回科目列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">考試卷列表</h2>
          {GetExPageListsDataById.length === 0 ? (
            <p className="text-gray-500">尚未新增考試卷</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {GetExPageListsDataById.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/admin/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${exam.id}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300"
                >
                  <p className="text-gray-800 font-semibold">{exam.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

        </>
    )
}

export default ExPageLists_grade_year_quarter_subject_expagelists_bysupadmin