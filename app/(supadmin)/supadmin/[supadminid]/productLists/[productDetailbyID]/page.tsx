"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductDetailLists from "@/components/DatasLIsts/ProductDetailList";

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

const ProductDetailbysupadmin = () => {
  const params = useParams();
  const productId = params?.productDetailbyID as string;
  const supadminid = params?.supadminid as string;
const [productData, setProductData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("params : ", params)



useEffect(() => {
  if (productId) {
    const getProductDetail = async (id: string) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Product_detail_data_by_id/${id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("無法獲取商品詳情數據");
        }
        const result: Product[] = await res.json();
        if (result.length > 0) {
          setProductData(result); // 設置整個陣列
        } else {
          setError("未找到商品數據");
        }
      } catch (error: any) {
        console.error("獲取商品詳情失敗:", error);
        setError("無法載入商品詳情");
      } finally {
        setLoading(false);
      }
    };
    getProductDetail(productId);
  }
}, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-medium">正在載入...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

// 渲染邏輯
if (!productData || productData.length === 0) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500 text-sm font-medium">無商品數據</p>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gray-100">
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-600">商品詳情</h1>
        <Link
          href={`/supadmin/${supadminid}/productLists/${productData[0].id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
        >
          更改商品
        </Link>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <ProductDetailLists data={productData} />
      </div>
    </div>
  </div>
);
};

export default ProductDetailbysupadmin;