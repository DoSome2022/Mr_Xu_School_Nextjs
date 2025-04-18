"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import SchoolDetailLists from "@/components/DatasLIsts/SchoolDetailLists";

const SchoolDetail = () => {

    const params = useParams();//plz use console.log check params name
    const SchoolId = params?.schooldetailbyID as string;// 獲取URL中的SchoolId參數

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekday = weekdays[date.getDay()];
        return `${year}/${month}/${day} (${weekday})`;
    };


    // 為了拿school data by id
    const [GetSchoolDataById, setGetSchoolDataById] = useState();
    const [GetSchoolExDayLists , setGetSchoolExDayLists  ] = useState();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

        // 拿school data by id
        useEffect(() =>{
            if(SchoolId) {
                const fetchSchoolDetail = async (id: string) => {
                    try {
                    const res = await fetch(`/api/School_detail_data_by_id/${id}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    

                    setGetSchoolDataById(result);                    
                    } catch (error) {
                        console.error(error);
                    }
                };
                fetchSchoolDetail(SchoolId);

                const fetchSchoolExDay = async (id: string) => {
                    try {
                        const res = await fetch(`/api/School_Ex_Day_by_id_Lists/${id}`);
                        if(!res.ok) {
                            throw new Error("斷線！");
                        }
                        const result = await res.json();
                        setGetSchoolExDayLists(result);
                        
                    } catch (error) {
                        console.error(error);
                    }
                };
                fetchSchoolExDay(SchoolId)

            }
        },[SchoolId] )

        if (!GetSchoolDataById) {
            return <div>Loading...</div>;
          }    


console.log('GetSchoolExDayLists : ', GetSchoolExDayLists)

    return(
        <>
            <span> SchoolDetail </span>

            {/* 用URL中的SchoolId參數 */}
            <Link className="text-stone-950 hover:text-gray-700"  href={`/admin/schoolLists/${SchoolId}/edit`}>
                更改
            </Link>
            <br />
           <Link className="text-stone-950 hover:text-gray-700"  href={`/admin/schoolLists/${SchoolId}/createSchoolEXDay`}>
                新增學校考試時間
           </Link>

            <br />
        <SchoolDetailLists  data={GetSchoolDataById}  />
            <br />

<br /><br /><br /><br />
            {GetSchoolExDayLists?.map((d:any)=>{
                return(
                    <>
                        Title:{d.title}
                        <br />
                        年級:{d.grade}
                        <br />
                        科目:{d.subject}
                        <br />
                        季度:{d.quarter}
                        <br />
                        年份:{d.year}
                        <br />
                        <p>考試日期: {formatDate(d.EX_Day)}</p>
                        
                    </>
                )
            })}

        </>
    )
}

export default SchoolDetail

