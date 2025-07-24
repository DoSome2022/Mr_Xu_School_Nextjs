"use client";

import Link from "next/link"
import React,{ useEffect, useState } from "react"

enum Role {
    ADMIN,
    SUPADMIN ,
    TEACHER ,
}


interface SupAdminData{
    id: string,
    username: string,
    nickname: string,
    role: Role 
    cram:  string,
}

const adminLists :React.FC = () =>{
    const [ GetSupAdminLists , setGetSupAdminLists ] = useState<SupAdminData[]>([]);

    useEffect(()=>{
        const fetchsupadminlistsData = async () =>{
            //在app/api/SupAdmin/route.ts
            const res = await fetch('/api/SupAdmin_Lists');

            if(!res){
                throw new Error('斷線！')
            }
            const result = await res.json();

            setGetSupAdminLists(result);

        }
        fetchsupadminlistsData()
    },[])

    console.log(GetSupAdminLists)

    return(
        
        <>

        <br />
        adminLists
        <br />
        <Link 
        className="text-stone-950 hover:text-gray-700" 
        href="/admin/userLists/adminsLists/createAdmin" > 建立管理員 </Link>
        <br />

        {GetSupAdminLists.map((d)=>{
            if(d.role === Role.SUPADMIN){
                return(
                    <>
        <Link
        className="text-stone-950 hover:text-gray-700" 
        href={`/admin/userLists/adminsLists/${d.id}`}
        >
                    <br />
                    name: {d.username}
                    <br />
                    補習社: {d.cram}

    </Link>                
                    </>
                )
            }
        })}



        </>
    )
}

export default adminLists