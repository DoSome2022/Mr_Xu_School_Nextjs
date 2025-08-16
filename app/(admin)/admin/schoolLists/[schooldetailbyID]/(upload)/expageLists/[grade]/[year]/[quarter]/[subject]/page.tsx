
// "use client";

// import Link from "next/link";
// import { useParams } from 'next/navigation';
// import { useEffect, useState } from "react";

// interface SchoolData{
//     id: string;
//     name: string;
//     grade: number;
//     year: string;
//     quarter: number;
//     subject: string;
// }

// const ExPageLists_grade_year_quarter_subject_expagelists = () => {
//     const params = useParams<{grade: string; year: string; quarter: string; subject: string; schooldetailbyID:string;}>();
//     const SchoolId = params?.schooldetailbyID as string;
//     const GradeId = params?.grade as string;
//     const YearId = params?.year as string;
//     const QuarterId = params?.quarter as string;
//     const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';




//     const [ GetExPageListsDataById , setGetExPageListsDataById ] = useState<SchoolData[]>([]);

//     useEffect(() =>{
//         if(SchoolId && YearId && GradeId && QuarterId ) {
//             const getExPageListsDetail = async (SchoolId: string , GradeId:string,yearId:string ,QuarterId:string, SubjectId:string) => {
//                 try {
//                 const res = await fetch(`/api/Expagelists_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SubjectId}`);
//                 if(!res.ok) {
//                     throw new Error("斷線！");
//                 }
//                 const result = await res.json();
//                 setGetExPageListsDataById(result);                    
//                 } catch (error) {
//                     console.error(error);
//                 }
//             };
//             getExPageListsDetail(SchoolId,GradeId,YearId,QuarterId,SubjectId);
//         }
//     },[SchoolId,GradeId,YearId,QuarterId,SubjectId] )


//     console.log("-- ExPageLists Data : --",GetExPageListsDataById,"-- end --")

//     return(
//         <>
//             ExPageLists_grade_year_quarter_subject_expagelists
//             {GetExPageListsDataById.map((d)=>{
//                 if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.year == YearId && d.subject == SubjectId){
//                     return(
//                         <>
//                             <br />
//                             <Link
//                                 className="text-stone-950 hover:text-gray-700" 
//                                 href={`/admin/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${d.id}`} 
//                                 >
//                                   name:{d.name}
//                                   <br />
//                             </Link>
//                             <br />
//                         </>
//                     )

//                 }
//             })}



//         </>
//     )
// }

// export default ExPageLists_grade_year_quarter_subject_expagelists


"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";

interface SchoolData {
  id: string;
  name: string;
  grade: number;
  year: string;
  quarter: number;
  subject: string;
}

const fetcher = (url: string, init?: RequestInit): Promise<SchoolData[]> =>
  fetch(url, init).then((res) => {
    if (!res.ok) throw new Error("無法載入考試卷資料");
    return res.json();
  });

const ExPageLists_grade_year_quarter_subject_expagelists = () => {
  const params = useParams();
  const schoolId = Array.isArray(params?.schooldetailbyID)
    ? params.schooldetailbyID[0]
    : params?.schooldetailbyID;
  const gradeId = Array.isArray(params?.grade) ? params.grade[0] : params?.grade;
  const yearId = Array.isArray(params?.year) ? params.year[0] : params?.year;
  const quarterId = Array.isArray(params?.quarter) ? params.quarter[0] : params?.quarter;
  const subjectId = params?.subject
    ? Array.isArray(params.subject)
      ? decodeURIComponent(params.subject[0])
      : decodeURIComponent(params.subject)
    : "";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    schoolId && gradeId && yearId && quarterId && subjectId
      ? `${apiUrl}/api/Expagelists_by_id/${schoolId}/${gradeId}/${yearId}/${quarterId}/${subjectId}`
      : null,
    fetcher
  );

  // 定義年級對應對象，與 ExPageLists 和 ExPageLists_year_grade 一致
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

  if (!schoolId || !gradeId || !yearId || !quarterId || !subjectId) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">
          無效的學校ID、年級、年份、季度或科目
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !data || !Array.isArray(data)) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">
          {error?.message || "無法載入考試卷資料"}
        </p>
      </div>
    );
  }

  const filteredData = data.filter(
    (d) =>
      d.grade === Number(gradeId) &&
      d.quarter === Number(quarterId) &&
      d.year === yearId &&
      d.subject === subjectId
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">
            考試卷 - {gradeMapping[gradeId] || gradeId} {yearId} 季度 {quarterId} {subjectId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${schoolId}/expageLists/upload`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳考試卷
            </Link>
            <Link
              href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}/${quarterId}`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回科目列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">考試卷列表</h2>
          {filteredData.length === 0 ? (
            <p className="text-gray-500">尚未新增考試卷</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {filteredData.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}/${quarterId}/${subjectId}/${exam.id}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#e7915b] hover:text-white transition-colors duration-300"
                >
                  <p className="text-gray-800 font-semibold">{exam.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExPageLists_grade_year_quarter_subject_expagelists;