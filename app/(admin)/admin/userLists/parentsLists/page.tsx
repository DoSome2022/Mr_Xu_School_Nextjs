"use client";

import WhatsAppButton from "@/components/whatappsButton/whatappsbtn";
import Link from "next/link";
import React, { useEffect, useState } from "react";

enum Role {
  PARENT,
}

interface ParentData {
  id: string;
  username: string;
  nickname: string;
  email: string;
  role: Role;
  phone: string;
}

interface RawParentData {
  id: string;
  username: string;
  nickname: string;
  email: string;
  role: string;
  phone: string;
}

const ParentsLists: React.FC = () => {
  const [parentsData, setParentsData] = useState<ParentData[]>([]);

  useEffect(() => {
    const fetchParentsData = async () => {
      try {
        const res = await fetch("/api/Parents_Lists");
        if (!res.ok) {
          throw new Error("無法連接到伺服器");
        }
        const result = await res.json();
        const convertedData = result.map((item: RawParentData) => ({
          ...item,
          role: item.role === "PARENT" ? Role.PARENT : item.role,
        }));
        setParentsData(convertedData);
      } catch (error) {
        console.error("獲取家長數據失敗:", error);
      }
    };
    fetchParentsData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <div className="bg-[#80A8BD] shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">家長列表</h1>
        <div className="mb-6">
          <Link
            href="/admin/userLists/parentsLists/createParent"
            className="inline-block px-4 py-2 bg-white text-[#80A8BD] font-medium rounded-md hover:bg-cyan-200 hover:text-[#80A8BD] transition-colors duration-300"
          >
            建立家長
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {parentsData.length === 0 ? (
            <p className="text-white text-center col-span-2">正在載入數據...</p>
          ) : (
            parentsData.map((data) => {
              if (data.role === Role.PARENT) {
                return (
                  <div
                    key={data.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link
                      href={`/admin/userLists/parentsLists/${data.id}`}
                      className="block text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300"
                    >
                      <p className="font-medium">用戶名: {data.username}</p>
                      <p>暱稱: {data.nickname}</p>
                      <p>電子郵件: {data.email}</p>
                      <p>電話: {data.phone}</p>
                    </Link>
                    <div className="mt-4">
                      <WhatsAppButton whatappmessage={data.phone} />
                    </div>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentsLists;