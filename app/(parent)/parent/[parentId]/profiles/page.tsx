"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const parentprofiles= () => {
    const param = useParams();
    const parentId = param?.parentId as string;
    console.log(parentId);

    const [GetParentDataById , setGetParentDataById] = useState([]);

    useEffect(() => {
        const fetchParentDataById = async (id:string) => {
            try {
                const response = await fetch(`/api/Parents_Lists_by_id/${id}`);
                const data = await response.json();
                setGetParentDataById(data);
            } catch (error) {
                console.error("Error fetching parent data:", error);
            }
        };
        fetchParentDataById(parentId);
    }, [parentId])

    console.log(" GetParentDataById : ",GetParentDataById)

    return (
        <div>
            parentprofiles
            {GetParentDataById.map((d:any)=>{
                return(
                    <>
                    nickname : {d.nickname}
                    <br />
                    username : {d.username}
                    <br />
                    email : {d.email}
                    <br />
                    phone : {d.phone}

                    <br />
                    學生:{d.Student.map((S:any)=>{
                        return(
                            <>
                            <br /><br />
                            學生姓名:{S.name}

                            <br /><br /><br />
                            
                            <Link href={`/parent/${parentId}/profiles/${S.id}/createStudentEXDay`}>
                            
                            建立考試時間
                            </Link>
                                <br /><br /><br />

                            <Link href={`/parent/${parentId}/profiles/${S.id}/upload`}>
                            上傳
                            </Link>
                            
                            </>
                        )
                    })}

                    </>

                
                )
            })}
        </div>
    )
}

export default parentprofiles