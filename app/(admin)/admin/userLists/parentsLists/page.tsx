"use client";

import WhatsAppButton from "@/components/whatappsButton/whatappsbtn";
import Link from "next/link"
import React,{ useEffect, useState } from "react"

enum Role {
    PARENT 
}


interface ParaentData {
    id: string;
    username : string;
    nickname : string;
    email : string;
    role : Role;
    phone: string;
}

// API 回傳的原始數據結構
interface RawParentData {
    id: string;
    username: string;
    nickname: string;
    email: string;
    role: string; // 字符串
    phone: string;
}

const parentsLists:React.FC = () =>{

    const [GetParentsData , setGetParentsData ] = useState<ParaentData[]>([]);

    useEffect(()=>{
        const fetchparentsData = async () => {
        //在app/api/Parents_Lists/route.ts
            const res = await fetch('/api/Parents_Lists');

            if(!res){
                throw new Error('斷線！')
            }
            const result = await res.json()
            const convertedData = result.map((item:RawParentData) => ({
                ...item,
                role: item.role === "PARENT" ? Role.PARENT : item.role,
              }));
    
            setGetParentsData(convertedData)
        }
        fetchparentsData()
    },[])

    console.log(GetParentsData)

    return(
        <>

        <br />
            parentsLists
        <br />
        <Link
        className="text-stone-950 hover:text-gray-700" 
        href="/admin/userLists/parentsLists/createParent" > 建立家長 </Link>

        <br />

<br />
    {
        
        GetParentsData.map((data)=>{
        
            if(data.role === Role.PARENT)
        
            return(
                <>
                <Link className="text-stone-950 hover:text-gray-700" href={`/admin/userLists/parentsLists/${data.id}`}>
                
                username: {data.username}
                <br />
                nickname: {data.nickname}
                <br />
                email: {data.email}
                <br />
                phone: {data.phone}
                </Link>



                <br />
                <WhatsAppButton whatappmessage={data.phone} />


                

                </>
            )
        })


    }        



        </>
    )
}

export default parentsLists