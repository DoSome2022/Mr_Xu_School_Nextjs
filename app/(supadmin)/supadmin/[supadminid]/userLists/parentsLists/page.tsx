"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import WhatsAppButton from "@/components/whatappsButton/whatappsbtn";


enum Role {
  PARENT = "PARENT",
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

const ParentsListsbysupadmin: React.FC = () => {
  const params = useParams();
  const supadminId = params?.supadminid as string;
  const [parentsData, setParentsData] = useState<ParentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("params :" , params , "-- END --")

  useEffect(() => {
    const fetchParentsData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/Parents_Lists");
        if (!res.ok) {
          throw new Error("無法獲取家長數據");
        }
        const result: RawParentData[] = await res.json();
        const convertedData = result
          .filter((item) => item.role === "PARENT")
          .map((item) => ({
            ...item,
            role: Role.PARENT,
          }));
        setParentsData(convertedData);
      } catch (error: any) {
        console.error("獲取家長數據失敗:", error);
        setError("無法載入家長列表");
      } finally {
        setLoading(false);
      }
    };
    fetchParentsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-medium">正在載入...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600">家長列表</h1>
          <Link
            href={`/supadmin/${supadminId}/userLists/parentsLists/createParent`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
          >
            建立家長
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {parentsData.length > 0 ? (
            <div className="space-y-4">
              {parentsData.map((parent) => (
                <div
                  key={parent.id}
                  className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
                >
                  <Link
                    href={`/supadmin/${supadminId}/userLists/parentsLists/${parent.id}`}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    <p>用戶名: {parent.username}</p>
                    <p>暱稱: {parent.nickname}</p>
                    <p>電子郵件: {parent.email}</p>
                    <p>電話: {parent.phone}</p>
                  </Link>
                  <WhatsAppButton whatappmessage={parent.phone} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">無家長數據</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentsListsbysupadmin;