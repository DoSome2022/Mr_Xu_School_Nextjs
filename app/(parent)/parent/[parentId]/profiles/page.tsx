"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ParentProfiles = () => {
  const param = useParams();
  const parentId = param?.parentId as string;
  console.log(parentId);

  const [GetParentDataById, setGetParentDataById] = useState([]);

  useEffect(() => {
    const fetchParentDataById = async (id: string) => {
      try {
        const response = await fetch(`/api/Parents_Lists_by_id/${id}`);
        if (!response.ok) {
          throw new Error("無法獲取家長資料！");
        }
        const data = await response.json();
        setGetParentDataById(data);
      } catch (error) {
        console.error("獲取家長資料失敗:", error);
      }
    };
    if (parentId) {
      fetchParentDataById(parentId);
    }
  }, [parentId]);

  console.log("GetParentDataById:", GetParentDataById);

  return (
    <div className="container mx-auto h-full w-full bg-gray-900 p-6">
      <h1 className="text-white text-2xl font-semibold mb-6">我的資料</h1>
      {GetParentDataById.length === 0 ? (
        <p className="text-gray-400">正在載入家長資料...</p>
      ) : (
        GetParentDataById.map((d: any, index: number) => (
          <div
            key={index}
            className="bg-[#80A8BD] p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="text-white text-xl font-medium mb-4">家長資料</h2>
            <div className="text-gray-300 space-y-2">
              <p>
                <span className="font-semibold">暱稱:</span> {d.nickname}
              </p>
              <p>
                <span className="font-semibold">用戶名:</span> {d.username}
              </p>
              <p>
                <span className="font-semibold">電子郵件:</span> {d.email}
              </p>
              <p>
                <span className="font-semibold">電話:</span> {d.phone}
              </p>
            </div>

            <h3 className="text-white text-lg font-medium mt-6 mb-4">學生資料</h3>
            {d.Student.length === 0 ? (
              <p className="text-gray-400">無學生資料</p>
            ) : (
              d.Student.map((S: any, sIndex: number) => (
                <div
                  key={sIndex}
                  className="bg-[#80A8BD] p-5 rounded-md shadow-sm mb-4 hover:bg-gray-600 transition-colors duration-200"
                >
                  <p className="text-gray-300">
                    <span className="font-semibold">學生姓名:</span> {S.name}
                  </p>
                  <div className="mt-4 space-y-2">
                    <Link
                      href={`/parent/${parentId}/profiles/${S.id}/createStudentEXDay`}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      建立考試時間
                    </Link>
                    <Link
                      href={`/parent/${parentId}/profiles/${S.id}/upload`}
                      className="block text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      上傳
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ParentProfiles;