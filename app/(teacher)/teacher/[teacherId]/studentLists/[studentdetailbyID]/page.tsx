"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



const StudentDetail = () => {

  const param = useParams();
  console.log(param);
  const studentId = param?.studentdetailbyID as string;
  const teacherId = param?.teacherId as string;
  
  const [ getstudentData , setgetstudentData ] = useState([]);

  useEffect(()=>{
    const fetchStudentData = async (id:string) => {
      const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${id}`);
      if(!res){
        throw new Error("斷線！");
      }

      const result = await res.json();
      setgetstudentData(result)

    }
    fetchStudentData(studentId)
  },[studentId])

  console.log("--getstudentData : --  ",getstudentData,"-- END --")

  const dailyreviews = getstudentData[0]?.dailyreview;

  console.log("dailyreviews: ",dailyreviews)

    return (
        <div className="container mx-auto p-4 bg-blue-100">
          <div className="grid grid-cols-6 gap-4">
            <div className="self-end col-span-6">
              <div className="row">
                <div className="col-3">
                  <p className="text-gray-500">學生資料</p>
                </div>
                <div className="col-3">
                  {/* Empty div for alignment */}
                </div>
                <div className="col-2">
                  {/* Empty div for alignment */}
                </div>
                <div className="col-4">
                  <form>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">返回</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">登出</button>
                  </form>
                </div>
              </div>
            </div>
            <nav className="col-span-6">
              <ul className="list-none p-0">
                <li><a href="#profile" className="text-blue-500 py-2 hover:underline">個人信息</a></li>
                <li><a href="#scheudle" className="text-blue-500 py-2 hover:underline">時間表</a></li>
                <li><a href="#note" className="text-blue-500 py-2 hover:underline">筆記</a></li>
                <li><a href="#student" className="text-blue-500 py-2 hover:underline font-bold">學生</a></li>
                <li><a href="#record" className="text-blue-500 py-2 hover:underline">工作紀錄</a></li>
              </ul>
            </nav>
            <div className="col-span-6">
              {/* Empty div for alignment */}
            </div>
            <div className="col-span-6">
              <table className="w-full">
                <tbody>
                  <tr>
                    <th className="text-center">就讀學校</th>
                    <td colSpan="5">油麻地天主教</td>
                  </tr>
                  <tr>
                    <th className="text-center">班級</th>
                    <td colSpan="5">小三</td>
                  </tr>
                  <tr>
                    <th className="text-center">學生ID</th>
                    <td colSpan="5">XXXXXXXXX</td>
                  </tr>
                  <tr>
                    <th className="text-center">分段</th>
                    <td colSpan="5">低班</td>
                  </tr>
                  <tr>
                    <th className="text-center">考試範圍</th>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中文</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英文</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">數學</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中作</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英作</button></td>
                  </tr>
                  <tr>
                    <th className="text-center">校曆表</th>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中文</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英文</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">數學</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中作</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英作</button></td>
                  </tr>
                  <tr>
                    <th className="text-center">考試卷</th>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中文</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英文</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">數學</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中作</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英作</button></td>
                  </tr>
                  <tr>
                    <th className="text-center">考試時間表</th>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中文</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英文</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">數學</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中作</button></td>
                    <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英作</button></td>
                  </tr>
                  <tr>
                    <th className="text-center">成績</th>
                    <td>中文：____</td>
                    <td>英文：____</td>
                    <td>數學：____</td>
                    <td>中作：____</td>
                    <td>英作：____</td>
                  </tr>
                </tbody>
              </table>

              <div>
                text
                {getstudentData?.map((d:any)=>{
                  return(
                    <>
                    姓名:  {d.name}
                    <br />
                    中文考試時間：{d.chine_ex_day}
                    <br />
                    英文考試時間：{d.eng_ex_day}
                    <br />
                    數學考試時間：{d.math_ex_day}
                    </>
                  )
                })}
                <br />
                  <Link href={`/teacher/${teacherId}/studentLists/${studentId}/Createdailyreviews`}>
                  建立日常評論
                  </Link>

                {dailyreviews?.map((d:any)=>{
                  return(
                    <>
                    <Link href={`/teacher/${teacherId}/studentLists/${studentId}/${d.id}/edit`}>
                    <br />
                    標題: {d.title}
                    <br />
                    內容: {d.content}
                    <br />
                    </Link>

                    </>
                  )
                })}

              </div>


            </div>
          </div>
        </div>
      );
}
export default StudentDetail