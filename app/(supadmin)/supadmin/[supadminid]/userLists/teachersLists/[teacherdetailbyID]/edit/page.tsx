"use client";

import Teacher_Update_Form from "@/components/UpdateForm/Teacher-Update-Form";

const TeacherDetailEditbysupadmin = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <div className="bg-[#80A8BD] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">修改老師用戶</h1>
        <Teacher_Update_Form />
      </div>
    </div>
  );
};

export default TeacherDetailEditbysupadmin;