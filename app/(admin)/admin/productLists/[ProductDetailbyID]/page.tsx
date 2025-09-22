"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductDetailLists from "@/components/DatasLIsts/ProductDetailList";

const ProductDetail = () => {
  const params = useParams();
  const productId = params?.ProductDetailbyID as string;

  const [GetProductDataById, setGetProductDataById] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const getProductDetail = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/Product_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法載入商品資料");
          }
          const result = await res.json();
          setGetProductDataById(result);
        } catch {
          console.error("載入錯誤:", error);
          setError("無法載入商品資料");
        } finally {
          setLoading(false);
        }
      };
      getProductDetail(productId);
    } else {
      setError("無效的商品ID");
      setLoading(false);
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !GetProductDataById) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error || "無商品資料"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">商品詳情</h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/productLists/${productId}/edit`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              更改商品
            </Link>
            <Link
              href="/admin/productLists"
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回商品列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <ProductDetailLists data={GetProductDataById} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;