"use client";

import { Logout_Button } from "@/components/logout_button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export const AdminNavbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isMobileMenuOpen ? "" : "hidden";
  };

  const ToggleLinks = [
    { id: "1", name: "admin主頁", path: "/admin" },
    { id: "2", name: "申請列表", path: "/admin/applyLists" },
    { id: "3", name: "課程列表", path: "/admin/courseLists" },
    { id: "4", name: "公告列表", path: "/admin/newsLists" },
    { id: "5", name: "商品列表", path: "/admin/productLists" },
    { id: "6", name: "學校列表", path: "/admin/schoolLists" },
    { id: "7", name: "老師帳單", path: "/admin/teacherBills" },
    { id: "8", name: "用戶列表", path: "/admin/userLists" },
    { id: "9", name: "時間模組", path: "/admin/timetemplateLists" },
    { id: "10", name: "設定公眾假期", path: "/admin/setpublicholidaysLists" },
    { id: "11", name: "提示列表", path: "/admin/TipsLists" },
    { id: "12", name: "單據列表", path: "/admin/InvoiceLists" },
    { id: "13", name: "收據列表", path: "/admin/ReceiptLists" },
    { id: "14", name: "課室列表", path: "/admin/classroomLists" },
    { id: "15", name: "顏色列表", path: "/admin/colorLists" },
  ];

  const HeaderLinks = [
    { id: "1", name: "管理課程", path: "" },
    { id: "2", name: "用戶列表", path: "/admin/userLists" },
    { id: "3", name: "帳單", path: "" },
    { id: "4", name: "其他設置", path: "" },
    { id: "5", name: "提示列表", path: "/admin/TipsLists" },
  ];

  const CourseLinks = [
    { id: "1", name: "時間模組", path: "/admin/timetemplateLists" },
    { id: "2", name: "課程列表", path: "/admin/courseLists" },
    { id: "3", name: "商品列表", path: "/admin/productLists" },
    { id: "4", name: "申請列表", path: "/admin/applyLists" },
  ];

  const PaymentLinks = [
    { id: "1", name: "發票列表", path: "/admin/InvoiceLists" },
    { id: "2", name: "收據列表", path: "/admin/ReceiptLists" },
    { id: "3", name: "老師帳單", path: "/admin/teacherBills" },
  ];

  const SettingLinks = [
    { id: "1", name: "公告列表", path: "/admin/newsLists" },
    { id: "2", name: "設定公眾假期", path: "/admin/setpublicholidaysLists" },
    { id: "3", name: "學校列表", path: "/admin/schoolLists" },
    { id: "5", name: "課室列表", path: "/admin/classroomLists" },
    { id: "6", name: "顏色列表", path: "/admin/colorLists" },
  ];

  const getDropdownLinks = (name: string) => {
    switch (name) {
      case "管理課程":
        return CourseLinks;
      case "帳單":
        return PaymentLinks;
      case "其他設置":
        return SettingLinks;
      default:
        return [];
    }
  };

  const toggleDropdown = (linkId: string) => {
    setActiveDropdown(activeDropdown === linkId ? null : linkId);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full h-15 fixed top-0 left-0 z-50 bg-[#80A8BD] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center text-white">
              <span className="text-xl font-bold tracking-tight">Admin Panel</span>
            </Link>
          </div>
          <div ref={navbarRef} className="hidden md:flex items-center space-x-4 relative">
            {HeaderLinks.map((link) => {
              const dropdownLinks = getDropdownLinks(link.name);
              const hasDropdown = dropdownLinks.length > 0;
              const isActive = activeDropdown === link.id;

              return (
                <div key={link.id} className="relative">
                  <div
                    className="px-3 py-2 text-white hover:text-cyan-200 transition-colors duration-300 text-sm font-medium flex items-center cursor-pointer"
                    onClick={() => hasDropdown && toggleDropdown(link.id)}
                  >
                    {hasDropdown ? (
                      <>
                        {link.name}
                        <svg
                          className={`w-4 h-4 ml-1 transform transition-transform ${isActive ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    ) : (
                      <Link href={link.path} className="text-white hover:text-cyan-200">
                        {link.name}
                      </Link>
                    )}
                  </div>

                  {hasDropdown && isActive && (
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        {dropdownLinks.map((subLink) => (
                          <Link
                            key={subLink.id}
                            href={subLink.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <Logout_Button />
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-[#80A8BD] bg-opacity-95 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center h-full space-y-6 transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {ToggleLinks.map((link) => (
            <Link
              key={link.id}
              href={link.path}
              className="text-white text-xl font-medium hover:text-cyan-200 transition-colors duration-300"
              onClick={toggleMobileMenu}
            >
              {link.name}
            </Link>
          ))}
          <Logout_Button />
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;


// "use client";

// import { Logout_Button } from "@/components/logout_button";
// import Link from "next/link";
// import { useState } from "react";

// const HeaderLinks = [
//   { id: "1", name: "admin主頁", path: "/admin" },
//   { id: "2", name: "申請列表", path: "/admin/applyLists" },
//   { id: "3", name: "課程列表", path: "/admin/courseLists" },
//   { id: "4", name: "公告列表", path: "/admin/newsLists" },
//   { id: "5", name: "商品列表", path: "/admin/productLists" },
//   { id: "6", name: "學校列表", path: "/admin/schoolLists" },
//   { id: "7", name: "老師帳單", path: "/admin/teacherBills" },
//   { id: "8", name: "用戶列表", path: "/admin/userLists" },
//   { id: "9", name: "時間模組", path: "/admin/timetemplateLists" },
//   { id: "10", name: "設定公眾假期", path: "/admin/setpublicholidaysLists" },
//   { id: "11", name: "提示列表", path: "/admin/TipsLists" },
//   { id: "12", name: "單據列表", path: "/admin/InvoiceLists" },
//   { id: "13", name: "收據列表", path: "/admin/ReceiptLists" },
//   { id: "14", name: "課室列表", path: "/admin/classroomLists" },
// ];

// export const AdminNavbar = () => {
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!isMobileMenuOpen);
//     document.body.style.overflow = isMobileMenuOpen ? "" : "hidden";
//   };

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-[#80A8BD] shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <Link href="/admin" className="flex items-center text-white">
//               <span className="text-xl font-bold tracking-tight">Admin Panel</span>
//             </Link>
//           </div>
//           <div className="hidden md:flex items-center space-x-4">
//             {HeaderLinks.map((link) => (
//               <Link
//                 key={link.id}
//                 href={link.path}
//                 className="px-3 py-2 text-white hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
//               >
//                 {link.name}
//               </Link>
//             ))}
//             <Logout_Button />
//           </div>
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={toggleMobileMenu}
//               className="text-white focus:outline-none p-2"
//               aria-label="Toggle menu"
//             >
//               <svg
//                 className="w-6 h-6"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//       <div
//         className={`fixed inset-0 bg-[#e7915b] bg-opacity-95 z-40 transition-opacity duration-300 ${
//           isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//       >
//         <div
//           className={`flex flex-col items-center justify-center h-full space-y-6 transform transition-transform duration-300 ${
//             isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
//           }`}
//         >
//           {HeaderLinks.map((link) => (
//             <Link
//               key={link.id}
//               href={link.path}
//               className="text-white text-xl font-medium hover:text-cyan-200 transition-colors duration-300"
//               onClick={toggleMobileMenu}
//             >
//               {link.name}
//             </Link>
//           ))}
//           <Logout_Button />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default AdminNavbar;