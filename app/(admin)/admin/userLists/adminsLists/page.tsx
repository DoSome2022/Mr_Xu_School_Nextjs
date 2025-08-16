"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

enum Role {
  ADMIN,
  SUPADMIN,
  TEACHER,
}

interface SupAdminData {
  id: string;
  username: string;
  nickname: string;
  role: Role;
  cram: string;
}

const AdminLists: React.FC = () => {
  const [supAdminData, setSupAdminData] = useState<SupAdminData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupAdminListsData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/SupAdmin_Lists");
        if (!res.ok) {
          throw new Error("無法連接到伺服器");
        }
        const result = await res.json();
        setSupAdminData(result);
      } catch (error) {
        console.error("獲取管理員數據失敗:", error);
        setError("無法載入管理員數據，請稍後再試");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSupAdminListsData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <div className="bg-[#e7915b] shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">管理員列表</h1>
        <div className="mb-6">
          <Link
            href="/admin/userLists/adminsLists/createAdmin"
            className="inline-block px-4 py-2 bg-white text-[#e7915b] font-medium rounded-md hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300"
          >
            建立管理員
          </Link>
        </div>
        {isLoading ? (
          <p className="text-white text-center">正在載入數據...</p>
        ) : error ? (
          <p className="text-cyan-200 text-center">{error}</p>
        ) : supAdminData.length === 0 ? (
          <p className="text-white text-center">尚未有管理員數據</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {supAdminData.map((data) => {
              if (data.role === Role.SUPADMIN) {
                return (
                  <div
                    key={data.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link
                      href={`/admin/userLists/adminsLists/${data.id}`}
                      className="block text-[#e7915b] hover:text-cyan-200 transition-colors duration-300"
                    >
                      <p className="font-medium">名稱: {data.username}</p>
                      <p>補習社: {data.cram}</p>
                    </Link>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLists;