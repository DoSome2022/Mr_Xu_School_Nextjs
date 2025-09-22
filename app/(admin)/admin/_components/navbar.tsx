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
//     <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#e7915b]">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center">
//           <div className="flex space-x-4">
//             <Link href="/admin" className="flex items-center py-2 px-1 text-white">
//               <span className="text-xl font-bold">Admin Panel</span>
//             </Link>
//           </div>
//           <div className="hidden md:flex items-center space-x-1">
//             {HeaderLinks.map((link) => (
//               <Link
//                 key={link.id}
//                 href={link.path}
//                 className="py-5 px-3 text-white hover:text-cyan-200 transition-colors duration-300"
//               >
//                 {link.name}
//               </Link>
//             ))}
//             <Logout_Button />
//           </div>
//           <div className="md:hidden flex items-center">
//             <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
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
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//       <div
//         className={`fixed inset-0 bg-[#e7915b] bg-opacity-75 z-40 transition-opacity duration-300 ${
//           isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//       >
//         <div
//           className={`flex flex-col items-center justify-center h-full space-y-8 transform ${
//             isMobileMenuOpen
//               ? "translate-y-0"
//               : "translate-y-full transition-transform duration-300"
//           }`}
//         >
//           {HeaderLinks.map((link) => (
//             <Link
//               key={link.id}
//               href={link.path}
//               className="text-white text-2xl hover:text-blue-300 transition-colors duration-300"
//               onClick={toggleMobileMenu}
//             >
//               {link.name}
//             </Link>
//           ))}
//           <div className="py-5 px-3">
//             <Logout_Button />
//           </div>
//           <button
//             onClick={toggleMobileMenu}
//             className="text-white absolute top-6 right-6 p-2"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default AdminNavbar;


"use client";

import { Logout_Button } from "@/components/logout_button";
import Link from "next/link";
import { useState } from "react";

const HeaderLinks = [
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
];

export const AdminNavbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isMobileMenuOpen ? "" : "hidden";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#80A8BD] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center text-white">
              <span className="text-xl font-bold tracking-tight">Admin Panel</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {HeaderLinks.map((link) => (
              <Link
                key={link.id}
                href={link.path}
                className="px-3 py-2 text-white hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
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
        className={`fixed inset-0 bg-[#e7915b] bg-opacity-95 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center h-full space-y-6 transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {HeaderLinks.map((link) => (
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