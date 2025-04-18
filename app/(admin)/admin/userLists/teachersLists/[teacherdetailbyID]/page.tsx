"use client";

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";




interface Teacher {
    id: string;
    username: string;
    nickname?: string;
    email: string;
    phone?: string;
    role: string;
  }


const TeacherDetail = () => {
    const params = useParams();//plz use console.log see params name
  const TeacherId = params?.teacherdetailbyID as string;// 獲取URL中的TeacherId參數
  
  // 為了拿老師data by id
  const [GetTeacherDataById, setGetTeacherDataById] = useState<Teacher | null>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 拿老師data by id
  useEffect(() => {
    if (TeacherId) {
      const getTeacherDetail = async (id: string) => {
        try {
          const res = await fetch(`/api/Course_data_teacher_by_id/${id}`);
          if (!res.ok) {
            throw new Error("斷線！");
          }
          const result = await res.json();
          setGetTeacherDataById(result);
        } catch (error) {
          console.error(error);
        }
      };
      getTeacherDetail(TeacherId);
    }
  }, [TeacherId]);

  // console.log("-- params id : --",TeacherId, " -- end -- ")

  if (!GetTeacherDataById) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Link
        href={`/admin/userLists/teachersLists/${GetTeacherDataById.id}/edit`}
        className="text-2xl font-bold mb-4"
      >
        更改老師數據
      </Link>
      <span className="block text-lg font-semibold mb-2">TeacherDetail</span>
      <div className="bg-white shadow-md rounded-lg p-4">
        <p className="mb-2"><span className="font-semibold">id:</span> {GetTeacherDataById.id}</p>
        <p className="mb-2"><span className="font-semibold">username:</span> {GetTeacherDataById.username}</p>
        <p className="mb-2"><span className="font-semibold">nickname:</span> {GetTeacherDataById.nickname}</p>
        <p className="mb-2"><span className="font-semibold">email:</span> {GetTeacherDataById.email}</p>
        <p className="mb-2"><span className="font-semibold">phone:</span> {GetTeacherDataById.phone}</p>
        <p className="mb-2"><span className="font-semibold">role:</span> {GetTeacherDataById.role}</p>
      </div>
    </div>
  );
};

export default TeacherDetail;
