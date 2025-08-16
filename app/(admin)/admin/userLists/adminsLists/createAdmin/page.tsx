"use client";

import Admin_Create_Form from "@/components/CreateForm/Sup-Admin-Create-Form";

const CreateAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <div className="bg-[#e7915b] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">建立管理員用戶</h1>
        <Admin_Create_Form />
      </div>
    </div>
  );
};

export default CreateAdmin;