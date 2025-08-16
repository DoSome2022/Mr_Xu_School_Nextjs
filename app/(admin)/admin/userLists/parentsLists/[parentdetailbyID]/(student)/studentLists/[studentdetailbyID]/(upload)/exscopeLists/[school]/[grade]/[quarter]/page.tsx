"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

interface Student_School_subject {
    school_subject: string;
}

const ExScope_Grade_Quarter_Subject = () => {
    const params = useParams<{parentdetailbyID: string; studentdetailbyID: string; school: string; grade: string; quarter: string}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Quarter = params?.quarter as string;

    const fetcher = (url: string, init?: RequestInit): Promise<Student_School_subject[]> => fetch(url, init).then((res) => res.json());
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolsubjects/`, fetcher);

    if (error) return <div className="p-4 text-red-500">錯誤: {error.message}</div>;
    if (isLoading) return <div className="p-4">載入中...</div>;
    
    if (!data || !Array.isArray(data)) {
        return <div className="p-4 text-red-500">無效的資料格式</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">

            
            <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">科目選擇</h1>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {data.map((subject) => (
                            <Link
                                key={subject.school_subject}
                                href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${subject.school_subject}`}
                                className="block bg-[#e7915b] hover:bg-[#d6824a] text-white rounded-lg p-4 transition-colors duration-300 shadow hover:shadow-md text-center"
                            >
                                科目: {subject.school_subject}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExScope_Grade_Quarter_Subject;