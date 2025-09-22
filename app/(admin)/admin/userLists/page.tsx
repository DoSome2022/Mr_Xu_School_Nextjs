"use client";

import Link from "next/link";

const UserLists = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-[#80A8BD] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">用戶列表</h1>
        <div className="flex flex-col space-y-4">
          <Link
            href="/admin/userLists/parentsLists"
            className="px-4 py-2 text-white hover:text-cyan-200 transition-colors duration-300 text-center font-medium"
          >
            家長列表
          </Link>
          <Link
            href="/admin/userLists/teachersLists"
            className="px-4 py-2 text-white hover:text-cyan-200 transition-colors duration-300 text-center font-medium"
          >
            老師列表
          </Link>
          <Link
            href="/admin/userLists/adminsLists"
            className="px-4 py-2 text-white hover:text-cyan-200 transition-colors duration-300 text-center font-medium"
          >
            管理員列表
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLists;