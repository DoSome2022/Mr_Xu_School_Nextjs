// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import { useEffect, useState } from 'react';

// interface StudentSchoolName {
//     name:string;
//     id:string;
//     school:string;
//     grade:string;
//     year:string;
//     quarter:string;
//     subject:string;
// }
// const ExTimeLists_Grade_Year_Quarter_subject_Lists = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string ; year: string; quarter:string; subject: string}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;
//     const Quarter = params?.quarter as string;
//     const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

//     const [ GetStudentExTimeLists , setGetStudentExTimeLists ] = useState<StudentSchoolName[]>([]);

//     useEffect(()=>{
//         if(StudentID){
//             const getstudentextimelist = async (StudentID: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_ExTime_by_id_Lists/${StudentID}`)
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentExTimeLists(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentextimelist(StudentID)
//         }
//     },[StudentID])


//     console.log(GetStudentExTimeLists[0])

//     return(
//         <>
//             <span> ExTimeLists_Grade_Year_Quarter_subject_Lists </span>
//             <br />
//             {GetStudentExTimeLists.map((d)=>{
//                 if(d.school == SchoolName && d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject){
//                 return(
//                     <>
//             <br />
//                 <Link className="text-stone-950 hover:text-gray-700" 
//                     href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
//                 >
//                     名稱: {d.name}
//                 </Link>
//             <br />
//                     </>
//                 )

//                 }

//             })}
//         </>
//     )
// }

// export default ExTimeLists_Grade_Year_Quarter_subject_Lists

"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

interface StudentSchoolName {
    name: string;
    id: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
}

const ExTimeLists_Grade_Year_Quarter_subject_Lists = () => {
    const params = useParams<{
        parentdetailbyID: string;
        studentdetailbyID: string;
        school: string;
        grade: string;
        year: string;
        quarter: string;
        subject: string;
    }>();
    
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

    const [GetStudentExTimeLists, setGetStudentExTimeLists] = useState<StudentSchoolName[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (StudentID) {
            const getstudentextimelist = async (StudentID: string) => {
                try {
                    setIsLoading(true);
                    const res = await fetch(`/api/student/Student_ExTime_by_id_Lists/${StudentID}`);
                    if (!res.ok) {
                        throw new Error("獲取資料失敗！");
                    }
                    const result = await res.json();
                    setGetStudentExTimeLists(result);
                } catch (error) {
                    console.error(error);
                    setError(error instanceof Error ? error.message : "發生未知錯誤");
                } finally {
                    setIsLoading(false);
                }
            };
            getstudentextimelist(StudentID);
        }
    }, [StudentID]);

    // 過濾符合條件的資料
    const filteredLists = GetStudentExTimeLists.filter(d => 
        d.school === SchoolName && 
        String(d.grade) === String(Grade) && 
        d.year === Year && 
        String(d.quarter) === String(Quarter) && 
        d.subject === Subject
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試時間表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          年級 {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          季度 {Quarter}
        </Link>
        <span className="mx-2">/</span>
        <span>{Subject}</span>
      </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 標題欄 - 使用與 navbar 相同的配色 */}
                    <div className="bg-[#80A8BD] px-6 py-4">
                        <h1 className="text-xl font-bold text-white">
                            {SchoolName} - {Grade}年級 - {Year}年 - 第{Quarter}季 - {Subject} - 考試時間表
                        </h1>
                    </div>

                    {/* 內容區域 */}
                    <div className="p-6">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
                                <p className="mt-4 text-gray-600">資料載入中...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-red-700">{error}</span>
                                </div>
                            </div>
                        ) : filteredLists.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                目前沒有符合條件的考試時間表
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredLists.map((d) => (
                                    <Link
                                        key={d.id}
                                        href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
                                        className="block p-4 border border-gray-200 rounded-lg hover:border-[#80A8BD] hover:bg-[#f8e5d8] transition-colors duration-300"
                                    >
                                        <h3 className="text-lg font-medium text-gray-800">{d.name}</h3>
                                        <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-2">
                                            <span className="bg-gray-100 px-2 py-1 rounded">{d.school}</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded">{d.grade}年級</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded">{d.year}年</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded">第{d.quarter}季</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded">{d.subject}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExTimeLists_Grade_Year_Quarter_subject_Lists;