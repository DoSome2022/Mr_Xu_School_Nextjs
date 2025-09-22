import Link from "next/link";

interface School {
  id: string;
  school_name: string;
}

interface SchoolDetailListsProps {
  data: School[]; // 接受單個 School 物件，而不是陣列
  supadminid: string
}

const SchoolDetailListsbysupadmin = ({ data, supadminid }: SchoolDetailListsProps) => {

  // 檢查 data 是否為非空陣列
  if (!data || data.length === 0) {
    return (
      <div className="p-5 max-w-4xl mx-auto pt-20">
        <p className="text-red-500">未找到學校資料</p>
      </div>
    );
  }

  const school = data[0];

  return (
    <>
      <br />
      學校名稱: {school.school_name}
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminid}/schoolLists/${school.id}/bookLists`}>
        書單列表
      </Link>
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminid}/schoolLists/${school.id}/expageLists`}>
        考試卷
      </Link>
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminid}/schoolLists/${school.id}/exscopeLists`}>
        考試範圍
      </Link>
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminid}/schoolLists/${school.id}/extimeLists`}>
        考試時間
      </Link>
      <br />
      <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminid}/schoolLists/${school.id}/schooltimetableLists`}>
        學校時間表
      </Link>
    </>
  );
};

export default SchoolDetailListsbysupadmin;