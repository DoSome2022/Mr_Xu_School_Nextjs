"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

// 定義年級對應對象
const gradeMapping = {
    1: "小學1年級",
    2: "小學2年級",
    3: "小學3年級",
    4: "小學4年級",
    5: "小學5年級",
    6: "小學6年級",
    7: "初中1年級",
    8: "初中2年級",
    9: "初中3年級",
    10: "高中1年級",
    11: "高中2年級",
    12: "高中3年級",
};

const SchoolTimeTableLists_Grade = () => {
    const params = useParams<{parentId: string; studentid: string; school: string}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const SchoolName = params?.school as string;

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, error, isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolgrades/', fetcher);

    if (error) return <> error : {error} </>;
    if (isLoading) return <> 載入中 .... </>;

    return (
        <>
            <span> SchoolTimeTableLists_Grade </span>
            <br />

            {data.map((grades: any) => (
                <div key={grades.school_grade}> {/* 添加 key 属性 */}
                    <br />
                    <Link
                        className="text-stone-950 hover:text-gray-700"
                        href={`/parent/${ParentID}/profiles/${StudentID}/upload/schooltimetableLists/${SchoolName}/${grades.school_grade}`}
                    >
                        {gradeMapping[grades.school_grade]}
                    </Link>
                    <br />
                </div>
            ))}
        </>
    );
};

export default SchoolTimeTableLists_Grade;