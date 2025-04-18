"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const formatDate = (isoDateString:any) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // 星期幾的映射
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    const dayOfWeek = days[date.getDay()]; // 獲取星期幾
    
    return `${year}/${month}/${day}　(${dayOfWeek})`;
};

const SetPublicHolidaysLists = () => {
    const [GetPublicHolidaysLists, setGetPublicHolidaysLists] = useState([]);

    useEffect(() => {
        const fetchPublicHolidaysLists = async () => {
            const res = await fetch('/api/PublicHoliday_Lists');
            if (!res.ok) {
                throw new Error("斷線！");
            }
            const result = await res.json();
            setGetPublicHolidaysLists(result);
        };

        fetchPublicHolidaysLists();
    }, []);

    return (
        <>
            <Link href={"/admin/setpublicholidaysLists/createpublicholidays"}>
                createPublicHolidays
            </Link>
            <br />
            <br />
            {GetPublicHolidaysLists.map((phl:any) => (
                <div key={phl.id}>
                    <Link href={`/admin/setpublicholidaysLists/${phl.id}/edit`}>
                        公眾假期:
                        <ul>
                            {phl.publicholiday.map((date:any, index:any) => (
                                <li key={index}>{formatDate(date)}</li>
                            ))}
                        </ul>
                    </Link>
                    <br />
                </div>
            ))}
        </>
    );
};

export default SetPublicHolidaysLists;