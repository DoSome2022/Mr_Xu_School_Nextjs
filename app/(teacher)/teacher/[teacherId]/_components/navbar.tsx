"use client"
import { Logout_Button } from "@/components/logout_button"
import Link from "next/link"

interface TeacherNavbarProps {
  teacherId: string
}

const TeacherNavber = ({ teacherId }: TeacherNavbarProps) => {

const HeaderLinks = [
    {
        "id": "1",
        "name": "個人信息",
        "path": `/teacher/${teacherId}/profiles`

    },
    {
        "id": "2",
        "name": "學生",
        "path": `/teacher/${teacherId}/studentLists`

    },
    {
        "id": "3",
        "name": "工作紀錄",
        "path": `/teacher/${teacherId}/workRecords`

    },
    // {
    //     "id": "4",
    //     "name": "筆記列表",
    //     "path": `/teacher/${teacherId}/nodeLists`

    // },
    {
        "id": "5",
        "name": "課程列表",
        "path": `/teacher/${teacherId}/courseLists`

    },
]
    return(
        <>
        <nav className="col-span-1" >
            <ul className="list-none p-0 w-full bg-[#80A8BD] border-blue-200">
                {HeaderLinks.map((d)=>{
                    return(
                        <>
                    <div className="border-b border-blue-200 text-center text-lg">
                    <Link 
                    key={`${d.id}`} 
                    href={`${d.path}`} 
                    className="block text-blue-600 p-4 hover:bg-blue-200"
                    >
                        {d.name}
                    </Link>    
                    </div>
                        </>
                    )
                })}

                <Logout_Button />

            </ul>
        </nav>
        </>
    )

}

export default TeacherNavber


// "use client";

// import { Logout_Button } from "@/components/logout_button";
// import Link from "next/link";

// interface TeacherNavbarProps {
//   teacherId: string;
// }

// const TeacherNavbar = ({ teacherId }: TeacherNavbarProps) => {
//   const HeaderLinks = [
//     { id: "1", name: "個人信息", path: `/teacher/${teacherId}/profiles` },
//     { id: "2", name: "學生", path: `/teacher/${teacherId}/studentLists` },
//     { id: "3", name: "工作紀錄", path: `/teacher/${teacherId}/workRecords` },
//     { id: "5", name: "課程列表", path: `/teacher/${teacherId}/courseLists` },
//   ];

//   return (
//     <nav className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-[#80A8BD] shadow-lg z-40 md:w-48 lg:w-64">
//       <ul className="list-none p-0 m-0 flex flex-col">
//         {HeaderLinks.map((link) => (
//           <li key={link.id} className="border-b border-[#6B8FA3]">
//             <Link
//               href={link.path}
//               className="block px-6 py-4 text-white text-lg font-medium hover:bg-[#6B8FA3] transition-colors duration-300"
//             >
//               {link.name}
//             </Link>
//           </li>
//         ))}
//         <li className="mt-auto px-6 py-4">
//           <Logout_Button />
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default TeacherNavbar;