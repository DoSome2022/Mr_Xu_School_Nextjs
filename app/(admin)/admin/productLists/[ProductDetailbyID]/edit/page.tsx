"use client";

import Product_Update_Form from "@/components/UpdateForm/Product-Update-Form";
import Link from "next/link";

const ProductDetailEdit = () => {
  return (
    <div className="min-h-screen bg-[#e7915b] flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[#e7915b]">
            編輯商品
          </h1>
          <Link
            href="/admin/productLists"
            className="inline-block px-3 py-2 text-[#e7915b] hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
          >
            返回商品列表
          </Link>
        </div>
        <Product_Update_Form />
      </div>
    </div>
  );
};

export default ProductDetailEdit;