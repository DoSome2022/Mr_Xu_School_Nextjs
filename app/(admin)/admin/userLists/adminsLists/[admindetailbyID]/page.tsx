"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const AdminDetail = () => {
  const params = useParams<{ admindetailbyID: string }>();
  const SupAdminID = params?.admindetailbyID as string;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#80A8BD] mb-6">
          Admin Detail
        </h1>
        <div className="flex flex-col space-y-4">
          <span className="text-lg text-gray-700">
            Admin ID: {SupAdminID}
          </span>
          <Link
            href={`/admin/userLists/adminsLists/${SupAdminID}/edit`}
            className="inline-block px-4 py-2 bg-[#80A8BD] text-white rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300 text-sm font-medium"
          >
            更改
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDetail;