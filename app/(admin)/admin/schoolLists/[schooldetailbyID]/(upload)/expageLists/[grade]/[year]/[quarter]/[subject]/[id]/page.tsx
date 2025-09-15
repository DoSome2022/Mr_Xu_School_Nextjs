// "use client";
// import { useParams } from 'next/navigation';
// import { useEffect, useState } from "react";
// import Image from "next/image"; 

// interface SchoolExPageData {
//     name: string;
//     img: string;
//     school_ex_pager_id: string;
//     grade: number;
//     subject: string;
//     year: string;
//     quarter: number;
// }
// const ExPageLists_grade_year_quarter_subject_expagelists_by_id = () => {

//     const params = useParams<{grade: string; year: string; quarter: string; subject: string, id:string ,schooldetailbyID:string }>();
//     const SchoolId = params?.schooldetailbyID as string;
//     const GradeId = params?.grade as string;
//     const YearId = params?.year as string;
//     const QuarterId = params?.quarter as string;
//     const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';
//     const ExPageListById = params?.id as string; // 獲取URL中的Id參數

//     const [ GetExPageListDetailDataById , setGetExPageListDetailDataById ] = useState<SchoolExPageData[]>([]);

//     useEffect(() =>{
//         if(SchoolId && YearId && GradeId && QuarterId && SubjectId && ExPageListById) {
//             const getExPageListsDetailById = async (SchoolId: string ,yearId:string , GradeId:string ,QuarterId:string,SubjectId:string,ExPageListById:string ) => {
//                 try {
//                 const res = await fetch(`/api/Expagelists_detail_data_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SubjectId}/${ExPageListById}`);
//                 if(!res.ok) {
//                     throw new Error("斷線！");
//                 }
//                 const result = await res.json();
//                 setGetExPageListDetailDataById(result);                    
//                 } catch (error) {
//                     console.error(error);
//                 }
//             };
//             getExPageListsDetailById(SchoolId,YearId,GradeId,QuarterId,SubjectId,ExPageListById);
//         }
//     },[SchoolId,YearId,GradeId,QuarterId,SubjectId,ExPageListById] )


//     console.log(GetExPageListDetailDataById)




//     return(
//         <>
//             {GetExPageListDetailDataById.map((d)=>{
//                                 if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.year == YearId && d.subject == SubjectId && d.school_ex_pager_id == SchoolId){
                                
//                                     return(
//                                         <>
//                                         name:{d.name}
                    
//                                         <br />
                    
//                                         {
//                                             d.img && (
//                                                 <Image width={500} height={500} src={d.img} alt="" />
//                                             )
                    
//                                         }
//                                         </>
//                                     )
//                                 }
//             })}
//         </>
//     )
// }

// export default ExPageLists_grade_year_quarter_subject_expagelists_by_id



"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface SchoolExPageData {
  name: string;
  img: string;
  school_ex_pager_id: string;
  grade: number;
  subject: string;
  year: string;
  quarter: number;
}

const fetcher = (url: string, init?: RequestInit): Promise<SchoolExPageData> =>
  fetch(url, init).then((res) => {
    if (!res.ok) throw new Error("無法載入考試卷詳情");
    return res.json();
  });

const ExPageLists_grade_year_quarter_subject_expagelists_by_id = () => {
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
  const exPageListId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    schoolId && gradeId && yearId && quarterId && subjectId && exPageListId
      ? `${apiUrl}/api/Expagelists_detail_data_by_id/${schoolId}/${gradeId}/${yearId}/${quarterId}/${subjectId}/${exPageListId}`
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

  if (!schoolId || !gradeId || !yearId || !quarterId || !subjectId || !exPageListId) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">
          無效的學校ID、年級、年份、季度、科目或考試卷ID
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

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">
          {error?.message || "無法載入考試卷詳情"}
        </p>
      </div>
    );
  }

  // 驗證數據是否匹配參數
  if (
    data.grade !== Number(gradeId) ||
    data.quarter !== Number(quarterId) ||
    data.year !== yearId ||
    data.subject !== subjectId ||
    data.school_ex_pager_id !== schoolId
  ) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">考試卷資料不匹配</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">
            考試卷詳情 - {gradeMapping[gradeId] || gradeId} {yearId} 季度 {quarterId} {subjectId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${schoolId}/expageLists/upload`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳考試卷
            </Link>
            <Link
              href={`/admin/schoolLists/${schoolId}/expageLists/${gradeId}/${yearId}/${quarterId}/${subjectId}`}
              className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回考試卷列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{data.name}</h2>
          <div className="space-y-4">
            <p className="text-gray-800">
              <span className="font-semibold">年級:</span> {gradeMapping[gradeId] || gradeId}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">年份:</span> {data.year}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">季度:</span> {data.quarter}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">科目:</span> {data.subject}
            </p>
            {data.img ? (
              <div className="relative w-full max-w-md h-64">
                <Image
                  src={data.img}
                  alt={data.name}
                  fill
                  className="object-contain rounded-md"
                  priority
                />
              </div>
            ) : (
              <p className="text-gray-500">無圖片</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExPageLists_grade_year_quarter_subject_expagelists_by_id;