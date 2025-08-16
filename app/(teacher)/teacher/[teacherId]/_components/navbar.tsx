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
            <ul className="list-none p-0 w-full bg-white border border-blue-200">
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