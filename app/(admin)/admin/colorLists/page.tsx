"use client";

import Link from "next/link";
import { useSession} from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ColorListsProps {
  color_name: string;
  id: string;
}

const ColorLists = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [GetColor, setGetColor] = useState<ColorListsProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  // 身份驗證檢查
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/stafflogin");
    }
  }, [status, router]);

  // 獲取顏色列表
  useEffect(() => {
    if (status === "authenticated") {
      const getColorLists = async () => {
        try {
          const res = await fetch(`/api/Colors_Lists`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error(`無法連線：${res.statusText}`);
          }
          const result = await res.json();
          if (!Array.isArray(result)) {
            throw new Error("無效的資料格式");
          }
          setGetColor(result);
        } catch (error) {
          console.error("獲取顏色列表失敗:", error);
          setError("無法載入顏色列表，請稍後重試");
          toast.error("無法載入顏色列表，請稍後重試");
        }
      };
      getColorLists();
    }
  }, [status]);

  // 處理移動端菜單切換
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isMobileMenuOpen ? "" : "hidden";
  };

  // 處理點擊外部關閉菜單
  const handleClickOutside = (e: MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
      setMobileMenuOpen(false);
      document.body.style.overflow = "";
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("session:", session);
    console.log("GetColor:", GetColor, "-- END --");
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* 導航條，應用 AdminNavbar 樣式 */}
      <nav className="w-full h-16 fixed top-0 left-0 z-50 bg-[#80A8BD] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-white text-xl font-bold tracking-tight">
                Admin Panel
              </Link>
            </div>
            <div ref={navbarRef} className="hidden md:flex items-center space-x-4">
              <Link
                href="/admin"
                prefetch={false}
                className="text-white text-sm font-medium hover:text-cyan-200 transition-colors duration-300"
              >
                Admin主頁
              </Link>
              <Link
                href="/admin/colorLists/createColor"
                prefetch={false}
                className="text-white text-sm font-medium hover:text-cyan-200 transition-colors duration-300"
              >
                createColor
              </Link>
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
            <Link
              href="/admin"
              prefetch={false}
              className="text-white text-xl font-medium hover:text-cyan-200 transition-colors duration-300"
              onClick={toggleMobileMenu}
            >
              Admin主頁
            </Link>
            <Link
              href="/admin/colorLists/createColor"
              prefetch={false}
              className="text-white text-xl font-medium hover:text-cyan-200 transition-colors duration-300"
              onClick={toggleMobileMenu}
            >
              createColor
            </Link>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-2xl font-semibold text-white mb-4">顏色列表</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {status === "loading" ? (
            <div className="text-gray-300 p-4">載入中...</div>
          ) : error ? (
            <div className="text-red-400 p-4 rounded-lg bg-red-900 bg-opacity-20">
              {error}
            </div>
          ) : GetColor.length === 0 ? (
            <div className="text-gray-300 p-4">無顏色資料</div>
          ) : (
            GetColor.map((d: ColorListsProps) => (
              <div key={d.id} className="flex items-center gap-2 my-2">
                <div
                  className="w-6 h-6 rounded border border-gray-200 shadow-sm"
                  style={{ backgroundColor: d.color_name }}
                />
                <div className="text-text-black">
                  顏色碼: <span className="font-mono text-black ">{d.color_name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorLists;