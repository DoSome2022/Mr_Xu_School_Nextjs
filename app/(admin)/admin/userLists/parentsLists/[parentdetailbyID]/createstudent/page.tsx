"use client";

import Student_Create_Form from "@/components/CreateForm/Student-Create-Form";

const CreateStudent = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <div className="bg-[#e7915b] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">建立學生</h1>
        <Student_Create_Form />
      </div>
    </div>
  );
};

export default CreateStudent;