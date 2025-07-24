"use client"

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface classroomList {
  id: string;
  room: string;
}

const ClassRoomListsbysupadmin = () => {
    const param = useParams();
    console.log("param :",  param ,"--end --"  )
    const supadminid = param?.supadminid as string;
    console.log("supadminid :", supadminid);
  const [GetClassRoom , setGetClassRoom] = useState<classroomList[]>([]);
  useEffect(() => {
    const fetchClassRoom = async () => {
      const res = await fetch("/api/ClassRoom_Lists");
      if (!res) {
        throw new Error("斷線！");
      }

      const result = await res.json();
      setGetClassRoom(result);
    };
    fetchClassRoom();
  }, []);

  console.log("GetClassRoom :" , GetClassRoom , "-- End --")

    return(
        <>
        <Link href={`/supadmin/${supadminid}/classroomLists/createclassroom/`}>
         <div>
           CreateClassRoom
         </div>
        </Link>
        <div>
           ClassRoom

            {GetClassRoom.map((d)=>{
              return(
                <>
                <br />
                <Link href={`/supadmin${supadminid}/classroomLists/${d.id}`}>
                  {d.room}
                </Link>
                <br />
                </>
              )
            })}

        </div>


        </>
    )
}

export default ClassRoomListsbysupadmin;