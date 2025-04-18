"use client";

import WhatsAppButton from "@/components/whatappsButton/whatappsbtn";
import Link from "next/link"
import { useEffect, useState } from "react"

const parentsLists = () =>{

    const [GetParentsData , setGetParentsData ] = useState([]);

    useEffect(()=>{
        const fetchparentsData = async () => {
        //在app/api/Parents_Lists/route.ts
            const res = await fetch('/api/Parents_Lists');

            if(!res){
                throw new Error('斷線！')
            }
            const result = await res.json()
    
            setGetParentsData(result)
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
        
            if(data.role === "PARENT")
        
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