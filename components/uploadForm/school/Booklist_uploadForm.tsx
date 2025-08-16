"use client";

import BookList_Create_Form from "@/components/CreateForm/BookList-Create-Form";
import { useEffect, useState } from "react";

interface SchoolData {
  id: string;
  school_name: string;
}

interface Booklist_uploadFormProps {
  SchoolId: string;
}

const Booklist_uploadForm = ({ SchoolId }: Booklist_uploadFormProps) => {
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (SchoolId) {
      const getSchoolDetail = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/School_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法載入學校資料");
          }
          const result = await res.json();
          if (!result || typeof result !== "object") {
            throw new Error("無效的資料格式");
          }
          setSchoolData(result);
        } catch (error: any) {
          console.error("載入錯誤:", error);
          setError(error.message || "無法載入學校資料");
        } finally {
          setLoading(false);
        }
      };
      getSchoolDetail(SchoolId);
    } else {
      setError("無效的學校ID");
      setLoading(false);
    }
  }, [SchoolId]);

  if (loading) {
    return <p className="text-gray-600 text-lg">正在加載...</p>;
  }

  if (error || !schoolData) {
    return (
      <p className="text-red-500 bg-red-100 p-3 rounded-md">
        {error || "無學校資料"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">上傳書單 - {schoolData.school_name}</h2>
      <BookList_Create_Form SchoolId={SchoolId} data={schoolData} />
    </div>
  );
};

export default Booklist_uploadForm;