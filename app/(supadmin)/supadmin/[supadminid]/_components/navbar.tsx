"use client";
import { Logout_Button } from "@/components/logout_button";
import Link from "next/link";
import { useParams } from "next/navigation";


export const SupAdminNavbar = () =>{

    const params = useParams();
    const supadminid = params?.supadminid as string;

    console.log("params : ",  params , "-- End --")

    console.log(" supadminid : " , supadminid , "-- End --")

    const HeaderLinks = [
    {
        "id": "1",
        "name": "主理員主頁",
        "path" : `/supadmin/${supadminid}`
    },
    {
        "id": "2",
        "name": "申請列表",
        "path" : `/supadmin/${supadminid}/applyLists`
    },
    {
        "id": "3",
        "name": "課程列表",
        "path" : `/supadmin/${supadminid}/courseLists`
    },
    {
        "id": "4",
        "name": "公告列表",
        "path" : `/supadmin/${supadminid}/newsLists`
    },
    {
        "id": "5",
        "name": "商品列表",
        "path" : `/supadmin/${supadminid}/productLists`
    },
    {
        "id": "6",
        "name": "學校列表",
        "path" : `/supadmin/${supadminid}/schoolLists`
    },
    {
        "id": "8",
        "name": "用戶列表",
        "path" : `/supadmin/${supadminid}/userLists`
    },
    {
        "id": "9",
        "name": "時間模組",
        "path" : `/supadmin/${supadminid}/timetemplateLists`
    },
    {
        "id": "10",
        "name": "設定公眾假期",
        "path" : `/supadmin/${supadminid}/setpublicholidaysLists`
    },
    {
        "id": "11",
        "name": "提示列表",
        "path" : `/supadmin/${supadminid}/TipsLists`
    },
    {
        "id": "11",
        "name": "單據列表",
        "path" : `/supadmin/${supadminid}/InvoiceLists`
    },
    {
        "id": "11",
        "name": "收據列表",
        "path" : `/supadmin/${supadminid}/ReceiptLists`
    },
    {
        "id": "12",
        "name": "課室列表",
        "path" : `/supadmin/${supadminid}/classroomLists`
    },
]


    return (
        <>
    <nav className="bg-blue-500 p-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="space-x-4">
        {HeaderLinks.map((link)=>{
            return(
                <Link key={`${link.id}`} className="text-white hover:text-gray-300" href={`${link.path}`}>
                    {link.name}
                    <br />
                </Link>
            )
        })}

      </div>
      <div>
    <div className="flex flex-row justify-between"><Logout_Button /></div>
      </div>
    </div>
  </nav>
        
        
        </>

    )
    
}