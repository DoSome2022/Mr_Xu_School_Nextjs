"use client";

import { useParams } from "next/navigation";
import Link from "next/link";


const UserListsbysupadmin = () => {
  const params = useParams();
  const supadminId = params?.supadminid as string;
  console.log("params :" , params , "-- END --")

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">用戶列表</h1>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
          <div className="space-y-4">
            <Link
              href={`/supadmin/${supadminId}/userLists/parentsLists`}
              className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium text-center"
            >
              家長列表
            </Link>
            <Link
              href={`/supadmin/${supadminId}/userLists/teachersLists`}
              className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium text-center"
            >
              老師列表
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListsbysupadmin;