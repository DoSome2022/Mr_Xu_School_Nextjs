"use client";


import TeacherNavber from "../_components/navbar"
import { useSession } from "next-auth/react";
import { Logout_Button } from "@/components/logout_button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const profiles = () => {
// components/ProfileInfo.js
    // const session = useSession();

    // console.log("--teacher_session data : --  ",session?.data?.user,"-- END --")

    // const teacherId = session?.data.user?.id ; 

    const param = useParams();
    const teacherId = param?.teacherId as string ;


    console.log("id : " , teacherId);

    const [ getTeacherData , setGetTeacherData ] = useState([]);

    useEffect(() => {
      const getTeacherData = async (id:string) =>{
          const res = await fetch(`/api/Teacher_detail_data_by_id/${id}`);

          if (!res.ok) {
            throw new Error("Failed to fetch teacher data");
          }

          const result = await res.json();
          setGetTeacherData(result);
        } 
        getTeacherData(teacherId)
    },[teacherId])


    console.log("--getTeacherData : --  ",getTeacherData,"-- END --")

    const P_HR = getTeacherData[0]?.teacher_time_work[0]?.P_HR;
    const HS_HR = getTeacherData[0]?.teacher_time_work[0]?.HS_HR;
    const JHS_HR = getTeacherData[0]?.teacher_time_work[0]?.JHS_HR;
    const P_number = getTeacherData[0]?.teacher_time_work[0]?.P_number;
    const HS_number = getTeacherData[0]?.teacher_time_work[0]?.HS_number;
    const JHS_number = getTeacherData[0]?.teacher_time_work[0]?.JHS_number;


    return (
      <div className="container mx-auto h-full w-full bg-blue-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <div className="col-span-6 flex justify-between">
            <p className="text-gray-500 text-lg">個人信息</p>
            <div className="flex space-x-2">
              <Logout_Button />
            </div>
          </div>

          <TeacherNavber  teacherId={teacherId} />
          <div className="col-span-5 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {getTeacherData.map((d:any)=>{
                return(
                  <div key={d.id}>
                    nickname : {d.nickname}
                    <br />
                    phone: {d.phone}
                    <br />


                    總時:
                    <br />
                    小學時數課 : {P_HR} 小時 {P_number} 人
                    <br />
                    初中時數課： {JHS_HR} 小時 {JHS_number} 人
                    <br />
                    高中時數課： {HS_HR} 小時 {HS_number} 人
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  

export default profiles