"use client";

import EX_Time_Create_Form from "@/components/CreateForm/EX-Time-Create-Form";
import { useEffect, useState } from "react";

interface SchoolData {
  id: string;
  school_name: string;
}

interface Ex_timetable_uploadFormProps {
  SchoolId: string;
}

const Ex_timetable_uploadForm = ({ SchoolId }: Ex_timetable_uploadFormProps) => {
  const [GetSchoolById, setGetSchoolById] = useState<SchoolData[]>([]);

  useEffect(() => {
    if (SchoolId) {
      const getSchoolDetail = async (id: string) => {
        try {
          const res = await fetch(`/api/School_detail_data_by_id/${id}`);
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
      <h2 className="text-xl font-semibold text-gray-800">考試時間表上傳表單</h2>
      <EX_Time_Create_Form SchoolId={SchoolId} data={GetSchoolById} />
    </div>
  );
};

export default Ex_timetable_uploadForm;