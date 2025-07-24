import Link from "next/link";

interface School {
  id: string;
  school_name: string;
}

interface SchoolDetailListsProps {
  data: School; // 接受單個 School 物件，而不是陣列
}

const SchoolDetailListsbysupadmin = ({ data }: SchoolDetailListsProps) => {
  return (
    <>
      <br />
      學校名稱: {data.school_name}
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/admin/schoolLists/${data.id}/bookLists`}>
        書單列表
      </Link>
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/admin/schoolLists/${data.id}/expageLists`}>
        考試卷
      </Link>
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/admin/schoolLists/${data.id}/exscopeLists`}>
        考試範圍
      </Link>
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/admin/schoolLists/${data.id}/extimeLists`}>
        考試時間
      </Link>
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/admin/schoolLists/${data.id}/schooltimetableLists`}>
        學校時間表
      </Link>
    </>
  );
};

export default SchoolDetailListsbysupadmin;