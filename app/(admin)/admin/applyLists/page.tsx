"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ApplyData{
    id: string;
    title: string;
    apply: boolean;
    course_id: string;
}

const ApplyLists = () => {
    const [ GetApplyData , setGetApplyData ] = useState<ApplyData[]>([]);

    useEffect(()=>{
        const fetchApplyData = async () => {
            const res = await fetch("/api/Apply_Lists");
            if (!res) {
                throw new Error("斷線！");
            }
            const result = await res.json();
            setGetApplyData(result);
        };
        fetchApplyData();
    },[])
    console.log(" --  ApplyLists -- : ", GetApplyData, " -- end -- ");

    return(
        <>
            <span>ApplyLists</span>

            {GetApplyData.map((d)=>{

                return(
                    <>
                        <Link href={`/admin/applyLists/${d.id}`}>
                        <br />
                            <p>title:{d.title}</p>

                            <br />
                        </Link>

                        <Link href={`/admin/courseLists/${d.course_id}`}>
                            直去課程
                        </Link>

                            <p>申請狀況: {d.apply ? "批準" : "不批準"}</p>
                            <br />

                    </>
                )

            })}

        </>
    )
}

export default ApplyLists