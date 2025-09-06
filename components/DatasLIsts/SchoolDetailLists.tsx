import Link from "next/link";

interface School {
  id: string;
  school_name: string;
}

// 更新介面，將 data 定義為單個 School 對象
interface SchoolDetailListsProps {
  data: School;
}

const SchoolDetailLists = ({ data }: SchoolDetailListsProps) => {
  return (
    <div>
      <p>學校名稱: {data.school_name}</p>
      <div className="space-y-2">
        <Link
          className="block text-stone-950 hover:text-gray-700"
          href={`/admin/schoolLists/${data.id}/bookLists`}
        >
          書單列表
        </Link>
        <Link
          className="block text-stone-950 hover:text-gray-700"
          href={`/admin/schoolLists/${data.id}/expageLists`}
        >
          考試卷
        </Link>
        <Link
          className="block text-stone-950 hover:text-gray-700"
          href={`/admin/schoolLists/${data.id}/exscopeLists`}
        >
          考試範圍
        </Link>
        <Link
          className="block text-stone-950 hover:text-gray-700"
          href={`/admin/schoolLists/${data.id}/extimeLists`}
        >
          考試時間
        </Link>
        <Link
          className="block text-stone-950 hover:text-gray-700"
          href={`/admin/schoolLists/${data.id}/schooltimetableLists`}
        >
          學校時間表
        </Link>
      </div>
    </div>
  );
};

export default SchoolDetailLists;