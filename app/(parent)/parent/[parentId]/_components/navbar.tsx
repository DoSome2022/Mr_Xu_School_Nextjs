"use client";
import { Logout_Button } from "@/components/logout_button";
import Link from "next/link";
import { useParams } from "next/navigation";

export const ParentNavbar = () => {
  const param = useParams();
  const ParentID = param?.parentId as string;

  const HeaderLinks = [
    { id: "1", name: "苜頁", path: `/parent/${ParentID}` },
    { id: "2", name: "我的資料", path: `/parent/${ParentID}/profiles` },
    { id: "3", name: "子女課堂", path: `/parent/${ParentID}/studentLists` },
    { id: "4", name: "帳單列表", path: `/parent/${ParentID}/checkout` },
    { id: "5", name: "商店", path: `/parent/${ParentID}/shops` },
    { id: "6", name: "信息信箱", path: `/parent/${ParentID}/messageboxList` },
    { id: "7", name: "建立學生", path: `/parent/${ParentID}/createStudents` },
  ];

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row gap-4">
        {HeaderLinks.map((link) => (
          <Link key={link.id} href={link.path}>
            {link.name}
          </Link>
        ))}
      </div>
      <Logout_Button />
    </div>
  );
};