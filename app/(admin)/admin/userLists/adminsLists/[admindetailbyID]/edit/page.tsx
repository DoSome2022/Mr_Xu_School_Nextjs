"use client";
import Admin_Update_Form from "@/components/UpdateForm/Admin-Update-Form";

const AdminDetailEdit = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100 pt-20 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-[#e7915b] mb-6">
            Edit Admin Details
          </h1>
          <Admin_Update_Form />
        </div>
      </div>
    </>
  );
};

export default AdminDetailEdit;