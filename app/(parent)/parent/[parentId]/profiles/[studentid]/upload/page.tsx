"use client";

import Link from "next/link";
import { useParams } from "next/navigation";


const StudentUploadPage = () => {
    const param = useParams();
    const parentId = param?.parentId as string;
    const studentid = param?.studentid as string;
    console.log(param);
    return (
        <div>
            StudentUploadPage
            <br />
            <br />
            <Link href={`/parent/${parentId}/profiles/${studentid}/upload/bookLists`}>
                上傳書單
            </Link>
            <br />
            <br />
            <Link href={`/parent/${parentId}/profiles/${studentid}/upload/expageLists`}>
                上傳考試卷
            </Link>
            <br />
            <br />
            <Link href={`/parent/${parentId}/profiles/${studentid}/upload/exscopeLists`}>
                上傳考試範圍
            </Link>
            <br />
            <br />
            <Link href={`/parent/${parentId}/profiles/${studentid}/upload/extimeLists`}>
                上傳考試時間表
            </Link>
            <br />
            <br />
            <Link href={`/parent/${parentId}/profiles/${studentid}/upload/schooltimetableLists`}>
                上傳學校時間表
            </Link>
            <br />
            <br />
            <Link href={`/parent/${parentId}/profiles/${studentid}/upload/scoreLists`}>
                上傳成績表
            </Link>
            <br />
            <br />
        </div>
    )
}

export default StudentUploadPage