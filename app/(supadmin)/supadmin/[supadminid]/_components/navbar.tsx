"use client";
import { useState } from "react";
import { Logout_Button } from "@/components/logout_button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Menu, X } from "lucide-react"; // 使用 lucide-react 提供漢堡選單圖標

export const SupAdminNavbar = () => {
  const params = useParams();
  const supadminid = params?.supadminid as string;

  // 控制移動端選單的開關狀態
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const HeaderLinks = [
    { id: "1", name: "主理員主頁", path: `/supadmin/${supadminid}` },
    { id: "2", name: "申請列表", path: `/supadmin/${supadminid}/applyLists` },
    { id: "3", name: "課程列表", path: `/supadmin/${supadminid}/courseLists` },
    { id: "4", name: "公告列表", path: `/supadmin/${supadminid}/newsLists` },
    { id: "5", name: "商品列表", path: `/supadmin/${supadminid}/productLists` },
    { id: "6", name: "學校列表", path: `/supadmin/${supadminid}/schoolLists` },
    { id: "8", name: "用戶列表", path: `/supadmin/${supadminid}/userLists` },
    { id: "9", name: "時間模組", path: `/supadmin/${supadminid}/timetemplateLists` },
    { id: "10", name: "設定公眾假期", path: `/supadmin/${supadminid}/setpublicholidaysLists` },
    { id: "11", name: "提示列表", path: `/supadmin/${supadminid}/TipsLists` },
    { id: "12", name: "單據列表", path: `/supadmin/${supadminid}/InvoiceLists` },
    { id: "13", name: "收據列表", path: `/supadmin/${supadminid}/ReceiptLists` },
    { id: "14", name: "課室列表", path: `/supadmin/${supadminid}/classroomLists` },
  ];

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左側標誌（可選，若需要可添加品牌標誌） */}
          <div className="text-white text-lg font-semibold">管理後台</div>

          {/* 桌面端導航鏈接 */}
          <div className="hidden lg:flex space-x-6">
            {HeaderLinks.map((link) => (
              <Link
                key={link.id}
                href={link.path}
                className="text-white hover:text-blue-200 transition-colors duration-200 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* 登出按鈕（桌面端） */}
          <div className="hidden lg:flex items-center">
            <Logout_Button />
          </div>

          {/* 移動端漢堡選單按鈕 */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* 移動端選單（展開時顯示） */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-2 pb-4">
            {HeaderLinks.map((link) => (
              <Link
                key={link.id}
                href={link.path}
                className="text-white hover:text-blue-200 transition-colors duration-200 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)} // 點擊鏈接後關閉選單
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2">
              <Logout_Button />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};