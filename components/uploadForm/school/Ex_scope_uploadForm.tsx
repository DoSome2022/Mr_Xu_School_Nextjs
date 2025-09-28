"use client";

import EX_Scope_Create_Form from "@/components/CreateForm/EX-Scope-Create-Form";
import { useEffect, useState } from "react";

interface SchoolData {
  id: string;
  school_name: string;
}

interface Ex_scope_uploadFormProps {
  SchoolId: string;
}

const Ex_scope_uploadForm = ({ SchoolId }: Ex_scope_uploadFormProps) => {
  const [GetSchoolById, setGetSchoolById] = useState<SchoolData[]>([]);

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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">考試範圍上傳表單</h2>
      <EX_Scope_Create_Form SchoolId={SchoolId} data={GetSchoolById} />
    </div>
  );
};

export default Ex_scope_uploadForm;