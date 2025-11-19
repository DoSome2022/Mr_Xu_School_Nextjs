"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// 定義 Product 介面，與 API 返回的數據結構匹配
interface Product {
  id: string;
  name: string; // 統一使用 name（根據 GetProductData.map 中的 data.name）
  description: string;
  price: number;
  createAt: string;
  updatedAt: string;
}

const ProductLists = () => {
  // 為 GetProductData 和 searchResults 指定類型
  const params = useParams();
  const supadminid = params.supadminid as string ;
  const [GetProductData, setGetProductData] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchField, setSearchField] = useState("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("params : ", params)

  // 拿商品 data
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/Product_Lists", {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("無法載入商品資料");
        }
        const result: Product[] = await res.json(); // 明確指定返回類型
        setGetProductData(result);
      } catch (err: any) {
        console.error("載入錯誤:", err);
        setError(err.message || "無法載入商品資料");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, []);

  // 修正 handleSearch 的事件類型
  const handleSearch = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // 防止按鈕觸發表單提交（如果在表單中）
    try {
      const response = await fetch(
        `/api/Product_Lists_search?query=${encodeURIComponent(searchQuery)}&field=${searchField}`
      );
      if (!response.ok) {
        throw new Error("搜尋失敗");
      }
      const data: Product[] = await response.json(); // 明確指定返回類型
      setSearchResults(data);
    } catch (err: any) {
      console.error("搜尋失敗:", err);
      setError(err.message || "搜尋失敗，請稍後重試");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">商品列表</h1>
          <Link
            href={`/supadmin/${supadminid}/productLists/createproduct`}
            className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            建立商品
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">搜尋商品</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="輸入搜尋內容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-gray-300 rounded-md p-2 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
              />
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="border-gray-300 rounded-md p-2 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
              >
                <option value="all">所有字段</option>
                <option value="name">商品名稱</option>
                <option value="description">商品詳情</option>
                <option value="price">商品價格</option>
              </select>
              <Button
                onClick={handleSearch}
                className="bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
              >
                搜尋
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">搜尋結果</h3>
              <div className="space-y-4">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    href={`/supadmin/${supadminid}/productLists/${p.id}`}
                    className="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-300"
                  >
                    <h4 className="text-gray-800 font-medium">{p.name}</h4>
                    <p className="text-gray-600 text-sm">{p.description}</p>
                    <p className="text-gray-500 text-sm">價格: {p.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">所有商品</h2>
          {GetProductData.length > 0 ? (
            <div className="space-y-4">
              {GetProductData.map((data) => (
                <Link
                  key={data.id}
                  href={`/supadmin/${supadminid}/productLists/${data.id}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-300"
                >
                  <h4 className="text-gray-800 font-medium">{data.name}</h4>
                  <p className="text-gray-600 text-sm">{data.description}</p>
                  <p className="text-gray-500 text-sm">價格: {data.price}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暫無商品資料</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductLists;