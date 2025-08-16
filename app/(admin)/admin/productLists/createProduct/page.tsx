"use client";

import Product_Create_Form from "@/components/CreateForm/Product-Ceate-Form";
import Link from "next/link";

const CreateProduct = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-20"> {/* 留出空間給固定導航欄 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">建立商品</h1>
          <Link
            href="/admin/productLists"
            className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            返回商品列表
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Product_Create_Form />
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;