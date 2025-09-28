"use client";

import EX_Pager_Create_Form from "@/components/CreateForm/EX-Pager-Create-Form";
import { useEffect, useState } from "react";

interface SchoolID {
  id: string;
  school_name: string;
}

interface EX_Pager_Create_FormProps {
  SchoolId: string;
}

const Ex_pager_uploadForm = ({ SchoolId }: EX_Pager_Create_FormProps) => {
  const [GetSchoolById, setGetSchoolById] = useState<SchoolID[]>([]);

  useEffect(() => {
    if (SchoolId) {
      const getSchoolDetail = async (id: string) => {
        try {
          const res = await fetch(`/api/School_detail_data_by_id/${id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
          if (!res.ok) {
            throw new Error("無法連線！");
          }
          const result = await res.json();
          setGetSchoolById(result);
        } catch (error) {
          console.error(error);
        }
      };
      getSchoolDetail(SchoolId);
    }
  }, [SchoolId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">試卷上傳表單</h2>
      <EX_Pager_Create_Form SchoolId={SchoolId} data={GetSchoolById} />
    </div>
  );
};

export default Ex_pager_uploadForm;