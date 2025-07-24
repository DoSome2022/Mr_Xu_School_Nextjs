"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ClassRoomData {
    id: string;
    room: string;
}

const ClassRoomById = () => {

    const param = useParams();

    console.log("param :",param)

    const classroomid = param?.classroomid as string;

    const [  classroombyidData , setclassroombyidData ] = useState<ClassRoomData[]>([]);

    useEffect(()=>{
        const fetchClassRoom = async (id: string) => {

            const res = await fetch(`/api/ClassRoomLists_detail_data_by_id/${id}`);
            if(!res){
                throw new Error("斷線！")
            }

            const result = await res.json();
            setclassroombyidData(result)

        }
        fetchClassRoom(classroomid)
    },[classroomid])

    console.log("classroombyidData :",classroombyidData,"-- End --")


    return(
        <>
        {classroombyidData.map((item) => (item.room))}
        </>
    )

}


export default ClassRoomById;