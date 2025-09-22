"use client";

import { useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  Course_id: string;
  product_price_record_id: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailListsProps {
  data: Product[]; // 修改為陣列
}

const ProductDetailLists = ({ data }: ProductDetailListsProps) => {

  console.log("ProductDetailLists data:", data);

  // 記錄數據以檢查問題
  useEffect(() => {
    console.log("ProductDetailLists data:", data);
  }, [data]);

  // 如果數據為空或無效，顯示提示
  if (!data || !data[0]) {
    return <p className="text-red-500">無商品數據可顯示</p>;
  }

  // 取第一個產品
  const product = data[0];

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold tracking-tight text-[#e7915b] mb-6">
        商品詳情
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-[#e7915b]">商品名稱</h3>
          <p className="text-gray-900 text-sm">{product.name || "無名稱"}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#e7915b]">商品描述</h3>
          <p className="text-gray-600 text-sm">{product.description || "無描述"}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#e7915b]">課程 ID</h3>
          <p className="text-gray-600 text-sm">{product.Course_id || "無課程 ID"}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#e7915b]">庫存數量</h3>
          <p className="text-gray-600 text-sm">{product.stock ?? "無庫存資料"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailLists;