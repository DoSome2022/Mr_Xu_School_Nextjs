"use client"

import ClassRoomCalendar from "@/components/calendar/classroomCalendar";
import ShowCalendar from "@/components/calendar/ShowCalendar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const AdminComponents = () => {
    const session = useSession();
    const [events, setEvents] = useState([]);
    // const [getClassDatas, setGetClassDatas] = useState([]);

    const [GetClassRoom , setGetClassRoom] = useState([])

    useEffect(()=>{
        const getclassdata = async () => {
            const res = await fetch('/api/Class_Lists');
            if(!res){
                throw new Error("斷線！")
            }
            const result = await res.json();
            setEvents(result);
        }
        getclassdata()

        const fetchClassRoom = async () => {
            const res = await fetch('/api/ClassRoom_Lists');
            if(!res){
                throw new Error("斷線！")
            }
            const result = await res.json();
            setGetClassRoom(result);

        }
        fetchClassRoom()

    },[])

    console.log("GetClassRoom :",GetClassRoom,"--End--")

    // console.log("events-data : ", events)



  //  console.log("--admin_session data : --  ",session?.data?.user,"-- END --")
    return(
        <>
            <span>admin</span>
            {/* <ShowCalendar events={events} /> */}


            <ClassRoomCalendar />


        </>
    )
}

export default AdminComponents