// "use client";

// import { Logout_Button } from "@/components/logout_button";
// import TeacherNavber from "../_components/navbar";
// import { useSession } from "next-auth/react";

// const nodeLists = () => {
//     const session = useSession();

//     console.log("--teacher_session data : --  ",session?.data?.user,"-- END --")
  
//     const teacherId = session?.data.user?.id ; 
  
//     console.log("id : " , teacherId);
//     return(
//         <>
//         <div className="container mx-auto h-full w-full bg-blue-200 p-4">
//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-6">
//         <div className="col-span-6 flex justify-between items-center">
//         <p className="text-gray-500">nodeLists</p>
//         <div className="flex space-x-2">

//         <input type="text" placeholder="搜尋" name="search" className="p-2 border rounded" />
//         <button className="bg-blue-400 text-white px-4 py-2 rounded">GO</button>
//         <Logout_Button />
//         </div>
//         </div>
//         <TeacherNavber teacherId={teacherId} />
//         <div className="col-span-5 mt-8">
//         <table className="table-auto w-full border-collapse">


//         </table>
//         </div>
//         </div>
//         </div>
            
//         </>
//     )
// }

// export default nodeLists


"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Logout_Button } from "@/components/logout_button";
import TeacherNavber from "../_components/navbar";

// 定義會話用戶型別
interface SessionUser {
  id: string;
  role: string;
  staff: boolean;
  isAdmin: boolean;
  username?: string;
  email?: string;
  nickname?: string;
}

const NodeLists = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ teacherId: string }>();
  const teacherId = params?.teacherId as string;

  // 身份驗證和權限檢查
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/stafflogin");
    } else if (session?.user.id !== teacherId || session?.user.role !== "TEACHER") {
      router.push("/auth/error?error=AccessDenied");
    }
  }, [status, session, teacherId, router]);

  if (status === "loading") {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null; // 重定向後無需渲染
  }

  console.log("-- teacher_session data : -- ", session.user, "-- END --");
  console.log("id : ", teacherId);

  return (
    <div className="container mx-auto h-full w-full bg-blue-200 p-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-6">
        <div className="col-span-6 flex justify-between items-center">
          <p className="text-gray-500">NodeLists</p>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="搜尋"
              name="search"
              className="p-2 border rounded"
            />
            <button className="bg-blue-400 text-white px-4 py-2 rounded">GO</button>
            <Logout_Button />
          </div>
        </div>
        <TeacherNavber teacherId={teacherId} />
        <div className="col-span-5 mt-8">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">節點名稱</th>
                <th className="border px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {/* TODO: 從 API 獲取節點數據並渲染 */}
              <tr>
                <td className="border px-4 py-2">暫無數據</td>
                <td className="border px-4 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NodeLists;