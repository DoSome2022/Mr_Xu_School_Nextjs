"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import NewsDetailLists from "@/components/DatasLIsts/NewsDatasLists";

const NewDetail = () => {

    const params = useParams();//plz use console.log check params name
    const UserId = params?.newsdetailbyID as string;// 獲取URL中的UserId參數

    // 為了拿news data by id
    const [GetNewsDataById, setGetNewsDataById] = useState();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
        // 拿news data by id
        useEffect(() =>{
            if(UserId) {
                const fetchNewsDetail = async (id: string) => {
                    try {
                    const res = await fetch(`/api/News_detail_data_by_id/${id}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetNewsDataById(result);                    
                    } catch (error) {
                        console.error(error);
                    }
                };
                fetchNewsDetail(UserId);
            }
        },[UserId] )

        if (!GetNewsDataById) {
            return <div>Loading...</div>;
          }
    

    return(
        <>
            <span> NewsDetail </span>

            <br />
    <NewsDetailLists  data={GetNewsDataById} />
            <br />
            {/* 用URL中的UserId參數 */}
            <Link href={`/admin/newsLists/${UserId}/edit`}>
                更改
            </Link>

            

        </>
    )
}
export default NewDetail