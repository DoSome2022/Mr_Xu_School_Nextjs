"use client";

import { Logout_Button } from "@/components/logout_button";
import TeacherNavber from "../_components/navbar";
import { useSession } from "next-auth/react";

const nodeLists = () => {
    const session = useSession();

    console.log("--teacher_session data : --  ",session?.data?.user,"-- END --")
  
    const teacherId = session?.data.user?.id ; 
  
    console.log("id : " , teacherId);
    return(
        <>
        <div className="container mx-auto h-full w-full bg-blue-200 p-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-6">
        <div className="col-span-6 flex justify-between items-center">
        <p className="text-gray-500">nodeLists</p>
        <div className="flex space-x-2">

        <input type="text" placeholder="搜尋" name="search" className="p-2 border rounded" />
        <button className="bg-blue-400 text-white px-4 py-2 rounded">GO</button>
        <Logout_Button />
        </div>
        </div>
        <TeacherNavber teacherId={teacherId} />
        <div className="col-span-5 mt-8">
        <table className="table-auto w-full border-collapse">


        </table>
        </div>
        </div>
        </div>
            
        </>
    )
}

export default nodeLists