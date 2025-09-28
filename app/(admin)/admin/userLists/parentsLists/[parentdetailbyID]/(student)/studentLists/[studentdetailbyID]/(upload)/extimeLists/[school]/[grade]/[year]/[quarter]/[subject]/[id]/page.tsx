// "use client";

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// interface StudentDetailData{
//     name:string;
//     img:string;
//     id:string;
//     school:string;
//     grade:string;
//     year:string;
//     quarter:string;
//     subject:string;
// }
// const ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID = () => {
//     const params = useParams<{ studentdetailbyID : string ; id: string; school : string; grade : string; year: string; quarter:string; subject:string}>();
//     const Id = params?.id as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;
//     const Quarter = params?.quarter as string;
//     const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

//     const [ GetStudentExTimeDetailByID , setGetStudentExTimeDetailByID ] = useState<StudentDetailData[]>([]);

//     useEffect(()=>{
//         if(StudentID && Id){
//             const getstudentextimedetailbyid = async (StudentID: string , id: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_ExTime_by_id_Lists_by_id/${StudentID}/${id}`)
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentExTimeDetailByID(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentextimedetailbyid(StudentID,Id)
//         }
//     },[StudentID , Id])


//     console.log(GetStudentExTimeDetailByID)

//     return(
//         <>
//             <span> ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID </span>
//             <br />
// {GetStudentExTimeDetailByID.map((d)=>{
//     if(d.school == SchoolName && d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject){
//         return(
//             <>
//             {d.name}
//             <br />
//             <Image 
//                         width={500}
//                         height={500}
//                         src={d.img}
//                         alt=""
//                         />
//             </>
//         )
//     }
// })}
//         </>
//     )
// }

// export default ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID


"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface StudentDetailData {
    name: string;
    img: string;
    id: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
}

const ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID = () => {
    const params = useParams<{ 
        studentdetailbyID: string; 
        id: string; 
        school: string; 
        grade: string; 
        year: string; 
        quarter: string; 
        subject: string 
    }>();
    
    const Id = params?.id as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

    const [GetStudentExTimeDetailByID, setGetStudentExTimeDetailByID] = useState<StudentDetailData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (StudentID && Id) {
            const getstudentextimedetailbyid = async (StudentID: string, id: string) => {
                try {
                    setIsLoading(true);
                    const res = await fetch(`/api/student/Student_ExTime_by_id_Lists_by_id/${StudentID}/${id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
                    if (!res.ok) {
                        throw new Error("获取数据失败！");
                    }
                    const result = await res.json();
                    setGetStudentExTimeDetailByID(result);
                } catch (error) {
                    console.error(error);
                    setError(error instanceof Error ? error.message : "发生未知错误");
                } finally {
                    setIsLoading(false);
                }
            };
            getstudentextimedetailbyid(StudentID, Id);
        }
    }, [StudentID, Id]);

    // 过滤符合条件的数据
    const filteredData = GetStudentExTimeDetailByID.filter(d => 
        d.school === SchoolName && 
        String(d.grade) === String(Grade) && // 確保比較時為字串
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
          href={`/admin/userLists/parentsLists/${StudentID}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${StudentID}/studentLists/${StudentID}/extimeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試時間表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${StudentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${StudentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          年級 {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${StudentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${StudentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          季度 {Quarter}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${StudentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}/${encodeURIComponent(Subject)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Subject}
        </Link>
        <span className="mx-2">/</span>
      </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 标题栏 - 使用与 navbar 相同的配色 */}
                    <div className="bg-[#80A8BD] px-6 py-4">
                        <h1 className="text-xl font-bold text-white">
                            {SchoolName} - {Grade}年级 - {Year}年 - 第{Quarter}季 - {Subject} - 考试时间表详情
                        </h1>
                    </div>

                    {/* 内容区域 */}
                    <div className="p-6">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
                                <p className="mt-4 text-gray-600">数据加载中...</p>
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
                        ) : filteredData.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                没有找到符合条件的考试时间表详情
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredData.map((d) => (
                                    <div key={d.id} className="space-y-4">
                                        {/* 基本信息卡片 */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h2 className="text-2xl font-bold text-gray-800">{d.name}</h2>
                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium">学校:</span> {d.school}
                                                </div>
                                                <div>
                                                    <span className="font-medium">年级:</span> {d.grade}
                                                </div>
                                                <div>
                                                    <span className="font-medium">年份:</span> {d.year}
                                                </div>
                                                <div>
                                                    <span className="font-medium">季度:</span> 第{d.quarter}季
                                                </div>
                                                <div className="md:col-span-4">
                                                    <span className="font-medium">科目:</span> {d.subject}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 图片展示区域 */}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-100 p-3 border-b border-gray-200">
                                                <h3 className="font-medium text-gray-700">考试时间表图片</h3>
                                            </div>
                                            <div className="p-4 flex justify-center bg-white">
                                                <Image
                                                    width={800}
                                                    height={800}
                                                    src={d.img}
                                                    alt={`${d.name}的考试时间表`}
                                                    className="rounded-md shadow-sm object-contain max-h-[600px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID;