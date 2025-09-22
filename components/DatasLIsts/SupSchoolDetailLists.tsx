import Link from "next/link";

interface School {
  id: string;
  school_name: string;
}

// 更新介面，將 data 定義為 School 陣列
interface SchoolDetailListsProps {
  data: School[];
}

const SupSchoolDetailLists = ({ data }: SchoolDetailListsProps) => {
  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.id} className="border-b border-gray-200 pb-4 last:border-b-0">
          <p className="text-gray-800 font-semibold">學校名稱: {d.school_name}</p>
          <div className="space-y-2 mt-2">
            <Link
              className="block text-stone-950 hover:text-gray-700"
              href={`/admin/schoolLists/${d.id}/bookLists`}
            >
              書單列表
            </Link>
            <Link
              className="block text-stone-950 hover:text-gray-700"
              href={`/admin/schoolLists/${d.id}/expageLists`}
            >
              考試卷
            </Link>
            <Link
              className="block text-stone-950 hover:text-gray-700"
              href={`/admin/schoolLists/${d.id}/exscopeLists`}
            >
              考試範圍
            </Link>
            <Link
              className="block text-stone-950 hover:text-gray-700"
              href={`/admin/schoolLists/${d.id}/extimeLists`}
            >
              考試時間
            </Link>
            <Link
              className="block text-stone-950 hover:text-gray-700"
              href={`/admin/schoolLists/${d.id}/schooltimetableLists`}
            >
              學校時間表
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupSchoolDetailLists;