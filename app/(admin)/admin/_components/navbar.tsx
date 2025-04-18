"use client"
import { Logout_Button } from "@/components/logout_button"
import Link from "next/link"



const HeaderLinks = [
    {
        "id": "1",
        "name": "admin主頁",
        "path" : "/admin"
    },
    {
        "id": "2",
        "name": "申請列表",
        "path" : "/admin/applyLists"
    },
    {
        "id": "3",
        "name": "課程列表",
        "path" : "/admin/courseLists"
    },
    {
        "id": "4",
        "name": "公告列表",
        "path" : "/admin/newsLists"
    },
    {
        "id": "5",
        "name": "商品列表",
        "path" : "/admin/productLists"
    },
    {
        "id": "6",
        "name": "學校列表",
        "path" : "/admin/schoolLists"
    },
    {
        "id": "7",
        "name": "老師帳單",
        "path" : "/admin/teacherBills"
    },
    {
        "id": "8",
        "name": "用戶列表",
        "path" : "/admin/userLists"
    },
    {
        "id": "9",
        "name": "時間模組",
        "path" : "/admin/timetemplateLists"
    },
    {
        "id": "10",
        "name": "設定公眾假期",
        "path" : "/admin/setpublicholidaysLists"
    },
    {
        "id": "11",
        "name": "提示列表",
        "path" : "/admin/TipsLists"
    },
]


 export const AdminNavbar = () => {

    return(
        <>
    <nav className="bg-blue-500 p-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="space-x-4">
        {HeaderLinks.map((link)=>{
            return(
                <Link key={`${link.id}`} className="text-white hover:text-gray-300" href={`${link.path}`}>
                    {link.name}
                </Link>
            )
        })}

      </div>
      <div>

<Logout_Button />
      </div>
    </div>
  </nav>
        
        
        </>
    )


}










