"use client";


import New_Create_Form_bysupadmin from "@/components/CreateForm/SUPADMIN/Sup-New-Create-Form";

const CreateNewsbysupadmin = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">建立公告</h1>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
          <New_Create_Form_bysupadmin />
        </div>
      </div>
    </div>
  );
};

export default CreateNewsbysupadmin;