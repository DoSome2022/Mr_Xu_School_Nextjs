"use client";

import Link from "next/link";

interface School {
  id: string;
  school_name: string;
}

// 更新介面，將 data 定義為 School 陣列
interface SchoolDetailListsProps {
  data: School[];
}

const SchoolDetailLists = ({ data }: SchoolDetailListsProps) => {
  console.log("schoolDetailData : ", data);

  // 檢查 data 是否為非空陣列
  if (!data || data.length === 0) {
    return (
      <div className="p-5 max-w-4xl mx-auto pt-20">
        <p className="text-red-500">未找到學校資料</p>
      </div>
    );
  }

  // 取得第一個學校物件
  const school = data[0];

  return (
    <div className="p-5 max-w-4xl mx-auto pt-20">
      <p className="font-semibold text-lg mb-4">學校名稱: {school.school_name}</p>
      <div className="space-y-2">
        <Link
          className="block text-stone-950 hover:text-gray-700"
          href={`/admin/schoolLists/${school.id}/bookLists`}
        >
          書單列表
        </Link>
        <Link
          className="block text-stone-950 hover:text-gray-700"
          href={`/admin/schoolLists/${school.id}/expageLists`}
        >
          考試卷
        </Link>
        <Link
          className="block text-stone-950 hover:text-gray-700"
          href={`/admin/schoolLists/${school.id}/exscopeLists`}
        >
          考試範圍
        </Link>
        <Link
          className="block text-stone-950 hover:text-gray-700"
          href={`/admin/schoolLists/${school.id}/extimeLists`}
        >
          考試時間
        </Link>
        <Link
          className="block text-stone-950 hover:text-gray-700"
          href={`/admin/schoolLists/${school.id}/schooltimetableLists`}
        >
          學校時間表
        </Link>
      </div>
    </div>
  );
};

export default SchoolDetailLists;