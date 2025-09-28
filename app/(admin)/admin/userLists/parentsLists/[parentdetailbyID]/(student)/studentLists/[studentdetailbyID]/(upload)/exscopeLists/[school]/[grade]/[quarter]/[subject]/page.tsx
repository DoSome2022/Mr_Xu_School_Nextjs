"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from "react";

interface StudentName {
    id: string
    name: string
    school: string
    grade: string
    quarter: string
    subject: string
}

const ExScope_Grade_Quarter_Subject_Lists = () => {
    const params = useParams<{parentdetailbyID: string; studentdetailbyID: string; school: string; grade: string; quarter: string; subject: string;}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

    const [GetStudentExScopeLists, setGetStudentExScopeLists] = useState<StudentName[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (StudentID) {
            const getstudentexscopelist = async (StudentID: string) => {
                try {
                    setIsLoading(true);
                    const res = await fetch(`/api/student/Student_ExScope_by_id_Lists/${StudentID}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
                    if (!res.ok) {
                        throw new Error("獲取資料失敗！");
                    }
                    const result = await res.json();
                    setGetStudentExScopeLists(result);
                } catch (error) {
                    console.error(error);
                    setError(error instanceof Error ? error.message : "發生未知錯誤");
                } finally {
                    setIsLoading(false);
                }
            };
            getstudentexscopelist(StudentID);
        }
    }, [StudentID]);

    // 過濾符合條件的資料
    const filteredLists = GetStudentExScopeLists.filter(d => 
        d.school === SchoolName && 
        String(d.grade) === String(Grade) && 
        String(d.quarter) === String(Quarter) && 
        d.subject === Subject
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-20"> {/* 添加 pt-20 避免內容被 navbar 遮擋 */}
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
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試範圍
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}`}
          className="text-blue-600 hover:text-blue-800"
        >
          第{Quarter}季度
        </Link>
        <span className="mx-2">/</span>
        <span>{Subject}</span>
      </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        {Subject} - 學生學習範圍列表
                    </h1>

                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e7915b]"></div>
                            <p className="mt-2 text-gray-600">載入中...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    ) : filteredLists.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            目前沒有符合條件的學習範圍資料
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredLists.map((d) => (
                                <Link
                                    key={d.id}
                                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${Subject}/${d.id}`}
                                    className="block p-4 border border-gray-200 rounded-lg hover:border-[#80A8BD] hover:bg-[#f8e5d8] transition-colors duration-300"
                                >
                                    <h3 className="text-lg font-medium text-gray-800">{d.name}</h3>
                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                        <span className="mr-2">{d.school}</span>
                                        <span className="mr-2">•</span>
                                        <span>{d.grade}年級</span>
                                        <span className="mx-2">•</span>
                                        <span>第{d.quarter}季</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExScope_Grade_Quarter_Subject_Lists;