"use client";

import CreateColorForm from "@/components/CreateForm/create-color-Form";
import Link from "next/link";
import { useParams } from "next/navigation";

const CreateColorPage = () => {
  const params = useParams();
  console.log(params);
  const UserId = params.id as string;

  return (
    <div className="flex flex-col min-h-screen bg-white font-noto-sans-tc p-4 sm:p-8">
      <div className="max-w-md mx-auto w-full space-y-6">
        <Link
          href={`/user/${UserId}/admin/colorLists`}
          className="text-primary-1 hover:bg-grey-2 rounded-md px-4 py-2 inline-block transition-colors duration-300"
        >
          返回顏色列表
        </Link>
        <CreateColorForm />
      </div>
    </div>
  );
};

export default CreateColorPage;