"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

const SchoolTimeTableLists_Grade_Year_Quarter = () => {
    const params = useParams<{parentId: string; studentid: string; school: string; grade: number; year: string}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as number;
    const Year = params?.year as string;

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, error, isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolquarters/', fetcher);

    if (error) return <> error : {error} </>;
    if (isLoading) return <> 載入中 .... </>;

    return (
        <>
            <span> SchoolTimeTableLists_Grade_Year_Quarter </span>

            {data.map((quarters: any) => (
                <div key={quarters.school_quarter}> {/* 添加 key 属性 */}
                    <br />
                    <Link 
                        className="text-stone-950 hover:text-gray-700" 
                        href={`/parent/${ParentID}/profiles/${StudentID}/upload/schooltimetableLists/${SchoolName}/${Grade}/${Year}/${quarters.school_quarter}`}
                    >
                        季度: {quarters.school_quarter}
                    </Link>
                    <br />
                </div>
            ))}
        </>
    );
};

export default SchoolTimeTableLists_Grade_Year_Quarter;